import { FormEvent, useState } from "react";
import classes from "./chat.module.css";
import appClasses from "../../App.module.css";
import { Message, MessageStatus } from "./types/Messages.d";
import { Timestamp } from "firebase/firestore";
import { findViolations } from "../../services/apiModeration";
import { addMessage } from "../../services/apiMessages";
import useUser from "@/hooks/useUser";
import {
  analyzeMessage,
  getLastMessages,
} from "@/services/apiSentimentAnalysis";
import useMessageContext from "@/hooks/useMessageContext";
import {
  appointCounselor,
  isActiveCounselorExpired,
} from "@/services/chatbots/apiCounselors";

const ChatNewMessage = () => {
  const [newMessage, setNewMessage] = useState("");
  const {
    kidInfo,
    selectedChatRoom,
    activeCounselorId,
    counselorActivatedAt,
    setActiveCounselorId,
  } = useUser();
  const { messages } = useMessageContext();

  if (!kidInfo) {
    return null;
  }
  const { uid, avatar } = kidInfo;
  const onNewMessage = async (newMessage: Message) => {
    if (!selectedChatRoom) {
      console.log("No chat room selected");
      return;
    }
    if (await findViolations(newMessage)) {
      console.log("Message is not allowed");
      return;
    }
    console.log("Sending message: ", newMessage);
    await addMessage(newMessage);
    const responder = appointCounselor(
      newMessage,
      selectedChatRoom,
      activeCounselorId
    );
    if (!responder) {
      return;
    }
    if (isActiveCounselorExpired(counselorActivatedAt)) {
      responder.breakConversation();
      setActiveCounselorId(null);
    }
    responder.onKidMessage(newMessage.text, selectedChatRoom?.id);
  };
  const sendMessage = async (e: FormEvent) => {
    const MESSAGE_CONEXT_DURATION = 600000; // 10 minutes
    console.log("Sending message: ", newMessage);
    e.preventDefault();
    const message: Message = {
      id: crypto.randomUUID(),
      text: newMessage,
      createdAt: Timestamp.now(),
      uid: uid,
      avatar: avatar,
      status: MessageStatus.Sent,
      roomId: selectedChatRoom?.id || "general",
      sentiment: {},
    };
    (message.sentiment = await analyzeMessage(
      getLastMessages(messages, MESSAGE_CONEXT_DURATION),
      message
    )),
      onNewMessage(message);

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
      <button type="submit" className={appClasses.btn}>
        Send
      </button>
    </form>
  );
};
export default ChatNewMessage;
