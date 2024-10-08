import classes from "./chat.module.css";
import type { Message } from "./types/Messages";
import { extractTime } from "../../utils/date";
import { Kid, getKidInfoByUid } from "../../services/apiKids";
import { startPrivateChat } from "../../services/apiChatRooms";
import useUser from "@/hooks/useUser";
import { ChatRoom } from "../chatroom/types/Rooms";
import useMessages from "../../hooks/useMessages";
import useMessageContext from "@/hooks/useMessageContext";
import { app } from "../../../firebase";

async function onAvatarClick(
  uid: string,
  kid: Kid,
  switchRoom: (room: ChatRoom) => void
) {
  console.log("Avatar clicked", uid);
  const selectedKid = await getKidInfoByUid(app, uid);
  if (!selectedKid) {
    throw new Error("Kid not found");
    return;
  }
  console.log("Selected kid", selectedKid);
  const privateChatRoom = await startPrivateChat(kid, selectedKid);
  switchRoom(privateChatRoom);
}

const ChatMessages = () => {
  const { kidInfo, catchErrors, switchRoom, user } = useUser();
  const { messages } = useMessageContext();
  useMessages();
  const uid = user?.uid;
  if (!kidInfo) {
    return null;
  }

  return (
    <ul className={classes["messages-list"]}>
      {messages.map((message: Message) => (
        <li
          key={message.id}
          className={`${classes.message} ${
            message.uid === uid ? classes.current : classes.other
          } {message.to === uid ? classes.private : ""}`}
        >
          <time className={classes.time}>{extractTime(message.createdAt)}</time>

          <img
            className={classes.avatar}
            src={message?.avatar}
            alt={message?.avatar}
            onClick={() =>
              onAvatarClick(message.uid, kidInfo, switchRoom).catch((error) => {
                catchErrors(error);
              })
            }
          />
          <p className={classes.text}>{message.text}</p>
        </li>
      ))}
    </ul>
  );
};
export default ChatMessages;
