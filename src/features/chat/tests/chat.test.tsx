import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { customRender } from "../../../../tests/utils";
import Chat from "../Chat";

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
