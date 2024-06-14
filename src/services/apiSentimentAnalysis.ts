import { generateModel, sendMessageStream, getChatWithAi } from "./apiAI";
import { ChatSession, POSSIBLE_ROLES } from "firebase/vertexai-preview";
import type { Message } from "../features/chat/types/Messages";
import EventEmitter from "./apiEvents";
import { Callback } from "../types/common";
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
  DEFAULT = "default",
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
const SENTIMENT_ANALYSIS_CHAT_PARAMS = {
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
        text: `The message begins with the name of the speaker followed by ":".`,
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

class SentimentAggreagator {
  name: Sentiment;
  score: number;
  constructor(sentiment: Sentiment) {
    this.name = sentiment || Sentiment.DEFAULT;
    this.score = 0;
  }
  addScore(score: number) {
    this.score += score;
  }
  resetScore() {
    this.score = 0;
  }
  getScore() {
    return this.score;
  }
}

class SentimentManager {
  sentiments: { [key: string]: SentimentAggreagator };
  chat: ChatSession;
  eventEmitter: EventEmitter<MessageSentiment>;
  messageCounter: number;
  constructor() {
    this.sentiments = {};
    this.eventEmitter = new EventEmitter();
    const model = generateModel(SENTIMENT_ANALYSIS_CONFIG);
    this.chat = getChatWithAi(model, SENTIMENT_ANALYSIS_CHAT_PARAMS);
    this.messageCounter = 0;
  }
  addSentiment(sentiment: Sentiment) {
    if (!this.sentiments[sentiment]) {
      this.sentiments[sentiment] = new SentimentAggreagator(sentiment);
    }
  }
  getSentiment(sentiment: Sentiment) {
    return this.sentiments[sentiment];
  }
  getSentimentScore(sentiment: Sentiment) {
    const sentimentAggregator = this.sentiments[sentiment];
    if (!sentimentAggregator) {
      return 0;
    }
    return sentimentAggregator.getScore();
  }
  resetSentimentScore(sentiment: Sentiment) {
    this.sentiments[sentiment].resetScore();
  }
  private static repeat(interval: number, callback: Callback<void>) {
    setInterval(() => {
      callback();
    }, interval);
  }

  getAverageScoreOverTime(
    interval: number,
    sentiment: Sentiment,
    callback: Callback<number>
  ) {
    let startCount = 0;
    let startScore = 0;
    SentimentManager.repeat(interval, () => {
      const score = this.getSentimentScore(sentiment) - startScore;
      const count = this.messageCounter - startCount;
      callback(score / count);
      startScore = this.getSentimentScore(sentiment);
      startCount = this.messageCounter;
    });
  }
  async analyzeMessage(message: Message) {
    let sentiment = { tone: Sentiment.DEFAULT, score: 100 };
    const { text, uid } = message;
    try {
      const apiResponse = await sendMessageStream(`${uid}:${text}`, this.chat);
      const toneParts = apiResponse.match(/tone:(.*);score:(.*)/);
      let tone: Sentiment;
      if (toneParts && toneParts.length === 3) {
        tone = formatSentiment(toneParts[1]);
        sentiment = {
          tone,
          score: Number(toneParts[2]),
        };
      } else {
        sentiment = { tone: Sentiment.ILLEGAL_RESPONSE, score: 100 };
      }
      if (this.sentiments[sentiment.tone] === undefined) {
        this.addSentiment(sentiment.tone);
      }
      this.sentiments[sentiment.tone].addScore(sentiment.score);
      this.messageCounter++;
      return sentiment;
    } catch (error) {
      console.log("Error in sentiment analysis: ", error);
      return { tone: Sentiment.ILLEGAL_RESPONSE, score: 100 };
    }
  }
}

export const sentimentManager = new SentimentManager();
