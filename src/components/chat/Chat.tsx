import { ReactNode } from "react";
import classes from "./chat.module.css";
import useUser from "@/hooks/useUser";
import Login from "../authentication/Login";
import ErrorMessage from "../../ui/ErrorMessage";
import { ChatRoom } from "../chatroom/types/Rooms";

import {
  registerSentimentCheck,
  Sentiment,
} from "@/services/apiSentimentAnalysis";
import { getRandomCounselor } from "@/services/chatbots/apiCounselors";
import { Kid } from "@/services/apiKids";
import { listenToInboxMessages } from "@/services/apiInbox";
interface Props {
  children?: ReactNode;
}
const Chat = ({ children }: Props) => {
  const {
    user,
    selectedChatRoom,
    setActiveCounselorId,
    kidInfo,
    setInboxMessages,
  } = useUser();

  function listenToBoredom(selectedChatRoom: ChatRoom, kidInfo: Kid) {
    const BOREDOM_INTERVAL = 1000 * 60; // 1 minute

    console.log("Listening to boredom");
    registerSentimentCheck(
      kidInfo,
      Sentiment.BORED,
      BOREDOM_INTERVAL,
      (score: number) => {
        console.log("Average boredom score", score);
        if (score > 0.5) {
          console.log("Boredom detected");
          const counselor = getRandomCounselor();
          setActiveCounselorId(counselor?.id || null);
          counselor?.onKidMessage("I am bored", selectedChatRoom?.id);
        }
      }
    );
  }
  if (selectedChatRoom && kidInfo) {
    listenToBoredom(selectedChatRoom, kidInfo);
    listenToInboxMessages(kidInfo.email, (message) => {
      setInboxMessages([message]);
    });
  }

  return (
    <>
      {user ? (
        <article data-testid="chat" className={classes.chat}>
          {children}
        </article>
      ) : (
        <Login data-testid="login" />
      )}
      <ErrorMessage />
    </>
  );
};
export default Chat;
