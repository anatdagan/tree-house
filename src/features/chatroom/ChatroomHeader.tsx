import type { ChatRoom } from "./types/Rooms";
interface ChatroomHeaderProps {
  room: ChatRoom;
}
const ChatroomHeader = ({ room }: ChatroomHeaderProps) => {
  return (
    <div className="chatroom-header">
      <h1>{room.name}</h1>
    </div>
  );
};

export default ChatroomHeader;
