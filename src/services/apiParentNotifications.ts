import { addDocToCollection } from "./db";
import { Kid } from "./apiKids";
import { Sentiment, sentimentManager } from "./apiSentimentAnalysis";

interface ParentNotification {
  subject: string;
  body: string;
  createdAt: Date;
  status: "read" | "unread";
}
const DEPRESSION_CHECK_INTERVAL = 1000 * 60; // 1 minute
export async function initParentNotifications(kid: Kid) {
  sentimentManager.getAverageScoreOverTime(
    DEPRESSION_CHECK_INTERVAL,
    Sentiment.DEPRESSED,
    (score) => notifyParentOnDepressedSentiment(kid, score)
  );
}

function notifyParentOnDepressedSentiment(kid: Kid, score: number) {
  // Check kid's sentiment
  // If sentiment is depressed, send notification to parent
  if (score < 0.5) {
    return;
  }
  console.log(score, "Depressed sentiment detected");
  const notification: ParentNotification = {
    subject: "Depressed sentiment detected",
    body: `Your kid, ${kid.displayName}, has been detected with a depressed sentiment.`,
    createdAt: new Date(),
    status: "unread",
  };
  sendParentNotification(kid.parentId, notification);
}
async function sendParentNotification(
  parentId: string,
  notification: ParentNotification
) {
  console.log("Sending parent notification: ", notification);
  addDocToCollection(`parents/${parentId}/inbox`, notification);
}
