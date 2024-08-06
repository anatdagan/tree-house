import { getChatroom } from "@/services/apiChatRooms";
import type { InboxMessageData } from "./inbox.d";
import { InboxMessageStatus, InboxMessageType } from "./inbox.d";
import useUser from "@/hooks/useUser";
import { updateInboxMessage } from "@/services/apiInbox";
import classes from "@/components/Inbox/inbox.module.css";
interface InboxMessageProps {
  message: InboxMessageData;
}
const InboxMessage = ({ message }: InboxMessageProps) => {
  const { switchRoom, kidInfo } = useUser();
  async function onMessageClick() {
    if (!kidInfo) {
      console.error("Kid info not found");
      return;
    }
    console.log(`Message clicked: ${message.subject}`);
    const chatRoom = message.roomId ? await getChatroom(message.roomId) : null;
    switch (message.type) {
      case InboxMessageType.ChatroomInvite:
        if (!chatRoom) {
          console.error(`Chatroom not found: ${message.roomId}`);
          return;
        }
        switchRoom(chatRoom);
        break;
      default:
        console.log(`Unknown message type: ${message.type}`);
    }
    const updatedMessage = { ...message, status: InboxMessageStatus.Read };
    await updateInboxMessage(kidInfo.email, message.id, updatedMessage);
  }
  return (
    <>
      <h3 onClick={onMessageClick} className={classes[message.status]}>
        {message.subject}
      </h3>
    </>
  );
};

export default InboxMessage;
