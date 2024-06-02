import { useState, useEffect } from "react";
import "./App.css";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase.ts";
import Chat from "./features/chat/Chat.tsx";
import ChatHeader from "./features/chat/ChatHeader.tsx";
import ChatUser from "./features/chat/ChatUser.tsx";
import Logout from "./features/authentication/Logout.tsx";
import ChatMessages from "./features/chat/ChatMessages.tsx";
import ChatFooter from "./features/chat/ChatFooter.tsx";
import ChatNewMessage from "./features/chat/ChatNewMessage.tsx";
import type User from "./features/authentication/types/Users";
import Login from "./features/authentication/Login.tsx";
import LoadingIndicator from "./ui/LoadingIndicator.tsx";
import ErrorMessage from "./ui/ErrorMessage.tsx";
import type { Message } from "./features/chat/types/Messages.ts";
import {
  getDocs,
  addDoc,
  collection,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import useMessages from "./db/useMessages.ts";
import { ChatRoom } from "./features/chatroom/types/Rooms";
import ChatroomHeader from "./features/chatroom/ChatroomHeader.tsx";
import { findViolations } from "./services/apiModeration.ts";
import InboxIcon from "./features/Inbox/InboxIcon.tsx";
import { startPrivateChat } from "./services/apiChatRooms.ts";
const GENERAL_CHATROOM_ID = "general";
const db = getFirestore();

const getChatRoom = async (id: string) => {
  const q = query(collection(db, "chatrooms"), where("id", "==", id));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  return snapshot.docs[0].data() as ChatRoom;
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);

  const catchErrors = (error: unknown) => {
    setError(error instanceof Error ? error.message : "An error occurred");
    setIsLoading(false);
  };
  console.log("ChatRoom", chatRoom);
  useMessages(setMessages, chatRoom);
  const onNewMessage = async (newMessage: Message) => {
    if (!user) {
      console.log("You must be logged in to send a message");
      return;
    }
    if (await findViolations(newMessage)) {
      console.log("Message is not allowed");
      return;
    }
    console.log("Sending message: ", newMessage);
    const docRef = await addDoc(collection(db, "messages"), newMessage);
    console.log("Document written with ID: ", docRef.id);
  };
  const queryByUid = async (collectionName: string, uid: string) => {
    const q = query(collection(db, collectionName), where("uid", "==", uid));

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return null;
    }
    return snapshot.docs[0].data();
  };

  async function onAvatarClick(uid: string) {
    console.log("Avatar clicked", uid);
    const selectedKid = (await queryByUid("kids", uid)) as User;
    if (!selectedKid || !user) {
      setError("Kid not found");
      return;
    }
    console.log("Selected kid", selectedKid);
    const privateChatRoom = await startPrivateChat(user, selectedKid);
    setChatRoom(privateChatRoom as ChatRoom);
  }

  useEffect(() => {
    setIsLoading(true);
    setError("");
    onAuthStateChanged(auth, async (user) => {
      try {
        if (user !== null) {
          setChatRoom(await getChatRoom(GENERAL_CHATROOM_ID));
          const db = getFirestore();
          const q = query(
            collection(db, "kids"),
            where("email", "==", user?.email)
          );
          const snapshot = await getDocs(q);

          if (snapshot.empty) {
            setError("You are not authorized to use this app");
            setUser(null);
            auth.signOut();
            return;
          }
          const uid = snapshot.docs[0].data().uid;
          if (uid && uid !== user.uid) {
            setError("You are not authorized to use this app");
            setUser(null);
            auth.signOut();
            return;
          }
          if (!uid) {
            await updateDoc(snapshot.docs[0].ref, { uid: user.uid });
          }
          setUser(user);
        } else {
          setUser(null);
          console.log("User is not logged in");
        }
        setIsLoading(false);
        setError("");
      } catch (error) {
        catchErrors(error);
      }
    });
    return () => {};
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <div className="container">
      {user ? (
        <Chat>
          <ChatHeader>
            <ChatUser displayName={user.displayName || "Anonymous"} />
            {user.email && (
              <InboxIcon email={user.email} setChatRoom={setChatRoom} />
            )}
            <Logout />
          </ChatHeader>
          {chatRoom && <ChatroomHeader room={chatRoom} />}
          <main>
            <ChatMessages
              uid={user.uid}
              onAvatarClick={onAvatarClick}
              messages={messages}
            />
            <ChatFooter>
              <ChatNewMessage
                uid={user.uid}
                onNewMessage={onNewMessage}
                roomId={chatRoom?.id}
              />
            </ChatFooter>
          </main>
        </Chat>
      ) : (
        <Login catchErrors={catchErrors} />
      )}

      <ErrorMessage error={error} />
    </div>
  );
}
export default App;
