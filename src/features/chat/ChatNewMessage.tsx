import { useState } from "react";
import classes from "./chat.module.css";
import { Message, MessageStatus } from "./types/Messages.d";
import { Timestamp } from "firebase/firestore";
import { Kid } from "../../services/apiKids";

interface Props {
  sender: Kid | null;
  onNewMessage: (message: Message) => void;
  roomId?: string;
}
const ChatNewMessage = ({ sender, onNewMessage, roomId }: Props) => {
  const [newMessage, setNewMessage] = useState("");
  if (!sender) {
    return null;
  }
  const sendMessage = async () => {
    console.log("Sending message: ", newMessage);
    const { uid, avatar } = sender;
    onNewMessage({
      id: crypto.randomUUID(),
      text: newMessage,
      createdAt: Timestamp.now(),
      uid: uid,
      avatar: avatar,
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
