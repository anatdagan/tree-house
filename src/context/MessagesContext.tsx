import { Message } from "@/components/chat/types/Messages.d";
import {
  applySentimentCallbacks,
  Sentiment,
} from "@/services/apiSentimentAnalysis";
import { createContext, useState } from "react";

export interface MessageContextProps {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  deleteAllMessages: () => void;
  setMessage: (message: Message) => void;
}

const MessageContext = createContext<undefined | MessageContextProps>(
  undefined
);

interface MessageProviderProps {
  children?: React.ReactNode;
  value?: MessageContextProps;
}
const MessageProvider = ({ children, value }: MessageProviderProps) => {
  const [messages, setMessages] = useState<Message[]>(value?.messages || []);
  const deleteAllMessages = () => {
    setMessages([]);
  };
  const setMessage = (message: Message) => {
    setMessages((prevmessages) => {
      const tone = message.sentiment?.tone || Sentiment.DEFAULT;
      const newmessages = [...prevmessages, message].sort((a, b) =>
        a.createdAt.toMillis() > b.createdAt.toMillis() ? 1 : -1
      );
      applySentimentCallbacks(tone, newmessages);
      return newmessages;
    });
    console.log("messages", messages);
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        setMessages,
        deleteAllMessages,
        setMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export { MessageContext, MessageProvider };
