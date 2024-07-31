import {
  StartChatParams,
  GenerationConfig,
  GenerativeModel,
  getGenerativeModel,
  ChatSession,
  POSSIBLE_ROLES,
  Content,
} from "firebase/vertexai-preview";
import { vertexAI } from "../../firebase";
import { SystemInstructionsParts as SystemInstructionsSections } from "./types/ai";

export async function getResponseFromAi(
  prompt: string,
  model: GenerativeModel
) {
  const { totalTokens } = await model.countTokens(prompt);
  if (totalTokens > 200) {
    throw new Error("Prompt is too long");
  }
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

export function generateModel(generationConfig: GenerationConfig) {
  // Initialize the generative model with a model that supports your use case
  // Gemini 1.5 models are versatile and can be used with all API capabilities
  return getGenerativeModel(vertexAI, {
    model: "gemini-1.5-flash",
    generationConfig,
  });
}

export function getChatWithAi(
  model: GenerativeModel,
  startChatParams: StartChatParams
) {
  return model.startChat(startChatParams);
}

export async function sendMessageStream(msg: string, chat: ChatSession) {
  const result = await chat.sendMessageStream(msg);
  let text = "";
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    text += chunkText;
  }
  return text;
}

class SystemInstructionsGenerator {
  private instructions: { text: string }[] = [];
  constructor({ ...instructionParts }: SystemInstructionsSections) {
    this.addInstruction(instructionParts.persona);
    this.addInstruction(instructionParts.objective);
    instructionParts.instructions?.forEach((instruction) => {
      this.addInstruction(instruction);
    });
    instructionParts.constraints?.forEach((constraint) => {
      this.addInstruction(constraint);
    });
    this.addInstruction(instructionParts.format);
    this.addInstruction(instructionParts.summary);
  }
  addInstruction(instruction: string | undefined) {
    if (!instruction) {
      return;
    }
    this.instructions.push({ text: instruction });
  }
  getInstructions() {
    return { role: POSSIBLE_ROLES[2], parts: this.instructions };
  }
}
export function generateSystemInstructions(
  instructionParts: SystemInstructionsSections
) {
  return new SystemInstructionsGenerator(instructionParts).getInstructions();
}

/**
 * convert text to model history
 * @param texts
 * @returns
 */
export function convertTextsToHistory<
  S extends string | null,
  T extends string | null
>(texts: [S, T]): Content[] {
  const history = [];
  if (texts[0]) {
    history.push({
      role: POSSIBLE_ROLES[0],
      parts: [{ text: texts[0] }],
    });
  }
  if (texts[1]) {
    history.push({
      role: POSSIBLE_ROLES[1],
      parts: [{ text: texts[1] }],
    });
  }
  return history;
}
