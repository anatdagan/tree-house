import classes from "./inbox.module.css";
import { InboxMessageData } from "./inbox.d";
import InboxMessage from "./InboxMessage";

interface InboxProps {
  toggleInbox: () => void;
  inboxMessages: InboxMessageData[];
}
const Inbox = ({ toggleInbox, inboxMessages }: InboxProps) => {
  console.log("Inbox messages: ", inboxMessages);
  return (
    <div className={classes.inbox} onClick={toggleInbox}>
      <h1>Inbox</h1>
      {inboxMessages &&
        inboxMessages.map((message) => (
          <InboxMessage message={message} key={message.id} />
        ))}
    </div>
  );
};

export default Inbox;
