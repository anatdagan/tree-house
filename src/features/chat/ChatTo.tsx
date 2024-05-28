import classes from "./chat.module.css";
import type User from "../authentication/types/Users";

interface Props {
  selectedKid: User;
}
const ChatTo = ({ selectedKid }: Props) => {
  return (
    <div className={classes["selected-kid"]}>
      <span>
        Sending a private message to {selectedKid.displayName}. If you want to
        send to everyone click on the chat icon:
        <i>💬</i>
      </span>
    </div>
  );
};

export default ChatTo;
