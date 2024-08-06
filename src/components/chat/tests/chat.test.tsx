import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import Chat from "../Chat";
import { customUserContextRender, getFakeState } from "../../../../tests/utils";

describe("Chat", () => {
  it("it should include the chat component if the user is logged in", () => {
    const state = getFakeState();
    // @ts-expect-error state is not readonly
    state.user = {
      uid: "123",
      photoURL: "avatar.png",
      displayName: "Kid",
      email: "kid@test.com",
    };
    customUserContextRender(<Chat />, state);
    screen.debug();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
    expect(screen.queryByTestId("chat")).toBeInTheDocument();
  });
});
