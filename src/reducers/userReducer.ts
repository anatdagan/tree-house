import {
  initCounselors,
  startWelcomeChatWithKid,
} from "@/services/chatbots/apiCounselors";
import User from "../components/authentication/types/Users";

import { ChatRoom, RoomType } from "../components/chatroom/types/Rooms.d";
import { Kid, KidStatus, updateKidStatus } from "../services/apiKids";
import { initParentNotifications } from "@/services/apiParentNotifications";

export enum UserActionTypes {
  INIT = "chat/init",
  LOAD = "chat/load",

  SWITCH_ROOM = "room/switch",
  SET_ERROR = "error/set",
  KID_NOT_FOUND = "kid/not_found",
  UNAUTHORIZED = "user/unauthorized",
  SIGN_IN = "user/sign_in",
  LOG_OUT = "user/logout",
  ACTIVATE_COUNSELOR = "counselor/active",
}
export interface UserState {
  selectedChatRoom: ChatRoom | null;
  isLoading: boolean;
  user: User | null;
  kidInfo: Kid | null;
  error: string;
  defaultRoom: ChatRoom | null;
  activeCounselorId: string | null;
  counselorActivatedAt: string | null;
}

interface INIT_ACTION {
  type: UserActionTypes.INIT;
}
interface LOAD_ACTION {
  type: UserActionTypes.LOAD;
}

interface SWITCH_ROOM_ACTION {
  type: UserActionTypes.SWITCH_ROOM;
  payload: { room: ChatRoom | null };
}
interface SET_ERROR_ACTION {
  type: UserActionTypes.SET_ERROR;
  payload: { error: unknown };
}
interface KID_NOT_FOUND_ACTION {
  type: UserActionTypes.KID_NOT_FOUND;
}
interface UNAUTHORIZED_ACTION {
  type: UserActionTypes.UNAUTHORIZED;
}
interface SIGN_IN_ACTION {
  type: UserActionTypes.SIGN_IN;
  payload: {
    user: User;
    kidInfo: Kid;
    defaultRoom: ChatRoom;
    selectedChatRoom: ChatRoom;
  };
}
interface LOG_OUT_ACTION {
  type: UserActionTypes.LOG_OUT;
}
interface ACTIVATE_COUNSELOR_ACTION {
  type: UserActionTypes.ACTIVATE_COUNSELOR;
  payload: {
    activeCounselorId: string | null;
    counselorActivatedAt: string | null;
  };
}

export type ChatAction =
  | INIT_ACTION
  | LOAD_ACTION
  | SWITCH_ROOM_ACTION
  | SET_ERROR_ACTION
  | KID_NOT_FOUND_ACTION
  | UNAUTHORIZED_ACTION
  | SIGN_IN_ACTION
  | ACTIVATE_COUNSELOR_ACTION
  | LOG_OUT_ACTION;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "An error occurred";
}
export const userReducer = (
  state: UserState,
  action: ChatAction
): UserState => {
  switch (action.type) {
    case UserActionTypes.INIT:
      return {
        ...state,
        error: "",
      };
    case UserActionTypes.LOAD:
      return {
        ...state,
        isLoading: true,
      };

    case UserActionTypes.SWITCH_ROOM:
      if (
        state.selectedChatRoom?.type === RoomType.WELCOME &&
        action.payload.room?.type !== RoomType.WELCOME &&
        state.kidInfo
      ) {
        updateKidStatus(state.kidInfo, KidStatus.ACTIVE);
      }
      return {
        ...state,
        selectedChatRoom: action.payload.room,
      };

    case UserActionTypes.SET_ERROR:
      return {
        ...state,
        isLoading: false,
        error: getErrorMessage(action.payload.error),
      };
    case UserActionTypes.KID_NOT_FOUND:
      return {
        ...state,
        isLoading: false,
        error: "Kid not found",
      };

    case UserActionTypes.SIGN_IN:
      return {
        ...state,
        kidInfo: action.payload.kidInfo,
        user: action.payload.user,
        isLoading: false,
        selectedChatRoom: action.payload.selectedChatRoom,
        defaultRoom: action.payload.defaultRoom,
        error: "",
      };
    case UserActionTypes.LOG_OUT:
      return {
        ...state,
        kidInfo: null,
        user: null,
        isLoading: false,
        error: "",
      };

    default:
      return state;
  }
};
