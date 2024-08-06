import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { customUserContextRender, getFakeState } from "/tests/utils";
import InboxIcon from "../InboxIcon";
import {
  InboxMessageStatus,
  InboxMessageType,
} from "@/components/Inbox/inbox.d";

describe("Inbox Icon", () => {
  it("should display a red circle if there are unread messages", () => {
    const state = getFakeState();
    state.inboxMessages.push({
      status: InboxMessageStatus.Unread,
      id: "123",
      subject: "Test",
      type: InboxMessageType.ChatroomInvite,
    });

    customUserContextRender(
      <InboxIcon />,

      state
    );
    screen.debug();

    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.queryByTestId("unread")).toBeInTheDocument();
  });
});
