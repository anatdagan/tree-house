import { ChatProvider } from "../src/contexts/ChatContext";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChatState } from "../src/reducers/chatReducer";
import { actionCreators } from "../src/actions/actionCreators";

export const customRender = async (
  ui: React.ReactElement,
  state: ChatState
) => {
  const value = { ...state, ...actionCreators };

  return render(<ChatProvider value={value}>{ui}</ChatProvider>);
};
