import { InputItem, Tool, ToolChoiceOptions, ToolChoiceTypes, ToolChoiceFunction, Reasoning, TextResponseFormatConfiguration } from './action-v1-components';

export interface ActionV1Request {
  model: string;

  /**
   * The core input for the model. Can be a simple string or an array
   * of different modalities for multi-modal input.
   */
  input: string | InputItem[];

  /**
   * Optional instructions for the action, separate from the main input.
   */
  instructions?: string;

  /**
   * Whether to stream the response.
   */
  stream?: boolean;

  /**
   * A flexible object to contain any other action-specific parameters
   * that are not part of the core input modalities.
   * e.g., { n: 4, size: '1024x1024' } for image generation.
   */
  parameters?: Record<string, any>;

  /**
   * Provider-specific settings that are passed directly to the provider's API.
   */
  providerOptions?: Record<string, any>;

  tools?: Tool[];
  toolChoice?: ToolChoiceOptions | ToolChoiceTypes | ToolChoiceFunction;
  
  // Additional OpenAI-specific fields
  reasoning?: Reasoning;
  maxOutputTokens?: number;
  text?: {
    format: TextResponseFormatConfiguration;
  };
  parallelToolCalls?: boolean;
  store?: boolean;
  previousResponseId?: string;
  truncation?: 'auto' | 'disabled';
  temperature?: number;
  topP?: number;
  
  metadata?: any;
  user?: string;
}
