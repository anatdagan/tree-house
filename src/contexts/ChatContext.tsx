import { ReactNode, createContext, useEffect, useReducer, useRef } from "react";
import {
  ChatActionTypes,
  ChatState,
  chatReducer,
} from "../reducers/chatReducer";
import { actionCreators } from "../actions/actionCreators";

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

export interface ChatContextProps extends ChatState {
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
interface ChatProviderProps {
  children?: ReactNode;
  value?: ChatContextProps;
}
const ChatContext = createContext<undefined | ChatContextProps>(undefined);
const ChatProvider = ({ children, value }: ChatProviderProps) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { selectedChatRoom } = state;

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
  function loadChat() {
    dispatch({ type: ChatActionTypes.LOAD });
  }

  const startUserSession = useRef(
    async (user: User, selectedChatRoom: ChatRoom | null) => {
      const { addMessage, switchRoom } = actionCreators;
      let kidInfo;
      try {
        kidInfo = await getKidInfo(user.email);
        if (!kidInfo) {
          return handleMissingKid(auth);
        }
      } catch (error) {
        console.log("Error getting kid info", error);
        return handleMissingKid(auth);
      }
      const uid = kidInfo.uid;
      try {
        if (uid && uid !== user.uid) {
          return handleUnauthorized(auth);
        }
        handleSignIn(user, kidInfo, await getDefaultChatRoom());
      } catch (error) {
        console.error("Error getting default chat room", error);
        return handleUnauthorized(auth);
      }
      try {
        initParentNotifications(kidInfo);
      } catch (error) {
        console.error("Error initializing parent notifications", error);
      }
      let currentRoom = selectedChatRoom;
      if (kidInfo.status === "new") {
        try {
          currentRoom = await createWelcomeRoom(kidInfo, user.uid);
          switchRoom(currentRoom);
        } catch (error) {
          console.error("Error creating welcome room", error);
        }
      }
      if (currentRoom) {
        try {
          await initCounselors(kidInfo, selectedChatRoom, addMessage);
        } catch (error) {
          console.error("Error initializing counselors", error);
        }
      }
    }
  );

  useEffect(() => {
    dispatch({ type: ChatActionTypes.INIT });

    onAuthStateChanged(auth, async (user) => {
      const { catchErrors } = actionCreators;
      try {
        loadChat();
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
    <ChatContext.Provider value={value || { ...actionCreators, ...state }}>
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider, ChatContext };
