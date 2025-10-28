import { ActionV1Request } from './action-v1-request';
import { ActionV1Response } from './action-v1-response';
import { ActionV1StreamEvent } from './action-v1-stream';

export interface ActionV1 {
  readonly specificationVersion: 'v1';
  readonly provider: string;
  readonly modelId: string;
  readonly actionVersion?: string; // Optional action-specific version
  
  doAction(options: { 
    request: ActionV1Request;
  }): Promise<ActionV1Response>;
  
  doActionStream?(options: { 
    request: ActionV1Request;
  }): AsyncIterable<ActionV1StreamEvent>;
}

// Future action versions
export interface ActionV2 {
  readonly specificationVersion: 'v2';
  readonly provider: string;
  readonly modelId: string;
  readonly actionVersion?: string;

  doAction(options: {
    request: ActionV2Request;
  }): Promise<ActionV2Response>;

  doActionStream?(options: {
    request: ActionV2Request;
  }): AsyncIterable<ActionV2StreamEvent>;
}

export interface ActionV3 {
  readonly specificationVersion: 'v3';
  readonly provider: string;
  readonly modelId: string;
  readonly actionVersion?: string;

  doAction(options: {
    request: ActionV3Request;
  }): Promise<ActionV3Response>;

  doActionStream?(options: {
    request: ActionV3Request;
  }): AsyncIterable<ActionV3StreamEvent>;
}

// Union type for all action versions
export type Action = ActionV1 | ActionV2 | ActionV3;

// Placeholder types for future versions
export type ActionV2Request = any;
export type ActionV2Response = any;
export type ActionV2StreamEvent = any;
export type ActionV3Request = any;
export type ActionV3Response = any;
export type ActionV3StreamEvent = any;