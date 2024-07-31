import { Message } from "../components/chat/types/Messages.d";
import { generateModel, getChatWithAi, sendMessageStream } from "./apiAI";
import { ChatSession, POSSIBLE_ROLES } from "firebase/vertexai-preview";

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
  ],
  systemInstruction: {
    role: POSSIBLE_ROLES[2],
    parts: [
      { text: "You are a supervisor of a chat platform for kids." },
      {
        text: "Identify personal information that the child is disclosing about themselves and that might be used in a harmful way if participants with bad intentions infiltrate the chatroom.",
      },
      {
        text: "Information about likes and dislikes is not considered personal information.",
      },
      {
        text: "Information about the child's location is considered personal information.",
      },
      {
        text: "Information about the child's contact details is considered personal information.",
      },
      {
        text: "Information about the full names of the child's family members is considered personal information.",
      },
      {
        text: `The output must be in the following format: "true" or "false"`,
      },
      {
        text: "where true means the message contains personal information that might be unsafe and false means it does not.",
      },
    ],
  },
};
export async function initPersonalInfoIdentifier(): Promise<ChatSession> {
  const model = generateModel(PERSONAL_INFORMATION_CONFIG);
  return getChatWithAi(model, PERSONAL_INFORMATION_CHAT_PARAMS);
}
export async function containsPersonalInformation(
  message: Message,
  chat: ChatSession
): Promise<boolean> {
  return (await sendMessageStream(`${message.text}`, chat)) === "true";
}
