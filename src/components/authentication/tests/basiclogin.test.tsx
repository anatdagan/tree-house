import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import BasicLogin from "../BasicLogin";
import { customUserContextRender } from "../../../../tests/utils";

describe("Basic Login", () => {
  it("should render the basic login form", () => {
    const state = {
      messages: [],
      selectedChatRoom: null,
      isLoading: false,
      user: null,
      kidInfo: null,
      error: "",
      defaultRoom: null,
    };

    customUserContextRender(<BasicLogin />, state);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
    screen.debug();
  });
});
