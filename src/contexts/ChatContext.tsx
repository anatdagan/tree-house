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
import {
  Kid,
  KidStatus,
  getKidInfo,
  updateKidStatus,
} from "../services/apiKids";
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
  setActiveCounselorId: (id: string | undefined) => void;
}
const initialState = {
  messages: [],
  selectedChatRoom: null,
  isLoading: false,
  user: null,
  kidInfo: null,
  error: "",
  defaultRoom: null,
  activeCounselorId: "",
};
interface ChatProviderProps {
  children?: ReactNode;
  value?: ChatContextProps;
}
const ChatContext = createContext<undefined | ChatContextProps>(undefined);
const ChatProvider = ({ children, value }: ChatProviderProps) => {
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
  const switchRoom = (room: ChatRoom | null) => {
    dispatch({ type: ChatActionTypes.SWITCH_ROOM, payload: { room } });
  };

  function handleMissingKid(auth: Auth) {
    dispatch({ type: ChatActionTypes.KID_NOT_FOUND });
    auth.signOut();
  }
  function handleUnauthorized(auth: Auth) {
    dispatch({ type: ChatActionTypes.UNAUTHORIZED });
    auth.signOut();
  }
  async function handleSignIn(user: User, kidInfo: Kid, defaultRoom: ChatRoom) {
    await updateKidStatus(kidInfo, KidStatus.ACTIVE);
    dispatch({
      type: ChatActionTypes.SIGN_IN,
      payload: { user, kidInfo, defaultRoom },
    });
  }
  function loadChat() {
    dispatch({ type: ChatActionTypes.LOAD });
  }
  const setActiveCounselorId = (id: string | undefined) => {
    dispatch({
      type: ChatActionTypes.ACTIVATE_COUNSELOR,
      payload: {
        activeCounselorId: id,
        counselorActivatedAt: new Date().toISOString(),
      },
    });
  };
  const startUserSession = useRef(
    async (user: User, selectedChatRoom: ChatRoom | null) => {
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
          await initCounselors(kidInfo, currentRoom, addMessage);
        } catch (error) {
          console.error("Error initializing counselors", error);
        }
      }
    }
  );

  useEffect(() => {
    dispatch({ type: ChatActionTypes.INIT });

    onAuthStateChanged(auth, async (user) => {
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
    <ChatContext.Provider
      value={
        value || {
          ...{
            catchErrors,
            deleteAllMessages,
            switchRoom,
            addMessage,
            setActiveCounselorId,
          },
          ...state,
        }
      }
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider, ChatContext };
