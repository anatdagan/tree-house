import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import Chat from "../Chat";
import { customUserContextRender } from "../../../../tests/utils";
import { RoomType } from "@/components/chatroom/types/Rooms.d";

describe("Chat", () => {
  it("it should include the chat component if the user is logged in", () => {
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
    customUserContextRender(<Chat />, state);
    screen.debug();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
    expect(screen.queryByTestId("chat")).toBeInTheDocument();
  });
});
