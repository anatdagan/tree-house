import { useState, useEffect, useReducer, useRef } from "react";
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
import { getDocs, collection, query, where } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { ChatRoom } from "./features/chatroom/types/Rooms";
import ChatroomHeader from "./features/chatroom/ChatroomHeader.tsx";
import { findViolations } from "./services/apiModeration.ts";
import InboxIcon from "./features/Inbox/InboxIcon.tsx";
import {
  startPrivateChat,
  createWelcomeRoom,
} from "./services/apiChatRooms.ts";
import { initParentNotifications } from "./services/apiParentNotifications.ts";
import { Kid, getKidInfo } from "./services/apiKids.ts";
import { addMessage } from "./services/apiMessages.ts";
import { initCounselors } from "./services/chatbots/apiCounselors.ts";
import { chatReducer, ChatActionTypes } from "./reducers/chatReducer.ts";
import useMessages from "./hooks/useMessages.ts";
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
  // todo: useReducer + context
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [kidInfo, setKidInfo] = useState<Kid | null>(null);

  const initialState = {
    messages: [],
    selectedChatRoom: null,
  };
  const [{ selectedChatRoom, messages }, dispatch] = useReducer(
    chatReducer,
    initialState
  );
  useMessages(dispatch, selectedChatRoom);
  const catchErrors = (error: unknown) => {
    setError(error instanceof Error ? error.message : "An error occurred");
    setIsLoading(false);
  };
  console.log("ChatRoom", selectedChatRoom);
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
    await addMessage(newMessage);
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
    dispatch({
      type: ChatActionTypes.SWITCH_ROOM,
      payload: { room: privateChatRoom as ChatRoom },
    });
  }
  const generalRoom = useRef<ChatRoom | null>(null);
  useEffect(() => {
    setIsLoading(true);
    setError("");
    onAuthStateChanged(auth, async (user) => {
      try {
        console.log("generalRoom", generalRoom.current);
        if (user !== null) {
          generalRoom.current = await getChatRoom(GENERAL_CHATROOM_ID);
          let currentRoom = generalRoom.current;
          dispatch({
            type: ChatActionTypes.SWITCH_ROOM,
            payload: {
              room: currentRoom,
            },
          });
          const kidInfo = await getKidInfo(user.email);

          if (!kidInfo) {
            setError("You are not authorized to use this app");
            setUser(null);
            auth.signOut();
            return;
          }
          const uid = kidInfo.uid;
          if (uid && uid !== user.uid) {
            setError("You are not authorized to use this app");
            setUser(null);
            auth.signOut();
            return;
          }
          setUser(user);
          setKidInfo(kidInfo);
          initParentNotifications(kidInfo);
          if (kidInfo.status === "new") {
            currentRoom = await createWelcomeRoom(kidInfo, user.uid);
            dispatch({
              type: ChatActionTypes.SWITCH_ROOM,
              payload: { room: currentRoom },
            });
          }
          if (currentRoom) {
            await initCounselors(kidInfo, currentRoom, dispatch);
          }
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
          <ChatHeader dispatch={dispatch} generalRoom={generalRoom}>
            <ChatUser displayName={kidInfo?.displayName || "Anonymous"} />
            {user.email && <InboxIcon email={user.email} dispatch={dispatch} />}
            <Logout />
          </ChatHeader>
          {selectedChatRoom && <ChatroomHeader room={selectedChatRoom} />}
          <main>
            <ChatMessages
              uid={user.uid}
              onAvatarClick={onAvatarClick}
              messages={messages}
            />
            <ChatFooter>
              <ChatNewMessage
                sender={kidInfo}
                onNewMessage={onNewMessage}
                roomId={selectedChatRoom?.id}
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
