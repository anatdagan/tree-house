import { ReactNode, createContext, useEffect, useReducer, useRef } from "react";
import {
  ChatActionTypes,
  ChatState,
  chatReducer,
} from "../reducers/chatReducer";

import { Message } from "../features/chat/types/Messages";
import User from "../features/authentication/types/Users.d";
import {
  createWelcomeRoom,
  getDefaultChatRoom,
} from "../services/apiChatRooms";
import { Kid, getKidInfo } from "../services/apiKids";
import { auth } from "../../firebase";
import { Auth, onAuthStateChanged } from "firebase/auth";
import { initParentNotifications } from "../services/apiParentNotifications";
import { initCounselors } from "../services/chatbots/apiCounselors";
import { ChatRoom } from "../features/chatroom/types/Rooms";

interface ChatContextProps extends ChatState {
  addMessage: (message: Message) => void;
  switchRoom: (room: ChatRoom | null) => void;
  catchErrors: (error: unknown) => void;
  deleteAllMessages: () => void;
}
const initialState = {
  messages: [],
  selectedChatRoom: null,
  isLoading: false,
  user: null,
  kidInfo: null,
  error: "",
  defaultRoom: null,
};
const ChatContext = createContext<undefined | ChatContextProps>(undefined);
const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { selectedChatRoom } = state;
  const catchErrors = (error: unknown) => {
    dispatch({
      type: ChatActionTypes.SET_ERROR,
      payload: { error },
    });
  };
  function deleteAllMessages() {
    dispatch({ type: ChatActionTypes.DELETE_ALL_MESSAGES });
  }
  const addMessage = (message: Message) => {
    dispatch({ type: ChatActionTypes.ADD_MESSAGE, payload: { message } });
  };
  function handleMissingKid(auth: Auth) {
    dispatch({ type: ChatActionTypes.KID_NOT_FOUND });
    auth.signOut();
  }
  function handleUnauthorized(auth: Auth) {
    dispatch({ type: ChatActionTypes.UNAUTHORIZED });
    auth.signOut();
  }
  function handleSignIn(user: User, kidInfo: Kid, defaultRoom: ChatRoom) {
    dispatch({
      type: ChatActionTypes.SIGN_IN,
      payload: { user, kidInfo, defaultRoom },
    });
  }

  const switchRoom = (room: ChatRoom | null) => {
    if (!room) {
      catchErrors("Room not found");
    }
    dispatch({
      type: ChatActionTypes.SWITCH_ROOM,
      payload: { room },
    });
  };

  const startUserSession = useRef(
    async (user: User, selectedChatRoom: ChatRoom | null) => {
      const kidInfo = await getKidInfo(user.email);

      if (!kidInfo) {
        return handleMissingKid(auth);
      }
      const uid = kidInfo.uid;
      if (uid && uid !== user.uid) {
        return handleUnauthorized(auth);
      }
      handleSignIn(user, kidInfo, await getDefaultChatRoom());
      initParentNotifications(kidInfo);
      let currentRoom = selectedChatRoom;
      if (kidInfo.status === "new") {
        currentRoom = await createWelcomeRoom(kidInfo, user.uid);
        switchRoom(currentRoom);
      }
      if (currentRoom) {
        await initCounselors(kidInfo, selectedChatRoom, addMessage);
      }
    }
  );

  useEffect(() => {
    dispatch({ type: ChatActionTypes.INIT });
    onAuthStateChanged(auth, async (user) => {
      try {
        if (user !== null) {
          startUserSession.current(user, selectedChatRoom);
        } else {
          dispatch({ type: ChatActionTypes.LOG_OUT });
        }
      } catch (error) {
        catchErrors(error);
      }
    });
    return () => {};
  }, [startUserSession, selectedChatRoom]);

  return (
    <ChatContext.Provider
      value={{
        ...state,
        addMessage,
        catchErrors,
        switchRoom,
        deleteAllMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider, ChatContext };
