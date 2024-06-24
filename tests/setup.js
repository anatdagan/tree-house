import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { RoomType } from "../src/features/chatroom/types/Rooms.d.ts";
expect.extend(matchers);

vi.mock("firebase/auth", () => {
  return {
    signInWithPopup: vi.fn(),
    GoogleAuthProvider: vi.fn(),
    getAuth: vi.fn(),
    onAuthStateChanged: vi.fn(),
    connectAuthEmulator: vi.fn(),
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
afterEach(() => {
  vi.resetAllMocks();
  cleanup();
});
