import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { customUserContextRender, getFakeState } from "/tests/utils";
import HomeIcon from "../HomeIcon";

describe("Home Icon", () => {
  it("should render the home icon", () => {
    const state = getFakeState();

    customUserContextRender(
      <HomeIcon />,

      state
    );
    expect(screen.getByAltText("Home")).toBeInTheDocument();
    screen.debug();
  });
});
