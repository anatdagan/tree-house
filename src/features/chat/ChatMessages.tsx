import classes from "./chat.module.css";
import type { Message } from "./types/Messages";
import { extractTime } from "../../utils/date";

interface Props {
  uid: string;
  onAvatarClick: (uid: string) => void;
  messages: Message[];
}

const ChatMessages = ({ uid, onAvatarClick, messages }: Props) => {
  console.log("ChatMessages", uid);
  return (
    <div className={classes["messages-chat"]}>
      {messages.map((message: Message) => (
        <div
          key={message.id}
          className={`${classes.message} ${
            message.uid === uid ? classes.current : classes.other
          } {message.to === uid ? classes.private : ""}`}
        >
          <span className={classes.time}>{extractTime(message.createdAt)}</span>
          <div
            className={classes.photo}
            onClick={() => onAvatarClick(message.uid)}
          >
            <img src={message?.avatar} />
          </div>
          <p className={classes.text}>{message.text}</p>
        </div>
      ))}
    </div>
  );
};
export default ChatMessages;
