import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ChatMessages from "@/components/chat/ChatMessages";
import { customRender, getFakeState } from "/tests/utils";
import { Timestamp } from "firebase/firestore";
import { MessageStatus } from "../types/Messages.d";

function getFakeMessages() {
  return [
    {
      text: "Hello",
      uid: "123",
      id: "123",
      createdAt: Timestamp.fromDate(new Date("2022-01-01 12:04:00")),
      status: MessageStatus.Sent,
      roomId: "123",
    },
    {
      text: "Hi",
      uid: "456",
      id: "456",
      createdAt: Timestamp.fromDate(new Date("2022-11-21 01:15:00")),
      status: MessageStatus.Sent,
      roomId: "123",
    },
  ];
}
describe("ChatMessages", {}, () => {
  it("should render the messages", () => {
    const state = getFakeState();
    const messages = getFakeMessages();
    customRender(<ChatMessages />, state, messages);
    screen.debug();

    expect(screen.queryByText("Hello")).toBeInTheDocument();
    expect(screen.queryByText("Hi")).toBeInTheDocument();
    expect(screen.queryByText("12:04")).toBeInTheDocument();
    expect(screen.queryByText("01:15")).toBeInTheDocument();
  });
});
