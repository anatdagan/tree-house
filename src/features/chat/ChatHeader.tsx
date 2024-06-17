import classes from "./chat.module.css";
import HomeIcon from "./HomeIcon";
import ChatUser from "./ChatUser";
import Logout from "../authentication/Logout";
import InboxIcon from "../Inbox/InboxIcon";
import ChatroomHeader from "../chatroom/ChatroomHeader";
import useChat from "../../hooks/useChat";

const ChatHeader = () => {
  const { user, selectedChatRoom } = useChat();
  return (
    <header className={classes["header-chat"]}>
      <a href="#messages" className="visibleOnFocus">
        Skip header
      </a>
      <HomeIcon />

      <h1>Treehouse Chat</h1>
      <ChatUser />
      {user?.email && <InboxIcon email={user.email} />}
      {selectedChatRoom && <ChatroomHeader room={selectedChatRoom} />}
      <Logout />
    </header>
  );
};

export default ChatHeader;
