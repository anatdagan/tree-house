import { Message } from "../features/chat/types/Messages.d";
import { ChatRoom, RoomType } from "../features/chatroom/types/Rooms.d";
import { Kid } from "../services/apiKids";
import {
  getCounselor,
  getRandomCounselor,
} from "../services/chatbots/apiCounselors";

export enum ChatActionTypes {
  ADD_MESSAGE = "ADD_MESSAGE",
  DELETE_MESSAGE = "DELETE_MESSAGE",
  DELETE_ALL_MESSAGES = "DELETE_ALL_MESSAGES",
  SET_MESSAGES = "SET_MESSAGES",
  SWITCH_ROOM = "SWITCH_ROOM",
  WELCOME_NEW_KID = "WELCOME_NEW_KID",
}
export interface ChatState {
  messages: Message[];
  selectedChatRoom: ChatRoom | null;
}
export interface ChatPayload {
  message?: Message;
  messages?: Message[];
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
interface WELCOME_NEW_KID_ACTION {
  type: ChatActionTypes.WELCOME_NEW_KID;
  payload: { kid: Kid; uid: string };
}
export type ChatAction =
  | ADD_MESSAGE_ACTION
  | DELETE_MESSAGE_ACTION
  | DELETE_ALL_MESSAGES_ACTION
  | SET_MESSAGES_ACTION
  | SWITCH_ROOM_ACTION
  | WELCOME_NEW_KID_ACTION;

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
export const chatReducer = (
  state: ChatState,
  action: ChatAction
): ChatState => {
  switch (action.type) {
    case ChatActionTypes.ADD_MESSAGE: {
      if (!state.selectedChatRoom) {
        return state;
      }
      const { message } = action.payload;
      if (!getCounselor(message.uid)) {
        const responder = appointCounselor(message, state.selectedChatRoom);
        console.log("Appointed counselor", responder);
        responder?.onKidMessage(
          action.payload.message.text,
          state.selectedChatRoom?.id
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

    default:
      return state;
  }
};
