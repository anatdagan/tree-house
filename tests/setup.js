import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { RoomType } from "../src/components/chatroom/types/Rooms.d";

expect.extend(matchers);

vi.mock("firebase/auth", () => {
  return {
    signInWithPopup: vi.fn(),
    GoogleAuthProvider: vi.fn(),
    getAuth: vi.fn(),
    onAuthStateChanged: vi.fn().mockReturnValue(vi.fn()),
    connectAuthEmulator: vi.fn(),
  };
});
vi.mock("@/services/db", () => {
  return {
    getChatRoom: vi.fn(),
    getMessages: vi.fn(),
    addMessage: vi.fn(),
    switchRoom: vi.fn(),
    deleteAllMessages: vi.fn(),
    getDocById: vi.fn(),
    addDocToCollection: vi.fn(),
    getDocDataFromCollection: vi.fn(),
  };
});
vi.mock("@/services/apiMessages", () => {
  return {
    getMessages: vi.fn(),
    addMessage: vi.fn().mockResolvedValue({
      id: "123",
      content: "Hello!",
      createdAt: new Date(),
      createdBy: "123",
      roomId: "general",
    }),
    deleteAllMessages: vi.fn(),
  };
});
vi.mock("@/services/apiModeration", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    flagMessage: vi.fn(),
  };
});
vi.mock("@/services/chatbots/apiCounselors", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    getCounselor: vi.fn().mockResolvedValue({
      id: "123",
      name: "Counselor",
      description: "Counselor description",
      avatar: "avatar.png",
      welcomeMessages: ["Hello!"],
    }),
    getCounselorHistory: vi.fn().mockResolvedValue([]),
    getRandomCounselor: vi.fn(),
  };
});
vi.mock("../src/services/chatbots/apiChatbots", () => {
  return {
    getChatbotResponse: vi.fn(),
    getChatbot: vi.fn().mockResolvedValue({
      id: "123",
      name: "Chatbot",
      description: "Chatbot description",
      avatar: "avatar.png",
      welcomeMessages: ["Hello!"],
    }),
    getChatbotHistory: vi.fn().mockResolvedValue([]),
  };
});

vi.mock("@/services/apiIdentifiableInformation", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    initPersonalInfoIdentifier: vi.fn(),
    containsPersonalInformation: vi.fn(),
  };
});

vi.mock("firebase/firestore", () => {
  return {
    Timestamp: { now: vi.fn() },
    getFirestore: vi.fn(),
    connectFirestoreEmulator: vi.fn(),
  };
});
vi.mock("firebase/storage", () => {
  return {
    getStorage: vi.fn(),
    ref: vi.fn(),
    uploadString: vi.fn(),
    getDownloadURL: vi.fn(),
  };
});
vi.mock("firebase/analytics", () => {
  return {
    getAnalytics: vi.fn(),
    logEvent: vi.fn(),
  };
});

vi.mock("firebase/vertexai-preview", () => {
  return {
    POSSIBLE_ROLES: ["user", "model"],
    getVertexAI: vi.fn(),
    getPredictionService: vi.fn(),
    predict: vi.fn(),
  };
});
vi.mock("../../hooks/useUser", () => {
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
vi.mocked("firebase/app-check", () => {
  return {
    initializeAppCheck: vi.fn(),
    onTokenChanged: vi.fn(),
  };
});
vi.mock("../firebase.ts", () => {
  return {
    initializeApp: vi.fn(),
    getAuth: vi.fn().mockReturnValue({
      currentUser: {
        uid: "123",
        displayName: "Kid",
        email: "kid@gmail.com",
      },
    }),
    auth: {},
    getFirestore: vi.fn(),
    getAnalytics: vi.fn(),
  };
});
afterEach(() => {
  vi.resetAllMocks();
  cleanup();
});
