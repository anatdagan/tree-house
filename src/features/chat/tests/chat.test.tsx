import { vi, describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { customRender } from "../../../../tests/utils";
import Chat from "../Chat";
import { RoomType } from "../../chatroom/types/Rooms.d";

vi.mock("firebase/auth", () => {
  return {
    signInWithPopup: vi.fn(),
    GoogleAuthProvider: vi.fn(),
    getAuth: vi.fn(),
    connectAuthEmulator: vi.fn(),
    onAuthStateChanged: vi.fn(),
  };
});
vi.mock("firebase/firestore", () => {
  return {
    Timestamp: vi.fn(),
    getFirestore: vi.fn(),
    connectFirestoreEmulator: vi.fn(),
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
describe("Chat", () => {
  it("it should include the login component if the user is not logged in", () => {
    const state = {
      messages: [],
      selectedChatRoom: null,
      isLoading: false,
      user: null,
      kidInfo: null,
      error: "",
      defaultRoom: null,
    };

    customRender(<Chat />, state);
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    screen.debug();
  });
});
