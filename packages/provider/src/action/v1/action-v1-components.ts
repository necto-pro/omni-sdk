// Based on OpenAI Responses API swagger specification
// https://platform.openai.com/docs/api-reference/responses

// ============================================================================
// INPUT TYPES
// ============================================================================

export interface EasyInputMessage {
  role: 'user' | 'assistant' | 'system' | 'developer';
  content: string;
}

export interface InputMessage {
  role: 'user' | 'assistant' | 'system' | 'developer';
  content: InputMessageContent[];
}

export interface InputMessageContent {
  type: 'text' | 'image' | 'audio' | 'file';
  text?: string;
  imageUrl?: {
    url: string;
    detail?: 'low' | 'high' | 'auto';
  };
  audioUrl?: {
    url: string;
    format?: 'mp3' | 'wav' | 'flac' | 'aac' | 'ogg';
  };
  fileUrl?: {
    url: string;
    filename?: string;
  };
}

export interface ItemReferenceParam {
  type: 'item_reference';
  id: string;
}

export interface InputImageContent {
  type: 'image';
  imageUrl: {
    url: string;
    detail?: 'low' | 'high' | 'auto';
  };
}

export interface InputFileContent {
  type: 'file';
  fileUrl: {
    url: string;
    filename?: string;
  };
}

export interface OutputMessage {
  id: string;
  type: 'message';
  role: 'assistant';
  content: OutputMessageContent[];
  createdAt: number;
}

export interface OutputMessageContent {
  type: 'output_text' | 'output_image' | 'output_audio' | 'output_file';
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  fileUrl?: string;
  annotations?: Annotation[];
}

export interface Annotation {
  type: 'file_citation' | 'file_path' | 'web_search' | 'code_interpreter';
  text: string;
  fileCitation?: {
    fileId: string;
    quote: string;
  };
  filePath?: {
    fileId: string;
  };
  webSearch?: {
    searchQuery: string;
    searchResult: string;
  };
  codeInterpreter?: {
    input: string;
    outputs: CodeInterpreterOutput[];
  };
}

export interface CodeInterpreterOutput {
  type: 'logs' | 'image' | 'data';
  logs?: string;
  image?: {
    fileId: string;
  };
  data?: string;
}

export interface ReasoningItem {
  type: 'reasoning';
  id: string;
  summary?: string;
  details?: string;
}

export interface Item {
  type: 'message' | 'file_search_call' | 'function_call' | 'web_search_call' | 'computer_call' | 'reasoning';
  id?: string;
  // Additional properties based on type
  [key: string]: any;
}

// Union type for all possible input items
export type InputItem = EasyInputMessage | Item | ItemReferenceParam;

// ============================================================================
// OUTPUT TYPES
// ============================================================================

export interface OutputTextContent {
  type: 'output_text';
  text: string;
  annotations?: Annotation[];
}

export interface RefusalContent {
  type: 'refusal';
  text: string;
}

export interface FileSearchToolCall {
  type: 'file_search_call';
  id: string;
  fileSearch: {
    query: string;
    results: FileSearchResult[];
  };
}

export interface FileSearchResult {
  fileId: string;
  filename: string;
  score: number;
  content: string;
}

export interface FunctionToolCall {
  type: 'function_call';
  id: string;
  function: {
    name: string;
    arguments: string;
  };
}

export interface WebSearchToolCall {
  type: 'web_search_call';
  id: string;
  webSearch: {
    query: string;
    results: WebSearchResult[];
  };
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface ComputerToolCall {
  type: 'computer_call';
  id: string;
  computer: {
    action: string;
    result: string;
  };
}

// Union type for all possible output items
export type OutputItem = 
  | OutputMessage
  | FileSearchToolCall
  | FunctionToolCall
  | WebSearchToolCall
  | ComputerToolCall
  | ReasoningItem;

// ============================================================================
// TOOL TYPES
// ============================================================================

export interface FileSearchTool {
  type: 'file_search';
  vectorStoreIds: string[];
  maxNumResults?: number;
}

export interface FunctionTool {
  type: 'function';
  name: string;
  description?: string;
  parameters?: Record<string, any>;
}

export interface WebSearchPreviewTool {
  type: 'web_search_preview' | 'web_search_preview_2025_03_11';
  userLocation?: {
    type: 'approximate';
    city: string;
    region: string;
    country: string;
  };
  searchContextSize?: 'low' | 'medium' | 'high';
}

export interface ComputerUsePreviewTool {
  type: 'computer_use_preview';
  environment: 'windows' | 'mac' | 'linux' | 'ubuntu';
}

export type Tool = FileSearchTool | FunctionTool | WebSearchPreviewTool | ComputerUsePreviewTool;

// ============================================================================
// TOOL CHOICE TYPES
// ============================================================================

export interface ToolChoiceOptions {
  type: 'auto' | 'required' | 'none';
}

export interface NamedToolChoice {
  type: 'tool';
  tool: {
    type: 'function';
    name: string;
  };
}

export type ToolChoiceTypes = 'auto' | 'required' | 'none';
export type ToolChoiceFunction = NamedToolChoice;

// ============================================================================
// ERROR AND USAGE TYPES
// ============================================================================

export interface ResponseError {
  code: ResponseErrorCode;
  message: string;
}

export type ResponseErrorCode = 
  | 'invalid_request_error'
  | 'rate_limit_error'
  | 'internal_error'
  | 'insufficient_quota'
  | 'billing_hard_limit_reached'
  | 'billing_soft_limit_reached'
  | 'content_filter_error'
  | 'model_not_found'
  | 'permission_denied'
  | 'invalid_api_key'
  | 'invalid_organization'
  | 'invalid_parameters'
  | 'invalid_prompt'
  | 'invalid_model'
  | 'invalid_tools'
  | 'invalid_tool_choice'
  | 'invalid_response_format'
  | 'invalid_function_definition'
  | 'invalid_function_call'
  | 'invalid_parallel_tool_calls'
  | 'invalid_max_output_tokens'
  | 'invalid_temperature'
  | 'invalid_top_p'
  | 'invalid_stream'
  | 'invalid_instructions'
  | 'invalid_metadata'
  | 'invalid_user'
  | 'invalid_previous_response_id'
  | 'invalid_reasoning'
  | 'invalid_truncation'
  | 'invalid_include'
  | 'invalid_store'
  | 'invalid_parallel_tool_calls'
  | 'invalid_max_output_tokens'
  | 'invalid_temperature'
  | 'invalid_top_p'
  | 'invalid_stream'
  | 'invalid_instructions'
  | 'invalid_metadata'
  | 'invalid_user'
  | 'invalid_previous_response_id'
  | 'invalid_reasoning'
  | 'invalid_truncation'
  | 'invalid_include'
  | 'invalid_store';

export interface ResponseUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  inputTokensDetails?: {
    cachedTokens?: number;
    promptTokens?: number;
    completionTokens?: number;
  };
  outputTokensDetails?: {
    cachedTokens?: number;
    promptTokens?: number;
    completionTokens?: number;
  };
}

// ============================================================================
// SERVICE TIER
// ============================================================================

export type ServiceTier = 'free' | 'paid' | 'pro' | 'enterprise';

// ============================================================================
// REASONING
// ============================================================================

export interface Reasoning {
  effort?: 'auto' | 'high' | 'low';
  summary?: string;
}

// ============================================================================
// TEXT RESPONSE FORMAT
// ============================================================================

export interface TextResponseFormatConfiguration {
  type: 'text' | 'json_object';
  jsonSchema?: Record<string, any>;
}