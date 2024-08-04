import type { Message } from "../components/chat/types/Messages.d";
import { addDocToCollection, getDocDataFromCollection } from "./db";
import EventEmitter from "./apiEvents";

const NEW_MESSAGE_EVENT = "new-message";
const messageEventEmitter = new EventEmitter<Message>();

export async function addMessage(message: Message) {
  return await addDocToCollection("messages", message);
}

export function emitNewMessage(message: Message) {
  messageEventEmitter.emit(NEW_MESSAGE_EVENT, message);
}
export function listenToNewMessage(callback: (message: Message) => void) {
  messageEventEmitter.on(NEW_MESSAGE_EVENT, callback);
}

export async function getMessages(chatroomId?: string) {
  if (!chatroomId) {
    return [];
  }
  return (await getDocDataFromCollection<string>(
    "messages",
    "roomId",
    chatroomId
  )) as Message[];
}
