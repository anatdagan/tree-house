import { useState } from "react";
import Inbox from "./Inbox";
import { InboxMessageData } from "./inbox.d";
import { getInboxMessages } from "../../services/apiInbox";
import Modal from "../../ui/Modal/Modal";

interface Props {
  email: string;
}
const InboxIcon = ({ email }: Props) => {
  const [inboxOpen, setInboxOpen] = useState(false);
  const [inboxMessages, setInboxMessages] = useState<InboxMessageData[]>([]);

  const toggleInbox = async () => {
    if (!inboxOpen) {
      setInboxMessages((await getInboxMessages(email)) as InboxMessageData[]);
    }
    setInboxOpen(!inboxOpen);
  };

  return (
    <>
      <a href="#inbox" onClick={toggleInbox}>
        <svg
          role="img"
          aria-label="[title + description]"
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-inbox"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M4 13h3l3 3h4l3 -3h3" />
          <title>Inbox</title>
          <desc>Icon for opening the inbox</desc>
        </svg>
      </a>
      {/* use context api*/}
      {inboxOpen && (
        <Modal>
          <Inbox toggleInbox={toggleInbox} inboxMessages={inboxMessages} />
        </Modal>
      )}
    </>
  );
};

export default InboxIcon;
