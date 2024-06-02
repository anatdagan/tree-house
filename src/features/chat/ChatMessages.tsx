import classes from "./chat.module.css";
import type { Message } from "./types/Messages";
import { extractTime } from "../../utils/date";
import { useState } from "react";
import { ChatRoom } from "../chatroom/types/Rooms";
import useMessages from "../../hooks/useMessages";

interface Props {
  uid: string;
  chatRoom: ChatRoom | null;
  onAvatarClick: (uid: string) => void;
}
const ChatMessages = ({ uid, onAvatarClick, chatRoom }: Props) => {
  console.log("ChatMessages", uid);
  const [messages, setMessages] = useState<Message[]>([]);
  useMessages(setMessages, chatRoom);

  return (
    <div className={classes["messages-chat"]}>
      {messages.map((message) => (
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
          ></div>
          <p className={classes.text}>{message.text}</p>
        </div>
      ))}
    </div>
  );
};
export default ChatMessages;
