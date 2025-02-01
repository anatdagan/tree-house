import { fireEvent, screen, waitFor } from "@testing-library/react";
import {
  customUserContextRender,
  getCatchErrors,
  getFakeState,
} from "../../../../tests/utils";
import BasicLogin from "../BasicLogin";
import { signInWithEmailAndPassword } from "firebase/auth";
import { describe, it, expect } from "vitest";

describe("Login Errors", () => {
  it("should display an error message when login fails", async () => {
    const state = getFakeState();
    customUserContextRender(<BasicLogin />, state);

    const loginButton = screen.getByRole("button");
    // @ts-ignore
    signInWithEmailAndPassword.mockRejectedValue(
      new Error("Firebase: Error (auth/user-not-found).")
    );
    const catchErrors = getCatchErrors();
    fireEvent(
      loginButton,
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );
    await waitFor(() => {
      expect(
        catchErrors.mock.calls[0][0].message.indexOf("User not found")
      ).toBeGreaterThan(-1);
    });
    screen.debug();
  });
});
