import { customRender } from "/tests/utils";
import { describe, expect, it } from "vitest";
import { RoomType } from "@/features/chatroom/types/Rooms.d";
import Chat from "../Chat";
import { getSentimentChecks, Sentiment } from "@/services/apiSentimentAnalysis";

describe("Boredom", {}, () => {
  describe("listenToBoredom", {}, () => {
    it("should listen to boredom messages", () => {
      const state = {
        messages: [],
        selectedChatRoom: {
          id: "123",
          name: "Room",
          type: RoomType.WELCOME,
          createdAt: new Date(),
          createdBy: "123",
          description: "Kid room",
        },
        isLoading: false,
        user: {
          uid: "123",
          photoURL: "avatar.png",
          displayName: "Kid",
          email: "kid@gmail.com",
          phoneNumber: "1234567890",
          providerId: "google.com",
          isAnonymous: false,
        },
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
      };
      customRender(<Chat />, state);
      expect(getSentimentChecks(Sentiment.BORED)?.callback).toBeDefined();
    });
  });
});
