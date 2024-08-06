import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ChatNewMessage from "@/components/chat/ChatNewMessage";
import { customRender, getFakeState } from "/tests/utils";

describe("ChatNewMessage", () => {
  it("should render the add message form", () => {
    const state = getFakeState();

    customRender(<ChatNewMessage />, state, []);

    expect(screen.getByLabelText("Write a message")).toBeInTheDocument();
    screen.debug();
  });
});
