import useUser from "@/hooks/useUser";
import classes from "./chat.module.css";

const ChatUser = () => {
  const { kidInfo } = useUser();
  const displayName = kidInfo?.displayName || "Anonymous";
  return <p className={classes.name}>{displayName}</p>;
};
export default ChatUser;
