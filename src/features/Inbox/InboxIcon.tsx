import Modal from "../../ui/Modal/Modal";
import { useState } from "react";
import Inbox from "./Inbox";
import { InboxMessageData } from "./inbox.d";
import { getInboxMessages } from "../../services/apiInbox";

interface Props {
  email: string;
}
const InboxIcon = ({ email }: Props) => {
  const [inboxOpen, setInboxOpen] = useState(false);
  const [inboxMessages, setInboxMessages] = useState<InboxMessageData[]>([]);

  const toggleInbox = async () => {
    setInboxMessages((await getInboxMessages(email)) as InboxMessageData[]);
    setInboxOpen(!inboxOpen);
  };
  return (
    <>
      <svg
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
        onClick={toggleInbox}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M4 13h3l3 3h4l3 -3h3" />
      </svg>
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
