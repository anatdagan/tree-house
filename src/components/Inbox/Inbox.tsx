import classes from "./inbox.module.css";
import { InboxMessageData } from "./inbox.d";
import InboxMessage from "./InboxMessage";
import { useEffect } from "react";
import React from "react";

interface InboxProps {
  toggleInbox: () => void;
  inboxMessages: InboxMessageData[];
}

let blurTimer: ReturnType<typeof setTimeout> | null = null;

const Inbox = ({ toggleInbox, inboxMessages }: InboxProps) => {
  const ref = React.createRef<HTMLHeadingElement>();
  useEffect(() => {
    ref?.current?.focus();
  }, [ref]);
  const handleBlur = () => {
    blurTimer = setTimeout(() => {
      toggleInbox();
    }, 0);
  };
  const handleFocus = () => {
    if (blurTimer) {
      clearTimeout(blurTimer);
    }
  };
  return (
    <div
      className={classes.inbox}
      onClick={toggleInbox}
      tabIndex={0}
      onBlur={handleBlur}
      onFocus={handleFocus}
    >
      <h1 ref={ref} tabIndex={-1}>
        Incoming Messages
      </h1>
      {inboxMessages.length ? (
        inboxMessages.map((message) => (
          <InboxMessage message={message} key={message.id} />
        ))
      ) : (
        <section className={classes.emptyInbox}>
          <span className={classes.emptyInboxIcon}>📭</span>
          <span className={classes.emptyInboxText}>No messages yet</span>
        </section>
      )}
    </div>
  );
};
export default Inbox;
