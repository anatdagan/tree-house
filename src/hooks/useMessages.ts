import { useEffect } from "react";
import { MessageStatus, type Message } from "../features/chat/types/Messages.d";
import {
  getFirestore,
  query,
  collection,
  onSnapshot,
  where,
  limit,
  orderBy,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ChatRoom } from "../features/chatroom/types/Rooms";

const useMessages = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  chatRoom: ChatRoom | null
) => {
  const db = getFirestore();
  const auth = getAuth();
  console.log(chatRoom);
  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }
    if (!chatRoom) {
      return;
    }
    console.log("Fetching messages", chatRoom.id);

    const q = query(
      collection(db, "messages"),
      where("roomId", "==", chatRoom.id),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    setMessages([]);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const message = change.doc.data() as Message;
          if (message.status !== MessageStatus.Sent) {
            message.text = "This message was removed";
          }
          console.log("New message: ", message);
          setMessages((prev) =>
            [message, ...prev].sort((a, b) =>
              a.createdAt.nanoseconds > b.createdAt.nanoseconds ? 1 : -1
            )
          );
        }
      });
    });
    return unsubscribe;
  }, [db, setMessages, auth.currentUser, chatRoom]);
};

export default useMessages;
