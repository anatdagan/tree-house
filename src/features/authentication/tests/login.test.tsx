import { vi, describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import Login from "../Login";
import { customRender } from "../../../../tests/utils";
import { RoomType } from "../../chatroom/types/Rooms.d";

vi.mock("firebase/auth", () => {
  return {
    signInWithPopup: vi.fn(),
    GoogleAuthProvider: vi.fn(),
    getAuth: vi.fn(),
    onAuthStateChanged: vi.fn(),
  };
});
vi.mock("../../services/db", () => {
  return {
    getKidInfo: vi.fn(),
    getChatRoom: vi.fn(),
    getMessages: vi.fn(),
    addMessage: vi.fn(),
    switchRoom: vi.fn(),
    deleteAllMessages: vi.fn(),
  };
});
vi.mock("../../../../firebase", () => {
  return {
    auth: vi.fn(),
    firestore: vi.fn(),
  };
});
vi.mock("../../../services/chatbots/apiCounselors", () => {
  return {
    sendMessage: vi.fn(),
  };
});
vi.mock("../../../services/apiModeration", () => {
  return {
    moderateMessage: vi.fn(),
  };
});
vi.mock("../../../services/apiParentNotifications", () => {
  return {
    moderateMessage: vi.fn(),
  };
});
vi.mock("firebase/auth", () => {
  return {
    signInWithPopup: vi.fn(),
    GoogleAuthProvider: vi.fn(),
    getAuth: vi.fn(),
    onAuthStateChanged: vi.fn(),
  };
});

vi.mock("firebase/firestore", () => {
  return {
    Timestamp: vi.fn(),
    getFirestore: vi.fn(),
  };
});
vi.mock("../../hooks/useChat", () => {
  return vi.fn().mockReturnValue({
    kidInfo: {
      uid: "123",
      avatar: "avatar.png",
      displayName: "Kid",
      email: "kid@gmail.com",
      parentId: "456",
      status: "active",
    },
    selectedChatRoom: {
      id: "general",
      name: "General",
      description: "General chat room",
      type: RoomType.PUBLIC,
      createdAt: new Date(),
      createdBy: "123",
    },
    messages: [],
    isLoading: false,
    error: "",

    addMessage: vi.fn(),
    switchRoom: vi.fn(),
    catchErrors: vi.fn(),
    deleteAllMessages: vi.fn(),
    user: null,
    defaultRoom: null,
  });
});
describe("Login", () => {
  it("should render the login form", () => {
    const state = {
      messages: [],
      selectedChatRoom: null,
      isLoading: false,
      user: null,
      kidInfo: null,
      error: "",
      defaultRoom: null,
    };

    customRender(
      <Login />,

      state
    );
    expect(screen.getByText("Login")).toBeInTheDocument();
    screen.debug();
  });
});
