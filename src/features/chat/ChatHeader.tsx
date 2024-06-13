import { ReactNode } from "react";
import classes from "./chat.module.css";
import HomeIcon from "./HomeIcon";
import { ChatAction } from "../../reducers/chatReducer";
import { ChatRoom } from "../chatroom/types/Rooms";
interface Props {
  dispatch: React.Dispatch<ChatAction>;
  generalRoom: React.MutableRefObject<ChatRoom | null>;
  children?: ReactNode;
}

const ChatHeader = ({ dispatch, generalRoom, children }: Props) => {
  return (
    <header className={classes["header-chat"]}>
      <HomeIcon dispatch={dispatch} generalRoom={generalRoom.current} />

      <h1>Treehouse Chat</h1>
      {children}
    </header>
  );
};

export default ChatHeader;
