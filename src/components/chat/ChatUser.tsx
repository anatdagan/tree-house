import useUser from "@/hooks/useUser";
import UserProfile from "@/components/authentication/UserProfile";
import classes from "@/components/chat/chat.module.css";
const ChatUser = () => {
  const { kidInfo } = useUser();
  if (!kidInfo) {
    return null;
  }
  return (
    <div className={classes["user-profile"]}>
      <UserProfile kidInfo={kidInfo} />
    </div>
  );
};
export default ChatUser;
