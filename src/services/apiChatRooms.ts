import User from "../features/authentication/types/Users";
import { ChatRoom } from "../features/chatroom/types/Rooms";
import { addDocToCollection, getDocDataFromCollection } from "./db";
import { sendMessageToInbox } from "./apiInbox";
import {
  InboxMessageType,
  InboxMessageStatus,
} from "../features/Inbox/inbox.d";

export async function getChatroom(id: string) {
  return (await getDocDataFromCollection<string>(
    "chatrooms",
    "id",
    id
  )) as ChatRoom;
}

export async function createChatroom(chatRoomData: ChatRoom) {
  await addDocToCollection("chatrooms", chatRoomData);
  return chatRoomData;
}

export async function startPrivateChat(user1: User, user2: User) {
  const privateChatId = `private-${[user1.uid, user2.uid].sort().join("-")}`;
  let privateChatRoom = await getChatroom(privateChatId);
  if (!privateChatRoom) {
    const chatRoomData = {
      id: privateChatId,
      name: `${user1.displayName} + ${user2.displayName}`,
      description: `Private chat Between  ${user1.displayName} and ${user2.displayName}`,
      createdAt: new Date(),
      createdBy: user1.uid,
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
