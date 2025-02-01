import {
  ReactNode,
  createContext,
  useEffect,
  useMemo,
  memo,
  useReducer,
  useState,
} from "react";
import {
  UserActionTypes,
  UserState,
  userReducer,
} from "../reducers/userReducer";

import User from "../components/authentication/types/Users";
import { getDefaultChatRoom, getEntryRoom } from "../services/apiChatRooms";
import { getKidInfoByUid, Kid } from "../services/apiKids";
import { app, auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ChatRoom, RoomType } from "../components/chatroom/types/Rooms.d";
import {
  initCounselors,
  startWelcomeChatWithKid,
} from "@/services/chatbots/apiCounselors";
import { initParentNotifications } from "@/services/apiParentNotifications";
import { getInboxMessages } from "@/services/apiInbox";
import { InboxMessageData } from "@/components/Inbox/inbox.d";

export interface ChatContextProps extends UserState {
  switchRoom: (room: ChatRoom | null) => void;
  catchErrors: (error: unknown) => void;
  setActiveCounselorId: (id: string | null) => void;
  setInboxMessages: (inboxMessages: InboxMessageData[]) => void;
}
const initialState = {
  selectedChatRoom: null,
  isLoading: false,
  user: null,
  kidInfo: null,
  error: "",
  defaultRoom: null,
  activeCounselorId: null,
  counselorActivatedAt: null,
  counselors: new Map(),
  inboxMessages: [],
};
interface ChatProviderProps {
  children?: ReactNode;
  value?: ChatContextProps;
}
const UserContext = createContext<undefined | ChatContextProps>(undefined);
const UserProvider = memo(({ children, value }: ChatProviderProps) => {
  console.debug("UserProvider");
  const [state, dispatch] = useReducer(userReducer, initialState);
  console.debug("state", state);
  useUserSession();
  function useUserSession() {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
      console.debug("useUserSession");
      const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
        console.debug("onAuthStateChanged", authUser);
        setUser(authUser);
        if (authUser === null) {
          dispatch({ type: UserActionTypes.LOG_OUT });
          return;
        }
        signIn(authUser);
      });

      return () => unsubscribe();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return user;
  }
  async function onSignIn(kidInfo: Kid, selectedChatRoom: ChatRoom) {
    const counselors = await initCounselors(kidInfo);
    dispatch({
      type: UserActionTypes.INIT_COUNSELORS,
      payload: { counselors },
    });
    await initParentNotifications(kidInfo);
    if (selectedChatRoom.type === RoomType.WELCOME) {
      await startWelcomeChatWithKid(selectedChatRoom);
    }
  }
  const catchErrors = (error: unknown) => {
    dispatch({
      type: UserActionTypes.SET_ERROR,
      payload: { error },
    });
  };

  const switchRoom = (room: ChatRoom | null) => {
    dispatch({ type: UserActionTypes.SWITCH_ROOM, payload: { room } });
  };

  const setActiveCounselorId = (id: string | null) => {
    const counselorActivatedAt = id ? new Date().toISOString() : null;
    dispatch({
      type: UserActionTypes.ACTIVATE_COUNSELOR,
      payload: {
        activeCounselorId: id,
        counselorActivatedAt: counselorActivatedAt,
      },
    });
  };

  const setInboxMessages = (inboxMessages: InboxMessageData[]) => {
    dispatch({
      type: UserActionTypes.GET_INBOX_MESSAGES,
      payload: {
        inboxMessages,
      },
    });
  };
  const signIn = async (user: User | null) => {
    if (!user) {
      return;
    }
    const { uid } = user;
    const newKidInfo = await getKidInfoByUid(app, uid);
    if (!newKidInfo) {
      dispatch({ type: UserActionTypes.KID_NOT_FOUND });
      return;
    }
    const defaultRoom = await getDefaultChatRoom();
    const room = (await getEntryRoom(newKidInfo, uid)) ?? defaultRoom;
    if (!room) {
      console.error("No room found");
      return;
    }
    const inboxMessages = await getInboxMessages(newKidInfo.email);
    const selectedChatRoom = room || defaultRoom;
    dispatch({
      type: UserActionTypes.SIGN_IN,
      payload: {
        user,
        defaultRoom,
        kidInfo: newKidInfo || null,
        selectedChatRoom,
        inboxMessages,
      },
    });
    await onSignIn(newKidInfo, selectedChatRoom);
  };
  value = value || {
    ...{
      catchErrors,
      switchRoom,
      setActiveCounselorId,
      setInboxMessages,
    },
    ...state,
  };
  return (
    <UserContext.Provider value={useMemo(() => value, [value, state])}>
      {children}
    </UserContext.Provider>
  );
});

export { UserProvider, UserContext };
