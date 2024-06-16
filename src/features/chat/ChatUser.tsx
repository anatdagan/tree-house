import useChat from "../../hooks/useChat";
import classes from "./chat.module.css";

const ChatUser = () => {
  const { kidInfo } = useChat();
  const displayName = kidInfo?.displayName || "Anonymous";
  return <p className={classes.name}>{displayName}</p>;
};
export default ChatUser;
