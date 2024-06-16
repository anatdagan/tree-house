import User from "../features/authentication/types/Users";
import { Message } from "../features/chat/types/Messages.d";
import { ChatRoom, RoomType } from "../features/chatroom/types/Rooms.d";
import { Kid } from "../services/apiKids";
import {
  getCounselor,
  getRandomCounselor,
  getActiveCounselor,
} from "../services/chatbots/apiCounselors";

export enum ChatActionTypes {
  INIT = "chat/init",
  ADD_MESSAGE = "message/add",
  DELETE_MESSAGE = "message/delete",
  DELETE_ALL_MESSAGES = "message/delete_all",
  SET_MESSAGES = "message/set",
  SWITCH_ROOM = "room/switch",
  SET_ERROR = "error/set",
  KID_NOT_FOUND = "kid/not_found",
  UNAUTHORIZED = "user/unauthorized",
  SIGN_IN = "user/sign_in",
  LOG_OUT = "user/logout",
}
export interface ChatState {
  messages: Message[];
  selectedChatRoom: ChatRoom | null;
  isLoading: boolean;
  user: User | null;
  kidInfo: Kid | null;
  error: string;
  defaultRoom: ChatRoom | null;
}

interface INIT_ACTION {
  type: ChatActionTypes.INIT;
}
interface ADD_MESSAGE_ACTION {
  type: ChatActionTypes.ADD_MESSAGE;
  payload: { message: Message };
}
interface DELETE_MESSAGE_ACTION {
  type: ChatActionTypes.DELETE_MESSAGE;
  payload: { message: Message };
}
interface DELETE_ALL_MESSAGES_ACTION {
  type: ChatActionTypes.DELETE_ALL_MESSAGES;
}
interface SET_MESSAGES_ACTION {
  type: ChatActionTypes.SET_MESSAGES;
  payload: { messages: Message[] };
}
interface SWITCH_ROOM_ACTION {
  type: ChatActionTypes.SWITCH_ROOM;
  payload: { room: ChatRoom | null };
}

interface SET_ERROR_ACTION {
  type: ChatActionTypes.SET_ERROR;
  payload: { error: unknown };
}
interface KID_NOT_FOUND_ACTION {
  type: ChatActionTypes.KID_NOT_FOUND;
}
interface UNAUTHORIZED_ACTION {
  type: ChatActionTypes.UNAUTHORIZED;
}
interface SIGN_IN_ACTION {
  type: ChatActionTypes.SIGN_IN;
  payload: { user: User; kidInfo: Kid; defaultRoom: ChatRoom };
}
interface LOG_OUT_ACTION {
  type: ChatActionTypes.LOG_OUT;
}

export type ChatAction =
  | INIT_ACTION
  | ADD_MESSAGE_ACTION
  | DELETE_MESSAGE_ACTION
  | DELETE_ALL_MESSAGES_ACTION
  | SET_MESSAGES_ACTION
  | SWITCH_ROOM_ACTION
  | SET_ERROR_ACTION
  | KID_NOT_FOUND_ACTION
  | UNAUTHORIZED_ACTION
  | SIGN_IN_ACTION
  | LOG_OUT_ACTION;

function appointCounselor(message: Message, selectedChatRoom: ChatRoom | null) {
  if (!selectedChatRoom) {
    return null;
  }
  if (selectedChatRoom.type === RoomType.WELCOME) {
    return getRandomCounselor();
  }
  const mentionMatch = message.text.match(/@(\w+)/);
  if (mentionMatch) {
    return getCounselor(mentionMatch[1].toLowerCase());
  }
  return null;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "An error occurred";
}
export const chatReducer = (
  state: ChatState,
  action: ChatAction
): ChatState => {
  switch (action.type) {
    case ChatActionTypes.INIT:
      return {
        ...state,
        isLoading: true,
        error: "",
      };
    case ChatActionTypes.ADD_MESSAGE: {
      const { selectedChatRoom } = state;
      if (!selectedChatRoom) {
        return state;
      }
      const { message } = action.payload;
      if (!getCounselor(message.uid)) {
        const activeCounselor = getActiveCounselor()?.id;
        const responder = activeCounselor
          ? getCounselor(activeCounselor)
          : appointCounselor(message, selectedChatRoom);
        console.log("Appointed counselor", responder);
        responder?.onKidMessage(
          action.payload.message.text,
          selectedChatRoom?.id
        );
      }

      return {
        ...state,
        messages: [...state.messages, action.payload.message].sort((a, b) =>
          a.createdAt.toMillis() > b.createdAt.toMillis() ? 1 : -1
        ),
      };
    }
    case ChatActionTypes.DELETE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter(
          (message) => message !== action.payload.message
        ),
      };
    case ChatActionTypes.DELETE_ALL_MESSAGES:
      return {
        ...state,
        messages: [],
      };
    case ChatActionTypes.SET_MESSAGES:
      return {
        ...state,
        messages: action.payload.messages || [],
      };
    case ChatActionTypes.SWITCH_ROOM:
      return {
        ...state,
        selectedChatRoom: action.payload.room,
      };

    case ChatActionTypes.SET_ERROR:
      return {
        ...state,
        isLoading: false,
        error: getErrorMessage(action.payload.error),
      };
    case ChatActionTypes.KID_NOT_FOUND:
      return {
        ...state,
        isLoading: false,
        error: "Kid not found",
      };
    case ChatActionTypes.UNAUTHORIZED:
      return {
        ...state,
        isLoading: false,
        error: "You are not authorized to use this app",
      };
    case ChatActionTypes.SIGN_IN:
      return {
        ...state,
        kidInfo: action.payload.kidInfo,
        user: action.payload.user,
        isLoading: false,
        selectedChatRoom: action.payload.defaultRoom,
        defaultRoom: action.payload.defaultRoom,
        error: "",
      };
    case ChatActionTypes.LOG_OUT:
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
