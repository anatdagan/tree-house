import { FormEvent, useState } from "react";
import classes from "./chat.module.css";
import { Message, MessageStatus } from "./types/Messages.d";
import { Timestamp } from "firebase/firestore";
import { findViolations } from "../../services/apiModeration";
import { addMessage } from "../../services/apiMessages";
import useChat from "../../hooks/useChat";

const onNewMessage = async (newMessage: Message) => {
  if (await findViolations(newMessage)) {
    console.log("Message is not allowed");
    return;
  }
  console.log("Sending message: ", newMessage);
  await addMessage(newMessage);
};

const ChatNewMessage = () => {
  const [newMessage, setNewMessage] = useState("");
  const { kidInfo, selectedChatRoom } = useChat();
  if (!kidInfo) {
    return null;
  }
  const { uid, avatar } = kidInfo;

  const sendMessage = (e: FormEvent) => {
    console.log("Sending message: ", newMessage);
    e.preventDefault();
    onNewMessage({
      id: crypto.randomUUID(),
      text: newMessage,
      createdAt: Timestamp.now(),
      uid: uid,
      avatar: avatar,
      status: MessageStatus.Sent,
      roomId: selectedChatRoom?.id || "general",
    });

    setNewMessage("");
  };

  return (
    <form onSubmit={sendMessage} className={classes.chatNewMessageForm}>
      <label htmlFor="write-message">Write a message</label>
      <input
        type="text"
        className={classes["write-message"]}
        id="write-message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button type="submit" className="btn">
        Send
      </button>
    </form>
  );
};
export default ChatNewMessage;
