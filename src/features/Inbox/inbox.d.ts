export interface InboxMessageData {
  id: string;
  roomId?: string;
  messageRef?: DocumentReference;
  status: InboxMessageStatus;
  subject: string;
  type: InboxMessageType;
}

export enum InboxMessageType {
  ChatroomInvite = "chat",
  Notification = "notification",
}

export enum InboxMessageStatus {
  Unread = "unread",
  Read = "read",
}
