import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Login from "../Login";

describe("Login", () => {
  it("should render the login form", () => {
    render(<Login />);

    screen.debug();
  });
});
