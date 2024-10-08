import {
  getDocById,
  addDocToCollection,
  getDocDataFromCollection,
} from "../db";
import { Content, POSSIBLE_ROLES } from "firebase/vertexai-preview";
import { ChatBotData, HistoryExchange } from "./types/chatbot";
import type { Kid } from "../apiKids";

export async function getChatbot(id: string) {
  return (await getDocById("chatbots", id)) as ChatBotData | null;
}

export function convertExchageToHistory(
  exchange: HistoryExchange,
  kidName: string
): Content[] {
  const { botText, kidText, chatbotId } = exchange;
  const history = [];
  if (kidText) {
    history.push({
      role: POSSIBLE_ROLES[0],
      parts: [{ text: `${kidName}: ${kidText}` }],
    });
  }
  if (botText) {
    history.push({
      role: POSSIBLE_ROLES[1],
      parts: [{ text: `${chatbotId}: ${botText}` }],
    });
  }
  return history;
}
export async function getChatbotHistory(kidInfo: Kid, chatbotId: string) {
  // Get chatbot history from DB
  const exchanges = await getDocDataFromCollection<HistoryExchange[]>(
    `chatbots/${chatbotId}/history`,
    "uid",
    kidInfo.uid
  );
  const kidName = kidInfo.displayName;
  return exchanges?.flatMap((exchange: HistoryExchange) =>
    convertExchageToHistory(exchange, kidName)
  );
}

export async function addChatbotHistory({
  kidUid,
  kidText,
  botText,
  chatbotId,
}: HistoryExchange) {
  // Add chatbot history to DB

  await addDocToCollection(`chatbots/${chatbotId}/history`, {
    botText,
    createdDate: new Date(),
    kidUid: kidUid || "",
    kidText,
  });
}
