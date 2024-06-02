import { useEffect } from "react";
import type { Message } from "../features/chat/types/Messages";
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
      where("status", "==", "sent"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    setMessages([]);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("New message: ", change.doc.data());
          setMessages((prev) => [change.doc.data() as Message, ...prev]);
        }
      });
    });
    return unsubscribe;
  }, [db, setMessages, auth.currentUser, chatRoom]);
};

export default useMessages;
