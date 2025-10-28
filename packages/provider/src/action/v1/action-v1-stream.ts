import { OutputItem, ResponseError } from './action-v1-components';

export type ActionV1StreamEvent =
  | ActionV1ResponseCompletedEvent
  | ActionV1ResponseCreatedEvent
  | ActionV1ResponseInProgressEvent
  | ActionV1ResponseFailedEvent
  | ActionV1ResponseIncompleteEvent
  | ActionV1ResponseErrorEvent
  | ActionV1OutputItemAddedEvent
  | ActionV1OutputItemDoneEvent;

export interface ActionV1ResponseCompletedEvent {
  type: 'response.completed';
  response: any; // Will be ActionV1Response when we have the full type
}

export interface ActionV1ResponseCreatedEvent {
  type: 'response.created';
  response: any; // Will be ActionV1Response when we have the full type
}

export interface ActionV1ResponseInProgressEvent {
  type: 'response.in_progress';
  response: any; // Will be ActionV1Response when we have the full type
}

export interface ActionV1ResponseFailedEvent {
  type: 'response.failed';
  response: any; // Will be ActionV1Response when we have the full type
}

export interface ActionV1ResponseIncompleteEvent {
  type: 'response.incomplete';
  response: any; // Will be ActionV1Response when we have the full type
}

export interface ActionV1ResponseErrorEvent {
  type: 'response.error';
  error: ResponseError;
}

export interface ActionV1OutputItemAddedEvent {
  type: 'response.output_item.added';
  outputIndex: number;
  item: OutputItem;
}

export interface ActionV1OutputItemDoneEvent {
  type: 'response.output_item.done';
  outputIndex: number;
  item: OutputItem;
}

