import classes from "./chat.module.css";
import ChatroomHeader from "../chatroom/ChatroomHeader";
import useUser from "@/hooks/useUser";
import CounselorIcons from "./CounselorIcons";

const ChatSubHeader = () => {
  const { selectedChatRoom } = useUser();

  return (
    <h2 className={classes["sub-header"]}>
      {selectedChatRoom && <ChatroomHeader room={selectedChatRoom} />}
      <CounselorIcons />
    </h2>
  );
};
export default ChatSubHeader;
