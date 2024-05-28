import { ReactNode } from "react";
import classes from "./chat.module.css";

interface Props {
  children?: ReactNode;
}

const ChatFooter = ({ children }: Props) => {
  return <div className={classes["footer-chat"]}>{children}</div>;
};

export default ChatFooter;
