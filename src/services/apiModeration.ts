import { DocumentReference } from "firebase/firestore";
import { addDocToCollection } from "./db";
import { Message, MessageStatus } from "../features/chat/types/Messages.d";
import { addMessage } from "./apiMessages";
import { Sentiment, sentimentManager } from "./apiSentimentAnalysis";

type ModerationCheck = (message: Message) => Promise<FlagReason | null>;

enum FlagReason {
  Offensive = "offensive",
  Inappropriate = "inappropriate",
  Illegal = "illegal",
}
const checks: ModerationCheck[] = [];

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
export function addModerationCheck(check: ModerationCheck) {
  checks.push(check);
}

export async function flagMessage(
  messageRef: DocumentReference,
  flagReasons: FlagReason[]
) {
  console.log(`Message flagged: ${messageRef.path} for reason:`, flagReasons);
  await addDocToCollection("flagged_messages", {
    messageRef,
    flagReasons,
  });
}

async function findSentimentViolations(message: Message) {
  const sentiment = await sentimentManager.analyzeMessage(message);
  console.log("Sentiment analysis result: ", sentiment);
  switch (sentiment.tone) {
    case Sentiment.AGGRESSIVE:
    case Sentiment.OFFENSIVE:
    case Sentiment.INAPPROPRIATE:
    case Sentiment.HATE_SPEECH:
      return FlagReason.Offensive;
    case Sentiment.SEXUAL:
      return FlagReason.Inappropriate;
    case Sentiment.ILLEGAL_RESPONSE:
      return FlagReason.Illegal;
    default:
      return null;
  }
}
addModerationCheck(findSentimentViolations);
export async function findViolations(message: Message) {
  try {
    const validations = checks.map(
      async (findViolation) => await findViolation(message)
    );
    const flagReasons = (await Promise.all(validations)).filter(notEmpty);
    if (flagReasons.length === 0) {
      return null;
    }
    const flaggedMessage = { ...message, status: MessageStatus.Flagged };
    const messageRef = await addMessage(flaggedMessage);
    await flagMessage(messageRef, flagReasons);
    return messageRef;
  } catch (error) {
    throw new Error(`Error moderating message  ${error}`);
  }
}
