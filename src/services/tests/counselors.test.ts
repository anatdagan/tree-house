import { beforeAll, describe, expect, it } from "vitest";
import { appointCounselor, initCounselors } from "../chatbots/apiCounselors";
import { Timestamp } from "firebase/firestore";
import { MessageStatus } from "@/components/chat/types/Messages.d";
import { getFakeChatRoom } from "/tests/utils";

describe("Counselors", {}, () => {
  beforeAll(() => {
    const kidInfo = {
      uid: "123",
      avatar: "avatar.png",
      displayName: "Kid",
      email: "kid@email.com",
      parentId: "456",
      status: "active",
    };
    initCounselors(kidInfo);
  });
  describe("appointCounselor", {}, () => {
    it("should appoint a counselor if it is mentioned in the message", () => {
      const message = {
        text: "@minnie I need help",
        roomId: "123",
        uid: "123",
        id: "123",
        createdAt: Timestamp.fromDate(new Date("2022-01-01 12:04:00")),
        status: MessageStatus.Sent,
      };
      const chatRoom = getFakeChatRoom();

      const counselor = appointCounselor(message, chatRoom);
      expect(counselor?.id).toBe("minnie");
    });
    it("should appoint the active counselor if there is no mention in the message", () => {
      const message = {
        text: "I need help",
        roomId: "123",
        uid: "123",
        id: "123",
        createdAt: Timestamp.fromDate(new Date("2022-01-01 12:04:00")),
        status: MessageStatus.Sent,
      };
      const chatRoom = getFakeChatRoom();

      const counselor = appointCounselor(message, chatRoom, "jimmy");
      expect(counselor?.id).toBe("jimmy");
    });
  });
});
