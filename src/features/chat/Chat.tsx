import { ReactNode } from "react";
import classes from "./chat.module.css";
import useChat from "../../hooks/useChat";
import LoadingIndicator from "../../ui/LoadingIndicator";
import Login from "../authentication/Login";
import ErrorMessage from "../../ui/ErrorMessage";
import { ChatRoom } from "../chatroom/types/Rooms";

import {
  registerSentimentCheck,
  Sentiment,
} from "@/services/apiSentimentAnalysis";
import { getRandomCounselor } from "@/services/chatbots/apiCounselors";
interface Props {
  children?: ReactNode;
}
const Chat = ({ children }: Props) => {
  const { isLoading, user, selectedChatRoom, setActiveCounselorId } = useChat();
  if (!selectedChatRoom) {
    return null;
  }
  function listenToBoredom(selectedChatRoom: ChatRoom) {
    const BOREDOM_INTERVAL = 1000 * 60; // 1 minute

    console.log("Listening to boredom");
    registerSentimentCheck(
      Sentiment.BORED,
      BOREDOM_INTERVAL,
      async (score: number) => {
        console.log("Average boredom score", score);
        if (score > 0.5) {
          console.log("Boredom detected");
          const counselor = await getRandomCounselor();
          setActiveCounselorId(counselor?.id);
          counselor?.respond("I am bored", selectedChatRoom?.id);
        }
      }
    );
  }

  listenToBoredom(selectedChatRoom);
  if (isLoading) return <LoadingIndicator />;
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
