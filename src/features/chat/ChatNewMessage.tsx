import { useState } from "react";
import classes from "./chat.module.css";
import { Message } from "./types/Messages";
import User from "../authentication/types/Users";
import ChatTo from "./ChatTo";

interface Props {
  uid: string;
  onNewMessage: (message: Message) => void;
  selectedKid: User | null;
}
const ChatNewMessage = ({ uid, onNewMessage, selectedKid }: Props) => {
  const [newMessage, setNewMessage] = useState("");
  const sendMessage = async () => {
    console.log("Sending message: ", newMessage);
    onNewMessage({
      id: crypto.randomUUID(),
      text: newMessage,
      createdAt: Date.now(),
      uid: uid,
    });

    setNewMessage("");
  };

  return (
    <>
      {selectedKid && <ChatTo selectedKid={selectedKid} />}

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
