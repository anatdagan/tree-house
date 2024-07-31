import {
  generateModel,
  sendMessageStream,
  getChatWithAi,
  convertTextsToHistory,
} from "./apiAI";
import { POSSIBLE_ROLES, StartChatParams } from "firebase/vertexai-preview";
import type { Message } from "@/components/chat/types/Messages.d";
import { Callback } from "@/types/common.d";
import { vertexAI } from "../../firebase";

export const SENTIMENT_HISYORY_LENGTH = 5;
export enum Sentiment {
  FRIENDLY = "friendly",
  DEPRESSED = "depressed",
  IRRITATED = "irritated",
  ANGRY = "angry",
  BORED = "bored",
  SEXUAL = "sexual",
  AGGRESSIVE = "aggressive",
  OFFENSIVE = "offensive",
  HATE_SPEECH = "hate_speech",
  INAPPROPRIATE = "inappropriate",
  ILLEGAL_RESPONSE = "illegal_response",
  NEUTRAL = "neutral",
  DEFAULT = "none of the above",
}

export interface MessageSentiment {
  tone: Sentiment;
  score: number;
}

const SENTIMENT_ANALYSIS_CONFIG = {
  maxOutputTokens: 100,
  temperature: 0,
  topP: 0.2,
  topK: 1,
};
// TODO: find a way to pass other users' messages to the sentiment analysis chat for context
const SENTIMENT_ANALYSIS_CHAT_PARAMS: StartChatParams = {
  history: [
    {
      role: POSSIBLE_ROLES[0],
      parts: [{ text: "a: Hi everybody! Nice day isn't it?" }],
    },
    {
      role: POSSIBLE_ROLES[1],
      parts: [{ text: "tone:friendly;score:4" }],
    },
    {
      role: POSSIBLE_ROLES[0],
      parts: [{ text: "b: no, not really" }],
    },
    {
      role: POSSIBLE_ROLES[1],
      parts: [{ text: "tone:depressed;score:1" }],
    },
    {
      role: POSSIBLE_ROLES[0],
      parts: [{ text: "a: why?" }],
    },
    {
      role: POSSIBLE_ROLES[1],
      parts: [{ text: "tone:neutral;score:3" }],
    },
    {
      role: POSSIBLE_ROLES[0],
      parts: [{ text: "b: My parents really get on my nerves!" }],
    },
    {
      role: POSSIBLE_ROLES[1],
      parts: [{ text: "tone:angry;score:4" }],
    },
    {
      role: POSSIBLE_ROLES[0],
      parts: [{ text: "c: Look! A bird!" }],
    },
    {
      role: POSSIBLE_ROLES[1],
      parts: [{ text: "tone:non of the above;score:1" }],
    },
    {
      role: POSSIBLE_ROLES[0],
      parts: [{ text: "d: there is no one to talk to here" }],
    },
    {
      role: POSSIBLE_ROLES[1],
      parts: [{ text: "tone:bored;score:2" }],
    },
    {
      role: POSSIBLE_ROLES[0],
      parts: [{ text: "d: and nothing to do" }],
    },
    {
      role: POSSIBLE_ROLES[1],
      parts: [{ text: "tone:bored;score:3" }],
    },
    {
      role: POSSIBLE_ROLES[0],
      parts: [{ text: "e: I'm number one!" }],
    },
    {
      role: POSSIBLE_ROLES[1],
      parts: [{ text: "tone:none of the above;score:4" }],
    },
  ],
  systemInstruction: {
    role: POSSIBLE_ROLES[2],
    parts: [
      { text: `You are a chat moderator for a children's chat app.` },
      {
        text: `Your task is to analyze the tone of the messages posted by the children.`,
      },
      { text: `To complete the task, you need to follow these steps:` },
      {
        text: `1. Analyze the tone of the message according to the list of predefined tones of speeach.`,
      },
      { text: `2. Evaluate how sure you are about the tone from 1 to 5.` },
      { text: `3. Respond with the tone and the score.` },
      {
        text: `The tone can be only one of the following: friendly, depressed, irritated, bored, sexual, angry, aggressive, offensive, hate speech, neutral, non of the above.`,
      },
      {
        text: `Please use for every message the 5 massages that preceed it in order to understand the context of the message in the conversation.`,
      },
      {
        text: `The output must be in the following format: "tone:(a tone from the list above);score:(the score)"`,
      },
      {
        text: `you need to analyze the tone of the message in the context of the conversation and respond in the format: "tone:(the detected emotion from the predefined list);score:(a number between 1 and 5)`,
      },
      {
        text: `Do not use other tones than the predefined ones. It is OK if you are not sure about the tone, in this case you can use the "non of the above" tone or return a low score.`,
      },
    ],
  },
};

