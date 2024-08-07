import classes from "./chat.module.css";
import ChatroomHeader from "../chatroom/ChatroomHeader";
import useUser from "@/hooks/useUser";
import CounselorIcons from "./CounselorIcons";
import ChatUser from "./ChatUser";

const ChatSubHeader = () => {
  const { selectedChatRoom } = useUser();

  return (
    <header className={classes["sub-header"]}>
      {selectedChatRoom && <ChatroomHeader room={selectedChatRoom} />}
      <ChatUser />
      <CounselorIcons />
    </header>
  );
};
export default ChatSubHeader;
