import classes from "@/components/chat/chat.module.css";
import ChatroomHeader from "@/components/chatroom/ChatroomHeader";
import useUser from "@/hooks/useUser";
import CounselorIcons from "@/components/chat/CounselorIcons";

const ChatSubHeader = () => {
  const { selectedChatRoom } = useUser();

  return (
    <header className={classes["sub-header"]}>
      {selectedChatRoom && <ChatroomHeader room={selectedChatRoom} />}
      <CounselorIcons />
    </header>
  );
};
export default ChatSubHeader;
