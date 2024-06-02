import { useState } from "react";
import classes from "./chat.module.css";
import { Message, MessageStatus } from "./types/Messages.d";
import { Timestamp } from "firebase/firestore";

interface Props {
  uid: string;
  onNewMessage: (message: Message) => void;
  roomId?: string;
}
const ChatNewMessage = ({ uid, onNewMessage, roomId }: Props) => {
  const [newMessage, setNewMessage] = useState("");
  const sendMessage = async () => {
    console.log("Sending message: ", newMessage);
    onNewMessage({
      id: crypto.randomUUID(),
      text: newMessage,
      createdAt: Timestamp.now(),
      uid: uid,
      status: MessageStatus.Sent,
      roomId: roomId || "general",
    });

    setNewMessage("");
  };

  return (
    <>
      <input
        type="text"
        className={classes["write-message"]}
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage} className="btn">
        Send
      </button>
    </>
  );
};
export default ChatNewMessage;
