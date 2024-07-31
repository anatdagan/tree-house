import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ChatNewMessage from "@/features/chat/ChatNewMessage";
import { customRender } from "/tests/utils";

describe("ChatNewMessage", () => {
  it("should render the add message form", () => {
    const state = {
      messages: [],
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
    };

    customRender(<ChatNewMessage />, state);

    expect(screen.getByLabelText("Write a message")).toBeInTheDocument();
    screen.debug();
  });
});
