import { ReactNode } from "react";
import classes from "./chat.module.css";
import useChat from "../../hooks/useChat";
import LoadingIndicator from "../../ui/LoadingIndicator";
import Login from "../authentication/Login";
import ErrorMessage from "../../ui/ErrorMessage";
interface Props {
  children?: ReactNode;
}
const Chat = ({ children }: Props) => {
  const { isLoading, user } = useChat();
  if (isLoading) return <LoadingIndicator />;
  return (
    <>
      {user ? (
        <article className={classes.chat}>{children}</article>
      ) : (
        <Login />
      )}
      <ErrorMessage />
    </>
  );
};
export default Chat;
