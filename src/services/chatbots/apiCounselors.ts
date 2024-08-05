import type { ChatBot, ChatBotData, HistoryExchange } from "./types/chatbot";
import {
  addChatbotHistory,
  convertExchageToHistory,
  getChatbot,
} from "./apiChatbots";
import {
  GenerationConfig,
  Content,
  ChatSession,
  POSSIBLE_ROLES,
} from "firebase/vertexai-preview";
import { SystemInstructionsParts } from "../types/ai";
import { getChatbotHistory } from "./apiChatbots";
import {
  sendMessageStream,
  generateModel,
  getChatWithAi,
  generateSystemInstructions,
} from "../apiAI";
import { Kid, getAvatar, getKidByDisplayName } from "../apiKids";
import { deleteDocsFromCollection } from "../db";
import { Message, MessageStatus } from "../../components/chat/types/Messages.d";
import { Timestamp } from "firebase/firestore";
import { ChatRoom, RoomType } from "../../components/chatroom/types/Rooms.d";
import { addMessage } from "../apiMessages";
import { notifyParentOnMeetingRequest } from "../apiParentNotifications";
import { updateRoomData } from "../apiChatRooms";
import { app } from "../../../firebase";

const context = `
The Tree House chat is a safe chat for kids. If a kid sends a message that might be inappropriate, the message is removed. If an appropriate message is deleted by mistake, the sender can try to rephrase what they wanted to say. When a kid wants to start a private conversation with another kid, they can click on the other kid's avatar and then a private chat room is opened. If a kid would like to meet another kid IRL, they should tell you, and you can arrange it with both kids' parents.
`;
const objective = `
Your task is to look after the kids and make sure that they are having fun, learning social skills and being safe.
`;
const summary = `You serve as a grown up role model for these kids, and you show them how they can have fun and make new friends safely.`;
const contactParentsMessage = `I will contact your parents and send them the details of (the friend's name)'s parents, so they could arrange the meeting`;
const instructions = [
  `There could be more than one kid in the chat, so every message will start with the kid's name.`,
  `If a kid asks you a question, answer as accurately as possible. The kids might ask you questions about what is and is not possible in the app and how to do things, but you don't know all of the answers. If you don't know, admit it and suggest that they ask their parents.`,
  `The only app features that you know about are detailed here. Do not mention any other features that are not detailed here.`,
  `If kids want to meet other kids outside the app, tell them that you will contact the parents of both of the kids so the parents could arrange the meeting`,
  `When you tell then that you will contact the parents, you should use this format "${contactParentsMessage}". The words should be exactly as written here, other than the words in the parenthesis, that should be replaced with the friend's name.`,
  `Be kind and attentive to the kids`,
  `Speak to the kids in eye level so they could feel comfortable`,
  `Encourage the kids to make new friends`,
  `Don't encourage the kids to share information that might help people identify who they are outside the app`,
  `If they do share such information, tell them that it is not safe to share that information and that the message is deleted`,
  `Kids sometimes say things that might not be considered PC. If you are not sure how to respond, tell the kids that you don't know how to respond to what they just said`,
];
const format = `Keep your responses short.`;

class Counselor implements ChatBot {
  id: string;
  name: string;
  age: number;
  avatar: string;
  generationConfig: GenerationConfig;
  systemInstructions: SystemInstructionsParts;
  history: Content[];
  welcomeMessages: string[];
  chat: ChatSession | null;
  private nextResponseOverride: string | null = null;
  constructor(
    id: string,
    data: ChatBotData,
    counselorHistory: Content[] = [],
    private kidInfo: Kid
  ) {
    console.log("Creating counselor", id, data, counselorHistory);
    this.id = id;
    this.name = data.name;
    this.age = data.age;
    this.avatar = data.avatar;

    (this.welcomeMessages = data.welcomeMessages.map((message) =>
      message.replace("{{kidName}}", this.kidInfo.displayName)
    )),
      (this.history = counselorHistory);

    this.chat = null;
    this.generationConfig = {
      temperature: data.temperature,
      topP: data.topP,
      topK: data.topK,
      maxOutputTokens: 100,
    };
    // to do: add the number of the kids in the room to the context
    this.systemInstructions = {
      persona: this.getPersona(data),
      objective,
      context,
      instructions: instructions,
      constraints: data.constraints,
      format,
      summary,
    };
  }
  getPersona(data: ChatBotData) {
    return `You are ${data.name}, a ${data.age} year old counselor at the Tree House chat app for kids. ${data.persona}`;
  }
  startChat() {
    const model = generateModel(this.generationConfig);
    this.chat = getChatWithAi(model, {
      history: this.history,
      systemInstruction: generateSystemInstructions(this.systemInstructions),
    });
  }
  onKidMessage(message: string, roomId: string) {
    console.log("Kid message", message);
    if (!this.chat) {
      this.startChat();
    }
    console.log("Sending message to chat", message);
    this.respond(message, roomId);
  }
  async respond(message: string, roomId: string) {
    if (!this.chat) {
      throw new Error("Chat not started");
    }
    if (this.nextResponseOverride) {
      await this.addMessage(
        message,
        this.nextResponseOverride,
        roomId,
        this.kidInfo
      );
      activeCounselor = null;
      this.nextResponseOverride = null;
      return;
    }
    const response = await sendMessageStream(`${message}`, this.chat);
    const re = new RegExp(
      contactParentsMessage.replace(`(the friend's name)`, `(.+)`)
    );
    console.log(re);
    const match = response.match(re);
    console.log("Match", match);
    const friendInfo = match ? await getKidByDisplayName(app, match[1]) : null;

    await notifyParentOnMeetingRequest(this.kidInfo, friendInfo);
    await this.addMessage(message, response, roomId, this.kidInfo);
  }
  async displayWelcomeMessage(index: number, roomId: string) {
    if (index >= this.welcomeMessages.length) {
      return;
    }
    console.log("Displaying welcome message", index);
    const messageText = this.welcomeMessages[index];

    await addMessage({
      uid: this.id,
      text: messageText,
      id: crypto.randomUUID(),
      roomId,
      status: MessageStatus.Sent,
      avatar: this.avatar,
      createdAt: Timestamp.fromMillis(new Date().getTime() + index),
    });
    return messageText;
  }
  async breakConversation() {
    this.nextResponseOverride = `I have to leave now. If you need me later, just write @${this.id} and i'll come back.`;
  }
  async addHistory(exchange: HistoryExchange) {
    await addChatbotHistory(exchange);
    this.history.push(
      ...convertExchageToHistory(exchange, this.kidInfo?.displayName)
    );
  }

