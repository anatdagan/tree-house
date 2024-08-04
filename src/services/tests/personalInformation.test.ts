import { describe, expect, it, Mock, vi } from "vitest";
import { findViolations } from "../apiModeration";
import { Timestamp } from "firebase/firestore";
import { MessageStatus } from "@/components/chat/types/Messages.d";

import { WEB_SAFETY_EXPLANATION_REQUEST } from "@/services/apiIdentifiableInformation";
import { containsPersonalInformation } from "../apiIdentifiableInformation";
import { Sentiment } from "../apiSentimentAnalysis";
import { getRandomCounselor } from "../chatbots/apiCounselors";

describe("Personal Information", {}, () => {
  it("if the message contains personal information, the counselor should be requested to explain why it is wrong.", async () => {
    const message = {
      text: "I like to draw",
      roomId: "123",
      uid: "123",
      id: "123",
      createdAt: Timestamp.now(),
      status: MessageStatus.Sent,
      sentiment: { tone: Sentiment.NEUTRAL, score: 0.5 },
    };
    (containsPersonalInformation as Mock).mockReturnValue(true);
    const startChat = vi.fn();
    const respond = vi.fn();
    (getRandomCounselor as Mock).mockReturnValue({
      startChat,
      respond,
    });
    await findViolations(message); // Test implementation
    expect(startChat).toHaveBeenCalled();
    expect(respond).toHaveBeenCalledWith(WEB_SAFETY_EXPLANATION_REQUEST, "123");
  });
});
