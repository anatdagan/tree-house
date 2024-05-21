import { useState, useEffect } from "react";
import "./App.css";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import type { Message } from "./types/Messages.d.ts";
import type { User } from "./types/Users.d.ts";
import {
  addDoc,
  getFirestore,
  onSnapshot,
  collection,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "../firebase";

function App() {
  const db = getFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
      );
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError("");
    onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        setUser(user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      console.log(user);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const sendMessage = async () => {
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
    setNewMessage("");
  };

  if (isLoading) {
    return <div className="container">Loading...</div>;
  }
  return (
    <div className="container">
      {user ? (
        <div className="chat">
          <header className="header-chat">
            <h1>Treehouse Chat</h1>
            <p className="name">{user.displayName}</p>
            <button onClick={() => auth.signOut()} className="btn right">
              Logout
            </button>
          </header>
          <main>
            <div className="messages-chat">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${
                    message.data.uid === user.uid ? "current" : "other"
                  }`}
                >
                  <div className="photo">
                    <img
                      src={message.data.photoURL}
                      alt={message.data.displayName}
                    />
                  </div>
                  <p className="text">{message.data.text}</p>
                </div>
              ))}
            </div>
            <div className="footer-chat">
              <input
                type="text"
                className="write-message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={sendMessage} className="btn">
                Send
              </button>
            </div>
          </main>
        </div>
      ) : (
        <button onClick={handleGoogleSignIn} className="btn">
          Login with Google
        </button>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
