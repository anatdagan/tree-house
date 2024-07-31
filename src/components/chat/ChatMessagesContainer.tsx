"use client";
import classes from "./chat.module.css";
import { MessageProvider } from "@/context/MessagesContext";
import ChatMessages from "./ChatMessages";
import ChatNewMessage from "./ChatNewMessage";

const ChatMessagesContainer = () => {
  return (
    <main className={classes["messages-chat"]} id="messages">
      <h2>Chat Messages</h2>
      <MessageProvider>
        <ChatMessages />

        <ChatNewMessage />
      </MessageProvider>
    </main>
  );
};
export default ChatMessagesContainer;
