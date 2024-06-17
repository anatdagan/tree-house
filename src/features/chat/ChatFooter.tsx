import { ReactNode } from "react";
import classes from "./chat.module.css";

interface Props {
  children?: ReactNode;
}

const ChatFooter = ({ children }: Props) => {
  return <footer className={classes["footer-chat"]}>{children}</footer>;
};

export default ChatFooter;
