import type { ChatRoom } from "./types/Rooms";
interface ChatroomHeaderProps {
  room: ChatRoom;
}
const ChatroomHeader = ({ room }: ChatroomHeaderProps) => {
  return <h1>{room.name}</h1>;
};

export default ChatroomHeader;