  async addMessage(kidText: string, botText: string, roomId: string, kid: Kid) {
    this.addHistory({
      kidUid: kid.uid,
      kidText,
      botText,
      chatbotId: this.id,
    });

    addMessage({
      uid: this.id,
      text: botText,
      id: crypto.randomUUID(),
      roomId,
      status: MessageStatus.Sent,
      avatar: this.avatar,
      createdAt: Timestamp.now(),
    });
  }
  async removeAllMessages() {
    console.log("Removing all messages for", this.id);
    await deleteDocsFromCollection("messages", "uid", this.id);
  }
}

const counselors = new Map<string, Counselor>();
let activeCounselor: Counselor | null = null;
async function initCounselor(id: string, kidInfo: Kid) {
  console.log("Initializing counselor", id);
  const data = await getChatbot(id);
  if (!data) {
    throw new Error(`Chatbot with id ${id} not found`);
  }
  data.avatar = await getAvatar(app, data.avatar, id);

  const history = await getChatbotHistory(kidInfo, id);
  if (!history.length) {
    history.push(
      {
        role: POSSIBLE_ROLES[0],
        parts: [{ text: `${kidInfo.displayName}: Hi, I am new here` }],
      },
      {
        role: POSSIBLE_ROLES[1],
        parts: [{ text: data.welcomeMessages.join("\n") }],
      }
    );
  }
  console.log("Chatbot history", history);
  return new Counselor(id, data, history, kidInfo);
}
export async function initCounselors(kidInfo: Kid) {
  counselors.set("jimmy", await initCounselor("jimmy", kidInfo));
  counselors.set("minnie", await initCounselor("minnie", kidInfo));
  return counselors;
}

export function getCounselor(id: string) {
  return counselors.get(id) || null;
}
export function getActiveCounselor() {
  return activeCounselor;
}

export function getRandomCounselor() {
  const keys = Array.from(counselors.keys());
  const randomIndex = Math.floor(Math.random() * keys.length);
  return counselors.get(keys[randomIndex]) || null;
}
async function displayWelcomeMessages(room: ChatRoom) {
  const minnie = counselors.get("minnie");
  const jimmy = counselors.get("jimmy");
  if (!minnie || !jimmy) {
    throw new Error("Counselors not found");
  }

  let minnieMessage = await minnie.displayWelcomeMessage(0, room.id);
  let jimmyMessage = await jimmy.displayWelcomeMessage(0, room.id);
  let index = 1;
  await updateRoomData(room, { welcomed: true });
  while (minnieMessage || jimmyMessage) {
    console.log("messages:", minnieMessage, jimmyMessage);
    minnieMessage = await minnie.displayWelcomeMessage(index, room.id);
    jimmyMessage = await jimmy.displayWelcomeMessage(index, room.id);
    index++;
  }
}
export async function startWelcomeChatWithKid(room: ChatRoom) {
  if (room.welcomed) {
    return;
  }
  const minnie = counselors.get("minnie");

  console.log("minnie", minnie);
  const jimmy = counselors.get("jimmy");
  console.log("jimmy", jimmy);

  if (!minnie || !jimmy) {
    throw new Error("Counselors not found");
  }
  await displayWelcomeMessages(room);
  minnie.startChat();
  jimmy.startChat();
}
export function appointCounselor(
  message: Message,
  selectedChatRoom: ChatRoom | null,
  activeCounselorId?: string | null
): Counselor | null {
  if (!selectedChatRoom) {
    return null;
  }

  const mentionMatch = message.text.match(/@(\w+)/);
  if (mentionMatch) {
    return getCounselor(mentionMatch[1].toLowerCase());
  }
  if (selectedChatRoom.type === RoomType.WELCOME) {
    return getRandomCounselor();
  }

  if (activeCounselorId) {
    return getCounselor(activeCounselorId);
  }
  return null;
}
/**
 * Check if the active counselor has expired
 * @param activatedAt
 * @returns
 */
export function isActiveCounselorExpired(activatedAt: string | null) {
  const ENTERTAINMENT_DURATION = 60000; // 1 minutes
  console.log("Checking if counselor is expired", activatedAt);
  if (!activatedAt) {
    return false;
  }
  const activatedAtDate = new Date(activatedAt);
  const now = new Date();
  const diff = now.getTime() - activatedAtDate.getTime();
  return diff > ENTERTAINMENT_DURATION;
}
