
export interface CreateResponse {
  model: string;
  input: string | InputItem[];
  include?: Includable[];
  parallel_tool_calls?: boolean;
  store?: boolean;
  stream?: boolean;
  previous_response_id?: string;
  reasoning?: Reasoning;
  max_output_tokens?: number;
  instructions?: string;
  text?: {
    format: TextResponseFormatConfiguration;
  };
  tools?: Tool[];
  tool_choice?: ToolChoiceOptions | ToolChoiceTypes | ToolChoiceFunction;
  truncation?: 'auto' | 'disabled';
  metadata?: any;
  temperature?: number;
  top_p?: number;
  user?: string;
  service_tier?: ServiceTier;
}

export interface Response {
  id: string;
  object: 'response';
  created_at: number;
  status: 'completed' | 'failed' | 'in_progress' | 'incomplete';
  error: ResponseError | null;
  incomplete_details: {
    reason: 'max_output_tokens' | 'content_filter';
  } | null;
  output: OutputItem[];
  output_text?: string;
  usage: ResponseUsage;
  parallel_tool_calls: boolean;
  previous_response_id: string | null;
  reasoning: Reasoning | null;
  store: boolean;
  temperature: number;
  text: {
    format: TextResponseFormatConfiguration;
  };
  tool_choice: ToolChoiceOptions | ToolChoiceTypes | ToolChoiceFunction;
  tools: Tool[];
  top_p: number;
  truncation: 'disabled' | 'auto' | null;
  user: string | null;
  metadata: any;
  model: string;
  instructions: string | null;
  max_output_tokens: number | null;
}

export type InputItem = EasyInputMessage | Item | ItemReferenceParam;

export type Includable =
  | 'file_search_call.results'
  | 'message.input_image.image_url'
  | 'computer_call_output.output.image_url';

export interface Reasoning {
  effort?: 'auto' | 'high' | 'low';
  summary?: string;
}

export interface TextResponseFormatConfiguration {
  type: 'text' | 'json_object';
  json_schema?: any;
}

export type Tool = any;
export type ToolChoiceOptions = any;
export type ToolChoiceTypes = any;
export type ToolChoiceFunction = any;
export type ServiceTier = any;
export type EasyInputMessage = any;
export type Item = any;
export type ItemReferenceParam = any;
export type ResponseError = any;
export type OutputItem = any;
export type ResponseUsage = any;

export type ResponseStreamEvent =
  | ResponseAudioDeltaEvent
  | ResponseAudioDoneEvent
  | ResponseAudioTranscriptDeltaEvent
  | ResponseAudioTranscriptDoneEvent
  | ResponseCodeInterpreterCallCodeDeltaEvent
  | ResponseCodeInterpreterCallCodeDoneEvent
  | ResponseCodeInterpreterCallCompletedEvent
  | ResponseCodeInterpreterCallInProgressEvent
  | ResponseCodeInterpreterCallInterpretingEvent
  | ResponseCompletedEvent
  | ResponseContentPartAddedEvent
  | ResponseContentPartDoneEvent
  | ResponseCreatedEvent
  | ResponseErrorEvent
  | ResponseFileSearchCallCompletedEvent
  | ResponseFileSearchCallInProgressEvent
  | ResponseFileSearchCallSearchingEvent
  | ResponseFunctionCallArgumentsDeltaEvent
  | ResponseFunctionCallArgumentsDoneEvent
  | ResponseInProgressEvent
  | ResponseFailedEvent
  | ResponseIncompleteEvent
  | ResponseOutputItemAddedEvent
  | ResponseOutputItemDoneEvent
  | ResponseReasoningSummaryPartAddedEvent
  | ResponseReasoningSummaryPartDoneEvent
  | ResponseReasoningSummaryTextDeltaEvent
  | ResponseReasoningSummaryTextDoneEvent
  | ResponseRefusalDeltaEvent
  | ResponseRefusalDoneEvent
  | ResponseTextAnnotationDeltaEvent
  | ResponseTextDeltaEvent
  | ResponseTextDoneEvent
  | ResponseWebSearchCallCompletedEvent
  | ResponseWebSearchCallInProgressEvent
  | ResponseWebSearchCallSearchingEvent;

export interface ResponseAudioDeltaEvent {
  type: 'response.audio.delta';
  item_id: string;
  output_index: number;
  delta: string;
}

export interface ResponseAudioDoneEvent {
  type: 'response.audio.done';
  item_id: string;
  output_index: number;
  audio: {
    format: string;
    data: string;
  };
}

export interface ResponseAudioTranscriptDeltaEvent {
  type: 'response.audio_transcript.delta';
  item_id: string;
  output_index: number;
  delta: string;
}

export interface ResponseAudioTranscriptDoneEvent {
  type: 'response.audio_transcript.done';
  item_id: string;
  output_index: number;
  transcript: string;
}

export interface ResponseCodeInterpreterCallCodeDeltaEvent {
  type: 'response.code_interpreter_call.code.delta';
  item_id: string;
  output_index: number;
  delta: string;
}

