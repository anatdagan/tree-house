import classes from "./chat.module.css";
import HomeIcon from "./HomeIcon";
import InboxIcon from "../Inbox/InboxIcon";
import useUser from "@/hooks/useUser";

const ChatHeader = () => {
  const { user } = useUser();
  return (
    <header className={classes["header-chat"]}>
      <a href="#messages" className={classes.visibleOnFocus}>
        Skip header
      </a>
      <HomeIcon />
      <h1>Treehouse Chat</h1>
      {user?.email && <InboxIcon />}
    </header>
  );
};

export default ChatHeader;