function formatSentiment(str: string): Sentiment {
  switch (str.toLowerCase()) {
    case "friendly":
      return Sentiment.FRIENDLY;
    case "depressed":
      return Sentiment.DEPRESSED;
    case "irritated":
      return Sentiment.IRRITATED;
    case "angry":
      return Sentiment.ANGRY;
    case "bored":
      return Sentiment.BORED;
    case "sexual":
      return Sentiment.SEXUAL;
    case "aggressive":
      return Sentiment.AGGRESSIVE;
    case "offensive":
      return Sentiment.OFFENSIVE;
    case "hatespeech":
      return Sentiment.HATE_SPEECH;
    case "inappropriate":
      return Sentiment.INAPPROPRIATE;
    case "neutral":
      return Sentiment.NEUTRAL;
    case "non of the above":
      return Sentiment.DEFAULT;
    default:
      return Sentiment.ILLEGAL_RESPONSE;
  }
}

async function getSentimentAnalyzer(lastMessages: Message[]) {
  const model = generateModel(SENTIMENT_ANALYSIS_CONFIG);
  const userHistory = lastMessages?.map((message) => {
    const messageSentiment = message.sentiment || null;
    return convertTextsToHistory([
      message.text,
      `tone:${messageSentiment?.tone};score:${messageSentiment?.score}`,
    ]);
  });
  if (userHistory) {
    SENTIMENT_ANALYSIS_CHAT_PARAMS.history?.push(...userHistory.flat());
  }
  return getChatWithAi(model, SENTIMENT_ANALYSIS_CHAT_PARAMS);
}
const defaultSentiment = { tone: Sentiment.DEFAULT, score: 100 };
const illegalResponse = { tone: Sentiment.ILLEGAL_RESPONSE, score: 100 };

/**
 * extract sentiment from a message
 * @param genAI
 * @param lastMessages
 * @param message
 * @returns
 */
export async function analyzeMessage(
  lastMessages: Message[],
  message: Message
) {
  if (!vertexAI) {
    throw new Error("AI not initialized");
  }
  const { text } = message;

  try {
    const analyzer = await getSentimentAnalyzer(lastMessages);
    const apiResponse = (await sendMessageStream(`${text}`, analyzer)) ?? "";
    console.log("Sentiment analysis response: ", apiResponse);
    if (apiResponse === "illegal_response") {
      return illegalResponse;
    }
    const sentimentParts = apiResponse.match(/tone:(.*);score:(.*)/);
    const tone = sentimentParts?.[1];
    const score = sentimentParts?.[2];
    return {
      tone: tone ? formatSentiment(tone) : defaultSentiment.tone,
      score: score ? parseFloat(score) : defaultSentiment.score,
    };
  } catch (error) {
    console.log("Error in sentiment analysis: ", error);
    return defaultSentiment;
  }
}
interface SentimentCheck {
  duration: number;
  callback: Callback<number>;
}
const sentimentChecks = new Map<Sentiment, SentimentCheck>();
export function getSentimentChecks(sentiment: Sentiment) {
  return sentimentChecks.get(sentiment);
}
export function registerSentimentCheck(
  sentiment: Sentiment,
  duration: number,
  callback: Callback<number>
) {
  sentimentChecks.set(sentiment, { duration, callback });
}

export function getLastMessages(messages: Message[], duration: number) {
  const startCheck = Date.now() - duration;
  return messages.filter((msg) => {
    const msgCreatedAt = msg.createdAt.toDate().valueOf();
    return msgCreatedAt > startCheck;
  });
}
export function applySentimentCallbacks(tone: Sentiment, messages: Message[]) {
  if (!tone) {
    return;
  }
  const sentimentCheck = getSentimentChecks(tone);
  if (!sentimentCheck) {
    return;
  }

  const { duration, callback } = sentimentCheck;
  const lastMessages = getLastMessages(messages, duration);
  if (lastMessages.length === 0) {
    return;
  }
  const totalScore = lastMessages.reduce((acc, msg) => {
    return acc + (msg.sentiment?.score || 0);
  }, 0);
  setTimeout(() => {
    callback(totalScore / lastMessages.length);
  }, 0);
}
