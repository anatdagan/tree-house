import { ChatProvider } from "../src/contexts/ChatContext";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChatState } from "../src/reducers/chatReducer";
import { vi } from "vitest";

export const customRender = async (
  ui: React.ReactElement,
  state: ChatState
) => {
  const value = {
    ...state,
    deleteAllMessages: vi.fn(),
    switchRoom: vi.fn(),
    addMessage: vi.fn(),
    catchErrors: vi.fn(),
    setActiveCounselorId: vi.fn(),
  };

  return render(<ChatProvider value={value}>{ui}</ChatProvider>);
};
