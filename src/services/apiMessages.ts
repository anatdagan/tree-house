import type { Message } from "../features/chat/types/Messages";
import { addDocToCollection, getDocData } from "./db";
import { DocumentReference } from "firebase/firestore";

export async function addMessage(message: Message) {
  return await addDocToCollection("messages", message);
}
export async function getMessageByPath(ref: DocumentReference) {
  if (!ref) {
    return null;
  }
  return await getDocData<Message>(ref);
}
