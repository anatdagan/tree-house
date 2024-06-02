import { ChatRoom } from "../chatroom/types/Rooms";
import classes from "./inbox.module.css";
import { InboxMessageData } from "./inbox.d";
import InboxMessage from "./InboxMessage";

interface InboxProps {
  toggleInbox: () => void;
  inboxMessages: InboxMessageData[];
  setChatRoom: (chatRoom: ChatRoom) => void;
}
const Inbox = ({ toggleInbox, setChatRoom, inboxMessages }: InboxProps) => {
  console.log("Inbox messages: ", inboxMessages);
  return (
    <div className={classes.inbox} onClick={toggleInbox}>
      <h1>Inbox</h1>
      {inboxMessages &&
        inboxMessages.map((message) => (
          <InboxMessage
            message={message}
            setChatRoom={setChatRoom}
            key={message.id}
          />
        ))}
    </div>
  );
};

export default Inbox;
