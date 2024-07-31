import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import Login from "../Login";
import { customUserContextRender } from "../../../../tests/utils";

describe("Login", () => {
  it("should render the login form", () => {
    const state = {
      selectedChatRoom: null,
      isLoading: false,
      user: null,
      kidInfo: null,
      error: "",
      defaultRoom: null,
      activeCounselorId: "",
      counselorActivatedAt: "",
    };

    customUserContextRender(
      <Login />,

      state
    );
    expect(screen.getByText("Login")).toBeInTheDocument();
    screen.debug();
  });
});
