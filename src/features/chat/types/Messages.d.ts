import { Timestamp } from "firebase/firestore";

export enum MessageStatus {
  Initial = "initial",
  Sent = "sent",
  Flagged = "flagged",
}
export interface Message {
  text: string;
  uid: string;
  id: string;
  createdAt: Timestamp;
  roomId: string;
  status: MessageStatus;
  avatar?: string;
  sentiment?: MessageSentiment;
}
