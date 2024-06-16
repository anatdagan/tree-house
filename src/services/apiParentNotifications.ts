import { addDocToCollection } from "./db";
import { Kid } from "./apiKids";
import { Sentiment, sentimentManager } from "./apiSentimentAnalysis";

interface ParentNotification {
  subject: string;
  body: string;
  createdAt: Date;
  type: NotificationType;
  status: "read" | "unread";
}
enum NotificationType {
  DEPRESSED_SENTIMENT = "DEPRESSED_SENTIMENT",
}
const DEPRESSION_CHECK_INTERVAL = 1000 * 60; // 1 minute
const MAX_SESSION_NOTIFICATIONS = 1;
const sessionNotifacations = new Map<NotificationType, ParentNotification[]>();

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
  if (isNaN(score) || score < 0.5) {
    return;
  }
  console.log(score, "Depressed sentiment detected");
  const notification: ParentNotification = {
    subject: "Depressed sentiment detected",
    body: `Your kid, ${kid.displayName}, has been detected with a depressed sentiment.`,
    createdAt: new Date(),
    type: NotificationType.DEPRESSED_SENTIMENT,
    status: "unread",
  };
  sendParentNotification(kid.parentId, notification);
}
async function sendParentNotification(
  parentId: string,
  notification: ParentNotification
) {
  const notifications = sessionNotifacations.get(notification.type) || [];
  if (notifications.length > MAX_SESSION_NOTIFICATIONS) {
    return;
  }
  console.log("Sending parent notification: ", notification);
  sessionNotifacations.set(notification.type, [...notifications, notification]);
  addDocToCollection(`parents/${parentId}/inbox`, notification);
}
