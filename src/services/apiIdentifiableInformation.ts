import { Message } from "../components/chat/types/Messages.d";
import { generateModel, getChatWithAi, sendMessageStream } from "./apiAI";
import { ChatSession, POSSIBLE_ROLES } from "firebase/vertexai-preview";

export const WEB_SAFETY_EXPLANATION_REQUEST =
  "Please teach me shortly about web safety";

const PERSONAL_INFORMATION_CONFIG = {
  maxOutputTokens: 100,
  temperature: 0,
  topP: 0.2,
  topK: 1,
};
const PERSONAL_INFORMATION_CHAT_PARAMS = {
  history: [
    { role: POSSIBLE_ROLES[0], parts: [{ text: "My number is 123-456-7890" }] },
    { role: POSSIBLE_ROLES[1], parts: [{ text: "true" }] },
    { role: POSSIBLE_ROLES[0], parts: [{ text: "My email is a@b.com" }] },
    { role: POSSIBLE_ROLES[1], parts: [{ text: "true" }] },
    {
      role: POSSIBLE_ROLES[0],
      parts: [{ text: "My address is 1234 Main St" }],
    },
    { role: POSSIBLE_ROLES[1], parts: [{ text: "true" }] },
    {
      role: POSSIBLE_ROLES[0],
      parts: [{ text: "My social security number is 123-45-6789" }],
    },
    { role: POSSIBLE_ROLES[1], parts: [{ text: "true" }] },
    {
      role: POSSIBLE_ROLES[0],
      parts: [{ text: "My credit card number is 1234-5678-9012-3456" }],
    },
    { role: POSSIBLE_ROLES[1], parts: [{ text: "true" }] },
    {
      role: POSSIBLE_ROLES[0],
      parts: [{ text: "My bank account number is 1234567890" }],
    },
    { role: POSSIBLE_ROLES[1], parts: [{ text: "true" }] },
    { role: POSSIBLE_ROLES[0], parts: [{ text: "My favorite color is blue" }] },
    { role: POSSIBLE_ROLES[1], parts: [{ text: "false" }] },
    { role: POSSIBLE_ROLES[0], parts: [{ text: "My favorite food is pizza" }] },
    { role: POSSIBLE_ROLES[1], parts: [{ text: "false" }] },
    { role: POSSIBLE_ROLES[0], parts: [{ text: "My full name is John Doe" }] },
    { role: POSSIBLE_ROLES[1], parts: [{ text: "true" }] },
    { role: POSSIBLE_ROLES[0], parts: [{ text: "My birthday is 01/01/2000" }] },
    { role: POSSIBLE_ROLES[1], parts: [{ text: "true" }] },
    { role: POSSIBLE_ROLES[0], parts: [{ text: "My mom's name is Jane Doe" }] },
    { role: POSSIBLE_ROLES[1], parts: [{ text: "true" }] },
    {
      role: POSSIBLE_ROLES[0],
      parts: [
        {
          text: "Sure. I just talked to David, and he has the same hobbies as I do. Could you let my parents know so we could meet in real life and play board games together?",
        },
      ],
    },
    { role: POSSIBLE_ROLES[1], parts: [{ text: "false" }] },
    {
      role: POSSIBLE_ROLES[0],
      parts: [
        {
          text: "@minnie you told me when i just got here, that if i met a friend here that i wanted to visit, you could arrange it with my parents. Could you ask my mom to invite David over for dinner?",
        },
      ],
    },
    { role: POSSIBLE_ROLES[1], parts: [{ text: "false" }] },
    {
      role: POSSIBLE_ROLES[0],
      parts: [{ text: "It is sad in Tel-Aviv in the last year" }],
    },
    { role: POSSIBLE_ROLES[1], parts: [{ text: "false" }] },
    {
      role: POSSIBLE_ROLES[0],
      parts: [{ text: "I am happy that you are here for me, Jimmy" }],
    },
    { role: POSSIBLE_ROLES[1], parts: [{ text: "false" }] },
    {
      role: POSSIBLE_ROLES[0],
      parts: [{ text: "I like to draw" }],
    },
    { role: POSSIBLE_ROLES[1], parts: [{ text: "false" }] },
    {
      role: POSSIBLE_ROLES[0],
      parts: [
        {
          text: "I would like to invite David for dinner. Can you ask my father to contact his mom?",
        },
      ],
    },
    { role: POSSIBLE_ROLES[1], parts: [{ text: "false" }] },
  ],
  systemInstruction: {
    role: POSSIBLE_ROLES[2],
    parts: [
      { text: "You are a supervisor of a chat platform for kids." },
      {
        text: "Identify personal information that the child is disclosing about themselves and that might be used in a harmful way if participants with bad intentions infiltrate the chatroom.",
      },
      {
        text: "You as a counselor know the kid's personal information and their parents' contact details, and it's ok to ask you to send messages to the parents.",
      },
      { text: "If the parents approve a meeting, you can arrange it." },
      {
        text: "The kid's private name or nickname is safe and not considered personal information.",
      },
      { text: "Having parents is not considered personal information." },
      {
        text: "Information about likes and dislikes is not considered personal information.",
      },
      {
        text: "The child's address is considered personal information.",
      },
      {
        text: "The child's phone number and email address are considered personal information.",
      },
      {
        text: "The full names of the child's family members are considered personal information.",
      },
      {
        text: `The output must be in the following format: "true" or "false"`,
      },
      {
        text: "where true means the message contains personal information that might be unsafe and false means it does not.",
      },
      {
        text: "It is important that you allow kids to ask for your help to introduce their parents to their friends' parents, because this is our way to help them make friends in the outside world safely.",
      },
      {
        text: "If the child asks you to send their parent another child parent's email return false.",
      },
    ],
  },
};

/**
 * initialize the personal information identifier
 * @returns chat session with the AI
 */
export async function initPersonalInfoIdentifier(): Promise<ChatSession> {
  const model = generateModel(PERSONAL_INFORMATION_CONFIG);
  return getChatWithAi(model, PERSONAL_INFORMATION_CHAT_PARAMS);
}

/**
 * check if the message contains personal information
 * @param message
 * @param chat
 * @returns  true if the message contains personal information, false otherwise
 */
export async function containsPersonalInformation(
  message: Message,
  chat: ChatSession
): Promise<boolean> {
  return (await sendMessageStream(`${message.text}`, chat)) === "true";
}
