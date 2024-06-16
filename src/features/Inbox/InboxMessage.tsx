import { getChatroom } from "../../services/apiChatRooms";
import type { InboxMessageData } from "./inbox.d";
import { InboxMessageType } from "./inbox.d";
import useChat from "../../hooks/useChat";
interface InboxMessageProps {
  message: InboxMessageData;
}
const InboxMessage = ({ message }: InboxMessageProps) => {
  const { switchRoom } = useChat();
  async function onMessageClick() {
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
  }
  return (
    <div>
      <h3 onClick={onMessageClick}>{message.subject}</h3>
    </div>
  );
};

export default InboxMessage;
