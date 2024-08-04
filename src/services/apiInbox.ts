import { addDocToCollection, getDocsFromCollection } from "./db";
import { InboxMessageData } from "../components/Inbox/inbox";
import { Kid } from "./apiKids";

export async function sendMessageToInbox(message: InboxMessageData, to: Kid) {
  return await addDocToCollection(`kids/${to.email}/inbox`, message);
}

export async function getInboxMessages(email: string) {
  return await getDocsFromCollection(`kids/${email}/inbox`);
}
