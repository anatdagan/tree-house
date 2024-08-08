import { addDocToCollection } from "./db";
import { Kid, getKidParent } from "./apiKids";
import { registerSentimentCheck, Sentiment } from "./apiSentimentAnalysis";

interface ParentNotification {
  subject: string;
  body: string;
  createdAt: Date;
  type: NotificationType;
  status: "read" | "unread";
}
enum NotificationType {
  DEPRESSED_SENTIMENT = "DEPRESSED_SENTIMENT",
  MEETING_REQUEST = "MEETING_REQUEST",
}
const DEPRESSION_CHECK_INTERVAL = 1000 * 60; // 1 minute
const MAX_SESSION_NOTIFICATIONS = 1;
const sessionNotifacations = new Map<NotificationType, ParentNotification[]>();

export async function initParentNotifications(kid: Kid) {
  registerSentimentCheck(
    kid,
    Sentiment.DEPRESSED,
    DEPRESSION_CHECK_INTERVAL,
    (score) => {
      notifyParentOnDepressedSentiment(kid, score);
    }
  );
}

function notifyParentOnDepressedSentiment(kid: Kid, score: number) {
  // Check kid's sentiment
  // If sentiment is depressed, send notification to parent
  if (isNaN(score) || score < 0.5) {
    return;
  }
  const notification: ParentNotification = {
    subject: "Depressed sentiment detected",
    body: `Your kid, ${kid.displayName}, has been detected with a depressed sentiment.`,
    createdAt: new Date(),
    type: NotificationType.DEPRESSED_SENTIMENT,
    status: "unread",
  };
  sendParentNotification(kid.parentId, notification);
}
export async function notifyParentOnMeetingRequest(
  yourKid: Kid,
  friend: Kid | null
) {
  const yourKidName = yourKid.displayName;
  let messageBody;
  if (friend) {
    const friendName = friend.displayName;
    const friendParent = await getKidParent(friend);
    if (!friendParent) {
      return;
    }
    messageBody = `${yourKidName} has requested to meet with ${friendName}.
     You can contact ${friendName}'s parent to schedule a meeting.
     The parent's email is ${friendParent.email}.`;
  } else {
    messageBody = `${yourKidName} has requested to meet with a friend.
     We are unable to find the friend's information, you can contact customer service and we will try to find the friend's information manually.`;
  }

  const notification: ParentNotification = {
    subject: "Meeting request",
    body: messageBody,
    createdAt: new Date(),
    type: NotificationType.MEETING_REQUEST,
    status: "unread",
  };
  sendParentNotification(yourKid.parentId, notification);
}
async function sendParentNotification(
  parentId: string,
  notification: ParentNotification
) {
  const notifications = sessionNotifacations.get(notification.type) || [];
  if (notifications.length > MAX_SESSION_NOTIFICATIONS) {
    return;
  }
  sessionNotifacations.set(notification.type, [...notifications, notification]);
  addDocToCollection(`parents/${parentId}/inbox`, notification);
}
