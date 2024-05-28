import classes from "./chat.module.css";
import type { Message } from "./types/Messages";

interface Props {
  uid: string;
  messages: Message[];
  onAvatarClick: (uid: string) => void;
}
const ChatMessages = ({ uid, messages, onAvatarClick }: Props) => {
  console.log("ChatMessages", messages, uid);
  // const [messages, setMessages] = useState<Message[]>([]);
  return (
    <div className={classes["messages-chat"]}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${classes.message} ${
            message.uid === uid ? classes.current : classes.other
          } {message.to === uid ? classes.private : ""}`}
        >
          <span className={classes.time}>{message.createdAt}</span>
          <div
            className={classes.photo}
            onClick={() => onAvatarClick(message.uid)}
          >
            {/* //{" "}
            <img
              src={messageEvent.data.photoURL}
              alt={message.data.displayName}
            /> */}
          </div>
          <p className={classes.text}>{message.text}</p>
        </div>
      ))}
    </div>
  );
};
export default ChatMessages;
