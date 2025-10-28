import { OutputItem, ResponseError, ResponseUsage, Tool, ToolChoiceOptions, ToolChoiceTypes, ToolChoiceFunction, Reasoning, TextResponseFormatConfiguration } from './action-v1-components';

export interface ActionV1Response {
  id: string;
  object: 'response';
  createdAt: number;
  status: 'completed' | 'failed' | 'in_progress' | 'incomplete';
  error: ResponseError | null;
  incompleteDetails: {
    reason: 'max_output_tokens' | 'content_filter';
  } | null;
  output: OutputItem[];
  outputText?: string;
  usage: ResponseUsage;
  parallelToolCalls: boolean;
  previousResponseId: string | null;
  store: boolean;
  temperature: number;
  toolChoice: ToolChoiceOptions | ToolChoiceTypes | ToolChoiceFunction;
  tools: Tool[];
  topP: number;
  truncation: 'disabled' | 'auto' | null;
  user: string | null;
  metadata: any;
  model: string;
  instructions: string | null;
  maxOutputTokens: number | null;
  
  // Additional OpenAI-specific fields
  reasoning: Reasoning | null;
  text: {
    format: TextResponseFormatConfiguration;
  };
}
