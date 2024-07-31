import { useEffect, useRef } from "react";
import { MessageStatus, type Message } from "../features/chat/types/Messages.d";
import {
  query,
  collection,
  onSnapshot,
  where,
  limit,
  orderBy,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useChat } from "./useChat.ts";
import { db } from "../../firebase.ts";
const useMessages = () => {
  const auth = getAuth();
  const { selectedChatRoom, deleteAllMessages, addMessage } = useChat();
  const refAddMessage = useRef(addMessage);
  const refDeleteAllMessages = useRef(deleteAllMessages);
  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }
    if (!selectedChatRoom) {
      return;
    }

    console.log("Fetching messages", selectedChatRoom.id);

    const q = query(
      collection(db, "messages"),
      where("roomId", "==", selectedChatRoom.id),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    refDeleteAllMessages.current();
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const message = change.doc.data() as Message;
          if (message.status !== MessageStatus.Sent) {
            message.text = "This message was removed";
          }
          console.log("New message: ", message);
          refAddMessage.current(message);
        }
      });
    });
    return unsubscribe;
  }, [auth.currentUser, selectedChatRoom]);
};

export default useMessages;
