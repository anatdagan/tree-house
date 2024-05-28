import { ReactNode } from "react";
import classes from "./chat.module.css";

interface Props {
  children?: ReactNode;
}

const ChatHeader = ({ children }: Props) => {
  return (
    <header className={classes["header-chat"]}>
      <h1>Treehouse Chat</h1>
      {children}
    </header>
  );
};

export default ChatHeader;
