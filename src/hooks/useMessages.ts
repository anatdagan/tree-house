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
import type { ChatRoom } from "../features/chatroom/types/Rooms";
import { ChatActionTypes, ChatAction } from "../reducers/chatReducer.ts";

const useMessages = (
  dispatch: React.Dispatch<ChatAction>,
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
    dispatch({ type: ChatActionTypes.DELETE_ALL_MESSAGES });
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const message = change.doc.data() as Message;
          if (message.status !== MessageStatus.Sent) {
            message.text = "This message was removed";
          }
          console.log("New message: ", message);
          dispatch({ type: ChatActionTypes.ADD_MESSAGE, payload: { message } });
        }
      });
    });
    return unsubscribe;
  }, [db, auth.currentUser, chatRoom, dispatch]);
};

export default useMessages;
