import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import Login from "../Login";
import { customUserContextRender, getFakeState } from "../../../../tests/utils";

describe("Login", () => {
  it("should render the login form", () => {
    const state = getFakeState();

    customUserContextRender(
      <Login />,

      state
    );
    expect(screen.getByText("Login")).toBeInTheDocument();
    screen.debug();
  });
});
