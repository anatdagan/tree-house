import classes from "./chat.module.css";
import type { Message } from "./types/Messages";
import { extractTime } from "../../utils/date";
import { Kid, getKidInfo } from "../../services/apiKids";
import { startPrivateChat } from "../../services/apiChatRooms";
import useChat from "../../hooks/useChat";
import { ChatRoom } from "../chatroom/types/Rooms";
import useMessages from "../../hooks/useMessages";

async function onAvatarClick(
  uid: string,
  kid: Kid,
  switchRoom: (room: ChatRoom) => void
) {
  console.log("Avatar clicked", uid);
  const selectedKid = await getKidInfo(uid);
  if (!selectedKid) {
    throw new Error("Kid not found");
    return;
  }
  console.log("Selected kid", selectedKid);
  const privateChatRoom = await startPrivateChat(kid, selectedKid);
  switchRoom(privateChatRoom);
}

const ChatMessages = () => {
  const { kidInfo, catchErrors, switchRoom, user, messages } = useChat();
  useMessages();
  const uid = user?.uid;
  if (!kidInfo) {
    return null;
  }

  return (
    <main className={classes["messages-chat"]} id="messages">
      <h2>Chat Messages</h2>
      <ul>
        {messages.map((message: Message) => (
          <li
            key={message.id}
            className={`${classes.message} ${
              message.uid === uid ? classes.current : classes.other
            } {message.to === uid ? classes.private : ""}`}
          >
            <time className={classes.time}>
              {extractTime(message.createdAt)}
            </time>

            <img
              src={message?.avatar}
              alt={message?.avatar}
              onClick={() =>
                onAvatarClick(message.uid, kidInfo, switchRoom).catch(
                  (error) => {
                    catchErrors(error);
                  }
                )
              }
            />
            <p className={classes.text}>{message.text}</p>
          </li>
        ))}
      </ul>
    </main>
  );
};
export default ChatMessages;
