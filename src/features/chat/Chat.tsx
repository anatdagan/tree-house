import { ReactNode } from "react";
import classes from "./chat.module.css";
interface Props {
  children?: ReactNode;
}
const Chat = ({ children }: Props) => {
  return <div className={classes.chat}>{children}</div>;
};
export default Chat;
