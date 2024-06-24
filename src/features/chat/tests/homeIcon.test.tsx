import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { customRender } from "../../../../tests/utils";
import HomeIcon from "../HomeIcon";

describe("Home Icon", () => {
  it("should render the home icon", () => {
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
      <HomeIcon />,

      state
    );
    expect(screen.getByAltText("Home")).toBeInTheDocument();
    screen.debug();
  });
});
