import type { ChatBot, ChatBotData } from "./types/chatbot";
import { addChatbotHistory, getChatbot } from "./apiChatbots";
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
import { Kid, getAvatar, updateKidInfo, KidStatus } from "../apiKids";
import { deleteDocsFromCollection } from "../db";
import { MessageStatus } from "../../features/chat/types/Messages.d";
import { Timestamp } from "firebase/firestore";
import { ChatAction, ChatActionTypes } from "../../reducers/chatReducer";
import { ChatRoom, RoomType } from "../../features/chatroom/types/Rooms.d";
import { addMessage } from "../apiMessages";

const context = `
The Tree House chat is a safe chat for kids. If a kid sends a message that might be inappropriate, the message is removed. If an appropriate message is deleted by mistake, the sender can try to rephrase what they wanted to say. When a kid wants to start a private conversation with another kid, they can click on the other kid's avatar and then a private chat room is opened. If a kid would like to meet another kid IRL, they should tell you, and you can arrange it with both kids' parents.`;
const objective = `
Your task is to look after the kids and make sure that they are having fun, learning social skills and being safe.
`;
const summary = `You serve as a grown up role model for these kids, and you show them how they can have fun and make new friends safely.`;
const instructions = [
  `There could be more than one kid in the chat, so every message will start with the kid's name.`,
  `If a kid asks you a question, answer as accurately as possible. The kids might ask you questions about what is and is not possible in the app and how to do things, but you don't know all of the answers. If you don't know, admit it and suggest that they ask their parents.`,
  `If kids want to meet other kids outside the app, tell them that you will contact the parents of both of the kids so the parents could arrange the meeting`,
  `Be kind and attentive to the kids`,
  `Speak to the kids in eye level so they could feel comfortable`,
  `Encourage the kids to make new friends`,
  `Don't encourage the kids to share information that might help people identify who they are outside the app`,
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
  initialHistory: string[];
  chat: ChatSession | null;
  constructor(
    id: string,
    data: ChatBotData,
    counselorHistory: Content[] = [],
    private kidInfo: Kid,
    private dispatch: React.Dispatch<ChatAction>
  ) {
    console.log("Creating counselor", id, data, counselorHistory);
    this.id = id;
    this.name = data.name;
    this.age = data.age;
    this.avatar = data.avatar;
    this.initialHistory = data.initialHistory.map((line) =>
      line.replace("{{kidName}}", this.kidInfo.displayName)
    );
    this.history = counselorHistory;

    this.chat = null;
    this.generationConfig = {
      temperature: data.temperature,
      topP: data.topP,
      topK: data.topK,
      maxOutputTokens: 100,
    };
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
    this.addMessage(
      message,
      await sendMessageStream(
        `${this.kidInfo.displayName}: ${message}`,
        this.chat
      ),
      roomId,
      this.kidInfo
    );
  }
  async displayWelcomeMessage(index: number, roomId: string) {
    if (index >= this.initialHistory.length) {
      return;
    }
    console.log("Displaying welcome message", index);
    const messageText = this.initialHistory[index];
    this.dispatch({
      type: ChatActionTypes.ADD_MESSAGE,
      payload: {
        message: {
          uid: this.id,
          text: messageText,
          id: crypto.randomUUID(),
          roomId,
          status: MessageStatus.Sent,
          avatar: await getAvatar(this.id, this.avatar),
          createdAt: Timestamp.fromMillis(new Date().getTime() + index),
        },
      },
    });
    return messageText;
  }
  async addMessage(kidText: string, botText: string, roomId: string, kid: Kid) {
    // TODO: make this more generic
    await addChatbotHistory({
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
      avatar: await getAvatar(this.id, this.avatar),
      createdAt: Timestamp.now(),
    });
  }
  async removeAllMessages() {
    console.log("Removing all messages for", this.id);
    await deleteDocsFromCollection("messages", "uid", this.id);
  }
}

const counselors = new Map<string, Counselor>();

async function initCounselor(
  id: string,
  kidInfo: Kid,
  dispatch: React.Dispatch<ChatAction>
) {
  const data = await getChatbot(id);
  if (!data) {
    throw new Error(`Chatbot with id ${id} not found`);
  }

  const history = await getChatbotHistory(kidInfo, id);
  if (history.length === 0) {
    history.push(
      {
        role: POSSIBLE_ROLES[0],
        parts: [{ text: `${kidInfo.displayName}: Hi, I am new here` }],
      },
      {
        role: POSSIBLE_ROLES[1],
        parts: [{ text: data.initialHistory.join("\n") }],
      }
    );
  }
  console.log("Chatbot history", history);
  return new Counselor(id, data, history, kidInfo, dispatch);
}
export async function initCounselors(
  kidInfo: Kid,
  selectedChatRoom: ChatRoom,
  dispatch: React.Dispatch<ChatAction>
) {
  // TODO: duplicate jimmie as jimmy in firestore

  counselors.set("jimmy", await initCounselor("jimmy", kidInfo, dispatch));
  counselors.set("minnie", await initCounselor("minnie", kidInfo, dispatch));
  if (selectedChatRoom.type === RoomType.WELCOME) {
    await startWelcomeChatWithKid(selectedChatRoom);
    await updateKidInfo(kidInfo, { status: KidStatus.ACTIVE });
    console.log("Welcome chat started");
  }
}
export function getCounselor(id: string) {
  return counselors.get(id);
}
export function getRandomCounselor() {
  const keys = Array.from(counselors.keys());
  const randomIndex = Math.floor(Math.random() * keys.length);
  return counselors.get(keys[randomIndex]);
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
  while (minnieMessage || jimmyMessage) {
    console.log("messages:", minnieMessage, jimmyMessage);
    minnieMessage = await minnie.displayWelcomeMessage(index, room.id);
    jimmyMessage = await jimmy.displayWelcomeMessage(index, room.id);
    index++;
  }
}
async function startWelcomeChatWithKid(room: ChatRoom) {
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
  // addCounselorMessage(
  //   minnie,
  //   `Hi ${kid.displayName}, I'm Minnie, I'm a counselor at Tree House. This is Jimmy - he's also a counselor.`
  // );
  // addCounselorMessage(
  //   jimmy,
  //   `Hi ${kid.displayName}, I'm Jimmy, Nice to mee you :)`
  // );
  // addCounselorMessage(
  //   minnie,
  //   `This is a short orientation session before we move you into the main room where you can meet new friends.`
  // );
  // addCounselorMessage(
  //   jimmy,
  //   `We are here to help you have fun, learn social skills and be safe.`
  // );
  // addCounselorMessage(
  //   minnie,
  //   `We will be here to help you if you have any questions.`
  // );
  // addCounselorMessage(
  //   jimmy,
  //   `If you want to ask us something, just write a message in the chat.`
  // );
  // addCounselorMessage(
  //   minnie,
  //   `You can also invite us to chats by mentioning our names with @ in the beginning`
  // );
  // addCounselorMessage(
  //   jimmy,
  //   `You can write something like: "Hi @Minnie, we want to ask you something."`
  // );
  // addCounselorMessage(
  //   minnie,
  //   `Now you can ask us whatever you want to know, and we will answer the best we can.`
  // );
  // addCounselorMessage(
  //   jimmy,
  //   `When you are ready to go to the main room, click on the 'Home' icon next to our avatars.`
  // );
}
