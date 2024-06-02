import { DocumentReference } from "firebase/firestore";
import { addDocToCollection } from "./db";
import { Message, MessageStatus } from "../features/chat/types/Messages.d";
import { addMessage } from "./apiMessages";

type ModerationCheck = (message: Message) => Promise<FlagReason | null>;

enum FlagReason {
  Offensive = "offensive",
  Inappropriate = "inappropriate",
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

async function findSleepyViolations(message: Message) {
  return await new Promise<FlagReason | null>((resolve) => {
    if (message.text.includes("💤")) {
      resolve(FlagReason.Inappropriate);
    } else {
      resolve(null);
    }
  });
}
addModerationCheck(findSleepyViolations);
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
