import { addDocToCollection, getDocsFromCollection } from "./db";
import { InboxMessageData } from "../features/Inbox/inbox.d";
import User from "../features/authentication/types/Users";

export async function sendMessageToInbox(message: InboxMessageData, to: User) {
  return await addDocToCollection(`kids/${to.email}/inbox`, message);
}

export async function getInboxMessages(email: string) {
  return await getDocsFromCollection(`kids/${email}/inbox`);
}
