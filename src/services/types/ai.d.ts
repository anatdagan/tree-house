export interface SystemInstructionsParts {
  persona?: string;
  objective?: string;
  context?: string;
  instructions?: string[];
  constraints?: string[];
  format?: string;
  summary?: string;
}
