import { ChatRoom, RoomType } from "../features/chatroom/types/Rooms.d";
import { addDocToCollection, getDocDataFromCollection } from "./db";
import { sendMessageToInbox } from "./apiInbox";
import {
  InboxMessageType,
  InboxMessageStatus,
} from "../features/Inbox/inbox.d";
import { Kid } from "./apiKids";

let defaultChatRoom: ChatRoom | null = null;
export async function getChatroom(id: string) {
  return (await getDocDataFromCollection<string>(
    "chatrooms",
    "id",
    id
  )) as ChatRoom;
}

export async function createChatroom(chatRoomData: ChatRoom) {
  const chatRoom = await getChatroom(chatRoomData.id);
  if (chatRoom) {
    return chatRoom;
  }
  await addDocToCollection("chatrooms", chatRoomData);
  return chatRoomData;
}

export async function startPrivateChat(user1: Kid, user2: Kid) {
  const privateChatId = `private-${[user1.uid, user2.uid].sort().join("-")}`;
  let privateChatRoom = await getChatroom(privateChatId);
  if (!privateChatRoom) {
    const chatRoomData = {
      id: privateChatId,
      name: `${user1.displayName} + ${user2.displayName}`,
      description: `Private chat Between  ${user1.displayName} and ${user2.displayName}`,
      createdAt: new Date(),
      createdBy: user1.uid,
      type: RoomType.PRIVATE,
    };
    privateChatRoom = await createChatroom(chatRoomData);
  }
  await sendMessageToInbox(
    {
      id: crypto.randomUUID(),
      roomId: privateChatRoom.id,
      subject: "You have been invited to a private chat",
      type: InboxMessageType.ChatroomInvite,
      status: InboxMessageStatus.Unread,
    },

    user2
  );

  return privateChatRoom;
}

export async function createWelcomeRoom(kidInfo: Kid, uid: string) {
  const chatroomId = `welcome-${uid}`;
  const chatroomData = {
    id: chatroomId,
    type: RoomType.WELCOME,
    name: `Welcome ${kidInfo.displayName} to Treehouse Chat 🌳`,
    description: `An orientation chat for ${kidInfo.displayName}`,
    createdAt: new Date(),
    createdBy: "system",
  };
  if (!(await getChatroom(chatroomId))) await createChatroom(chatroomData);
  return chatroomData;
}
export const getChatRoom = async (id: string) => {
  return (await getDocDataFromCollection("chatrooms", "id", id)) as ChatRoom;
};
export const getDefaultChatRoom = async () => {
  if (defaultChatRoom) {
    return defaultChatRoom;
  }
  defaultChatRoom = await getChatRoom("general");
  return defaultChatRoom;
};
