import {
  ChatSession,
  Content,
  GenerationConfig,
} from "firebase/vertexai-preview";

export interface ChatBot {
  id: string;
  name: string;
  age: number;
  avatar: string;
  history: Content[];
  chat: ChatSession | null;
  generationConfig: GenerationConfig;
  systemInstructions: SystemInstructionsParts;
  respond: (message: string, roomId: string) => Promise<void>;
}

export interface ChatBotData {
  name: string;
  age: number;
  avatar: string;
  welcomeMessages: WelcomeMessage[];
  temperature: number;
  topP: number;
  topK: number;
  persona: string;
  objective: string;
  instructions: string[];
  constraints: string[];
  format: string;
  summary: string;
}

export interface HistoryExchange {
  kidUid: string;
  chatbotId: string;
  kidText: string;
  botText: string;
}
