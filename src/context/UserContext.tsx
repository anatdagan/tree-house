import {
  ReactNode,
  createContext,
  useEffect,
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

export interface ChatContextProps extends UserState {
  switchRoom: (room: ChatRoom | null) => void;
  catchErrors: (error: unknown) => void;
  setActiveCounselorId: (id: string | null) => void;
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
};
interface ChatProviderProps {
  children?: ReactNode;
  value?: ChatContextProps;
}
const UserContext = createContext<undefined | ChatContextProps>(undefined);
const UserProvider = ({ children, value }: ChatProviderProps) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  useUserSession();
  function useUserSession() {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
        console.log("Auth state changed", authUser);
        setUser(authUser);
        if (authUser === null) {
          dispatch({ type: UserActionTypes.LOG_OUT });
          return;
        }
        console.log("User signed in", authUser);
        signIn(authUser);
      });

      return () => unsubscribe();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return user;
  }
  async function onSignIn(kidInfo: Kid, selectedChatRoom: ChatRoom) {
    await initCounselors(kidInfo);
    await initParentNotifications(kidInfo);
    if (selectedChatRoom.type === RoomType.WELCOME) {
      await startWelcomeChatWithKid(selectedChatRoom);
      console.log("Welcome chat started");
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
    dispatch({
      type: UserActionTypes.ACTIVATE_COUNSELOR,
      payload: {
        activeCounselorId: id,
        counselorActivatedAt: new Date().toISOString(),
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
      auth.signOut();
      dispatch({ type: UserActionTypes.KID_NOT_FOUND });
      return;
    }
    const defaultRoom = await getDefaultChatRoom();
    const room = (await getEntryRoom(newKidInfo, uid)) ?? defaultRoom;
    if (!room) {
      console.error("No room found");
      return;
    }
    const selectedChatRoom = room || defaultRoom;
    dispatch({
      type: UserActionTypes.SIGN_IN,
      payload: {
        user,
        defaultRoom,
        kidInfo: newKidInfo || null,
        selectedChatRoom,
      },
    });
    await onSignIn(newKidInfo, selectedChatRoom);
  };

  return (
    <UserContext.Provider
      value={
        value || {
          ...{
            catchErrors,
            switchRoom,
            setActiveCounselorId,
          },
          ...state,
        }
      }
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
