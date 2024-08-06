import {
  addDocToCollection,
  createQuery,
  getDocsData,
  getDocsFromCollection,
  listenToDocChanges,
  updateDocData,
} from "./db";
import { InboxMessageData } from "@/components/Inbox/inbox.d";
import { Kid } from "./apiKids";

export async function sendMessageToInbox(message: InboxMessageData, to: Kid) {
  return await addDocToCollection(`kids/${to.email}/inbox`, message);
}

export async function getInboxMessages(email: string) {
  return (await getDocsData(`kids/${email}/inbox`)) as InboxMessageData[];
}

export async function updateInboxMessage(
  email: string,
  id: string,
  newMessage: InboxMessageData
) {
  const inboxDocs = await getDocsFromCollection(
    `kids/${email}/inbox`,
    "id",
    id
  );
  const inboxMessageId = inboxDocs[0].id;
  return await updateDocData(`kids/${email}/inbox`, inboxMessageId, newMessage);
}

export async function listenToInboxMessages(
  email: string,
  callback: (data: InboxMessageData) => void
) {
  return listenToDocChanges<InboxMessageData>(
    createQuery(`kids/${email}/inbox`),
    "added",
    callback
  );
}
