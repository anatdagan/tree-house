"use client";
import { useContext } from "react";
import { MessageContext } from "@/context/MessagesContext";

const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
};
export default useMessageContext;
