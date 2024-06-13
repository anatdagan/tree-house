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
  setInterval(() => {
    notifyParnetOnDepressedSentiment(kid);
  }, DEPRESSION_CHECK_INTERVAL);
}

function notifyParnetOnDepressedSentiment(kid: Kid) {
  // Check kid's sentiment
  // If sentiment is depressed, send notification to parent
  if (sentimentManager.getSentimentScore(Sentiment.DEPRESSED) < 0.5) {
    return;
  }
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
