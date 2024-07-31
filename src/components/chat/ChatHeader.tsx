import classes from "./chat.module.css";
import HomeIcon from "./HomeIcon";
import ChatUser from "./ChatUser";
import Logout from "../authentication/Logout";
import InboxIcon from "../Inbox/InboxIcon";
import ChatroomHeader from "../chatroom/ChatroomHeader";
import useUser from "@/hooks/useUser";

const ChatHeader = () => {
  const { user, selectedChatRoom } = useUser();
  return (
    <header className={classes["header-chat"]}>
      <a href="#messages" className={classes.visibleOnFocus}>
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
