"use client";
import classes from "./chat.module.css";
import { MessageProvider } from "@/context/MessagesContext";
import ChatMessages from "./ChatMessages";
import ChatNewMessage from "./ChatNewMessage";

const ChatMessagesContainer = () => {
  return (
    <main className={classes["messages-chat"]} id="messages">
      <MessageProvider>
        <ChatMessages />

        <ChatNewMessage />
      </MessageProvider>
    </main>
  );
};
export default ChatMessagesContainer;
