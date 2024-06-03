import type { Message } from "../features/chat/types/Messages";
import { addDocToCollection, getDocData } from "./db";
import { DocumentReference } from "firebase/firestore";
import EventEmitter from "./apiEvents";

const NEW_MESSAGE_EVENT = "new-message";
const messageEventEmitter = new EventEmitter<Message>();

export async function addMessage(message: Message) {
  return await addDocToCollection("messages", message);
}
export async function getMessageByPath(ref: DocumentReference) {
  if (!ref) {
    return null;
  }
  return await getDocData<Message>(ref);
}

export function listenToNewMessage(callback: (message: Message) => void) {
  messageEventEmitter.on(NEW_MESSAGE_EVENT, callback);
}
