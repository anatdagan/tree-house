import classes from "./chat.module.css";

interface Props {
  displayName: string;
}
const ChatUser = ({ displayName }: Props) => {
  return <p className={classes.name}>{displayName}</p>;
};
export default ChatUser;