export interface ResponseCodeInterpreterCallCodeDoneEvent {
  type: 'response.code_interpreter_call.code.done';
  item_id: string;
  output_index: number;
  code: string;
}

export interface ResponseCodeInterpreterCallCompletedEvent {
  type: 'response.code_interpreter_call.completed';
  output_index: number;
  item_id: string;
}

export interface ResponseCodeInterpreterCallInProgressEvent {
  type: 'response.code_interpreter_call.in_progress';
  output_index: number;
  item_id: string;
}

export interface ResponseCodeInterpreterCallInterpretingEvent {
  type: 'response.code_interpreter_call.interpreting';
  output_index: number;
  item_id: string;
}

export interface ResponseCompletedEvent {
  type: 'response.completed';
  response: Response;
}

export interface ResponseContentPartAddedEvent {
  type: 'response.content_part.added';
  item_id: string;
  output_index: number;
  content_index: number;
  part: any;
}

export interface ResponseContentPartDoneEvent {
  type: 'response.content_part.done';
  item_id: string;
  output_index: number;
  content_index: number;
  part: any;
}

export interface ResponseCreatedEvent {
  type: 'response.created';
  response: Response;
}

export interface ResponseErrorEvent {
  type: 'response.error';
  error: ResponseError;
}

export interface ResponseFileSearchCallCompletedEvent {
  type: 'response.file_search_call.completed';
  output_index: number;
  item_id: string;
}

export interface ResponseFileSearchCallInProgressEvent {
  type: 'response.file_search_call.in_progress';
  output_index: number;
  item_id: string;
}

export interface ResponseFileSearchCallSearchingEvent {
  type: 'response.file_search_call.searching';
  output_index: number;
  item_id: string;
}

export interface ResponseFunctionCallArgumentsDeltaEvent {
  type: 'response.function_call.arguments.delta';
  item_id: string;
  output_index: number;
  tool_call_index: number;
  delta: string;
}

export interface ResponseFunctionCallArgumentsDoneEvent {
  type: 'response.function_call.arguments.done';
  item_id: string;
  output_index: number;
  tool_call_index: number;
  arguments: string;
}

export interface ResponseInProgressEvent {
  type: 'response.in_progress';
  response: Response;
}

export interface ResponseFailedEvent {
  type: 'response.failed';
  response: Response;
}

export interface ResponseIncompleteEvent {
  type: 'response.incomplete';
  response: Response;
}

export interface ResponseOutputItemAddedEvent {
  type: 'response.output_item.added';
  output_index: number;
  item: OutputItem;
}

export interface ResponseOutputItemDoneEvent {
  type: 'response.output_item.done';
  output_index: number;
  item: OutputItem;
}

export interface ResponseReasoningSummaryPartAddedEvent {
  type: 'response.reasoning_summary_part.added';
  item_id: string;
  output_index: number;
  summary_index: number;
  part: {
    type: 'summary_text';
    text: string;
  };
}

export interface ResponseReasoningSummaryPartDoneEvent {
  type: 'response.reasoning_summary_part.done';
  item_id: string;
  output_index: number;
  summary_index: number;
  part: {
    type: 'summary_text';
    text: string;
  };
}

export interface ResponseReasoningSummaryTextDeltaEvent {
  type: 'response.reasoning_summary_text.delta';
  item_id: string;
  output_index: number;
  summary_index: number;
  delta: string;
}

export interface ResponseReasoningSummaryTextDoneEvent {
  type: 'response.reasoning_summary_text.done';
  item_id: string;
  output_index: number;
  summary_index: number;
  text: string;
}

export interface ResponseRefusalDeltaEvent {
  type: 'response.refusal.delta';
  item_id: string;
  output_index: number;
  content_index: number;
  delta: string;
}

export interface ResponseRefusalDoneEvent {
  type: 'response.refusal.done';
  item_id: string;
  output_index: number;
  content_index: number;
  refusal: string;
}

export interface ResponseTextAnnotationDeltaEvent {
  type: 'response.output_text.annotation.added';
  item_id: string;
  output_index: number;
  content_index: number;
  annotation_index: number;
  annotation: any;
}

export interface ResponseTextDeltaEvent {
  type: 'response.output_text.delta';
  item_id: string;
  output_index: number;
  content_index: number;
  delta: string;
}

export interface ResponseTextDoneEvent {
  type: 'response.output_text.done';
  item_id: string;
  output_index: number;
  content_index: number;
  text: string;
}

export interface ResponseWebSearchCallCompletedEvent {
  type: 'response.web_search_call.completed';
  output_index: number;
  item_id: string;
}

export interface ResponseWebSearchCallInProgressEvent {
  type: 'response.web_search_call.in_progress';
  output_index: number;
  item_id: string;
}

export interface ResponseWebSearchCallSearchingEvent {
  type: 'response.web_search_call.searching';
  output_index: number;
  item_id: string;
}
