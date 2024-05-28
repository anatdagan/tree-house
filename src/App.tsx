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
  serverTimestamp,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedKid, setSelectedKid] = useState<User | null>(null);
  const db = getFirestore();

  const catchErrors = (error: unknown) => {
    setError(error instanceof Error ? error.message : "An error occurred");
    setIsLoading(false);
  };

  const onNewMessage = async (newMessage: Message) => {
    if (!user) {
      console.log("You must be logged in to send a message");
      return;
    }
    console.log("Sending message: ", newMessage);
    const docRef = await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      uid: user.uid,
    });
    console.log("Document written with ID: ", docRef.id);
    setMessages([...messages, newMessage]);
  };

  const onAvatarClick = async (uid: string) => {
    console.log("Avatar clicked", uid);
    const q = query(collection(db, "kids"), where("uid", "==", uid));
    const snapshot = await getDocs(q);
    setSelectedKid(snapshot.docs[0].data() as User);
  };

  useEffect(() => {
    setIsLoading(true);
    setError("");
    onAuthStateChanged(auth, async (user) => {
      try {
        if (user !== null) {
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
            <Logout />
          </ChatHeader>
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
                selectedKid={selectedKid}
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
