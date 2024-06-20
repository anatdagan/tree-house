import { Message } from "../features/chat/types/Messages";
import { ChatActionTypes } from "../reducers/chatReducer";
import { ChatRoom } from "../features/chatroom/types/Rooms";

export const actionCreators = {
  addMessage: (message: Message) => ({
    type: ChatActionTypes.ADD_MESSAGE,
    payload: { message },
  }),
  switchRoom: (room: ChatRoom | null) => ({
    type: ChatActionTypes.SWITCH_ROOM,
    payload: { room },
  }),
  catchErrors: (error: unknown) => ({
    type: ChatActionTypes.SET_ERROR,
    payload: { error },
  }),
  deleteAllMessages: () => ({
    type: ChatActionTypes.DELETE_ALL_MESSAGES,
  }),
};
