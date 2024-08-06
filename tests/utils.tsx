import { UserProvider } from "@/context/UserContext";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UserState } from "@/reducers/userReducer";
import { vi } from "vitest";
import { MessageProvider } from "@/context/MessagesContext";
import { Message } from "@/components/chat/types/Messages.d";
import { RoomType } from "@/components/chatroom/types/Rooms.d";
import { InboxMessageData } from "@/components/Inbox/inbox.d";

/**
 * A custom render function for the UserContext, which is used to test the UserProvider.
 * @param ui
 * @param state
 * @returns
 */
export const customUserContextRender = async (
  ui: React.ReactElement,
  state: UserState
) => {
  const value = {
    ...state,
    deleteAllMessages: vi.fn(),
    switchRoom: vi.fn(),
    addMessage: vi.fn(),
    catchErrors: vi.fn(),
    setActiveCounselorId: vi.fn(),
  };

  return render(<UserProvider value={value}>{ui}</UserProvider>, {});
};

/**
 * A custom render function for the MessageContext, which is used to test the MessageProvider.
 * @param ui
 * @param messages
 * @returns
 */
export const customMessageContextRender = async (
  ui: React.ReactElement,
  messages: Message[]
) => {
  const value = {
    messages,
    deleteAllMessages: vi.fn(),
    setMessage: vi.fn(),
    setMessages: vi.fn(),
  };

  return render(<MessageProvider value={value}>{ui}</MessageProvider>);
};

export const customRender = async (
  ui: React.ReactElement,
  state: UserState,
  messages: Message[]
) => {
  const userValue = {
    ...state,
    deleteAllMessages: vi.fn(),
    switchRoom: vi.fn(),
    addMessage: vi.fn(),
    catchErrors: vi.fn(),
    setActiveCounselorId: vi.fn(),
  };

  const messageValue = {
    messages,
    deleteAllMessages: vi.fn(),
    setMessage: vi.fn(),
    setMessages: vi.fn(),
  };

  return render(
    <UserProvider value={userValue}>
      <MessageProvider value={messageValue}>{ui}</MessageProvider>
    </UserProvider>
  );
};
export const getFakeChatRoom = () => ({
  id: "general",
  name: "General",
  description: "General chat room",
  type: RoomType.PUBLIC,
  createdAt: new Date(),
  createdBy: "123",
});
export const getFakeCounselors = () => {
  const counselors = new Map();
  counselors.set("one", {
    id: "one",
    name: "Counselor 1",
    avatar: "avatar1.png",
  });
  counselors.set("two", {
    id: "two",
    name: "Counselor 2",
    avatar: "avatar2.png",
  });
  return counselors;
};
export const getFakeState = () => ({
  selectedChatRoom: null,
  isLoading: false,
  user: null,
  kidInfo: {
    uid: "123",
    avatar: "avatar.png",
    displayName: "Kid",
    email: "kid@gmail.com",
    parentId: "456",
    status: "active",
  },
  error: "",
  defaultRoom: null,
  activeCounselorId: "",
  counselorActivatedAt: "",
  counselors: getFakeCounselors(),
  inboxMessages: [] as InboxMessageData[],
});
