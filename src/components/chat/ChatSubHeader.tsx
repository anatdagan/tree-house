import classes from "./chat.module.css";
import ChatroomHeader from "../chatroom/ChatroomHeader";
import useUser from "@/hooks/useUser";
import CounselorIcons from "./CounselorIcons";

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
