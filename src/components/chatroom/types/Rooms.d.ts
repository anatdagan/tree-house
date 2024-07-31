export enum RoomType {
  PUBLIC = "public",
  PRIVATE = "private",
  WELCOME = "welcome",
}
export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: string;
  type: RoomType;
  welcomed?: boolean;
}
