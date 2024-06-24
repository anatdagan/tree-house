import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import Login from "../Login";
import { customRender } from "../../../../tests/utils";

describe("Login", () => {
  it("should render the login form", () => {
    const state = {
      messages: [],
      selectedChatRoom: null,
      isLoading: false,
      user: null,
      kidInfo: null,
      error: "",
      defaultRoom: null,
    };

    customRender(
      <Login />,

      state
    );
    expect(screen.getByText("Login")).toBeInTheDocument();
    screen.debug();
  });
});
