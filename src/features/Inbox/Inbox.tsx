import classes from "./inbox.module.css";
import { InboxMessageData } from "./inbox.d";
import InboxMessage from "./InboxMessage";
import { ChatAction } from "../../reducers/chatReducer";

interface InboxProps {
  toggleInbox: () => void;
  inboxMessages: InboxMessageData[];
  dispatch: React.Dispatch<ChatAction>;
}
const Inbox = ({ toggleInbox, dispatch, inboxMessages }: InboxProps) => {
  console.log("Inbox messages: ", inboxMessages);
  return (
    <div className={classes.inbox} onClick={toggleInbox}>
      <h1>Inbox</h1>
      {inboxMessages &&
        inboxMessages.map((message) => (
          <InboxMessage
            message={message}
            dispatch={dispatch}
            key={message.id}
          />
        ))}
    </div>
  );
};

export default Inbox;
