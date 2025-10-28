import { ActionTransformer, registerAction } from '../actions';
import { Prompt } from '../prompt';
import { CallSettings } from '../prompt/call-settings';
import { convertToLanguageModelPrompt } from '../prompt/convert-to-language-model-prompt';
import { standardizePrompt } from '../prompt/standardize-prompt';
import { LanguageModel, ToolChoice } from '../types';
import { ToolSet } from './tool-set';
import {
  getErrorMessage,
  LanguageModelV3,
  LanguageModelV3CallWarning,
} from '@omni-stack/provider';
import {
  createIdGenerator,
  IdGenerator,
  isAbortError,
  ProviderOptions,
} from '@omni-stack/provider-utils';
import { Span } from '@opentelemetry/api';
import { ServerResponse } from 'node:http';
import { NoOutputGeneratedError } from '../error';
import { NoOutputSpecifiedError } from '../error/no-output-specified-error';
import { logWarnings } from '../logger/log-warnings';
import { resolveLanguageModel } from '../model/resolve-model';
import { createToolModelOutput } from '../prompt/create-tool-model-output';
import { prepareCallSettings } from '../prompt/prepare-call-settings';
import { prepareToolsAndToolChoice } from '../prompt/prepare-tools-and-tool-choice';
import { wrapGatewayError } from '../prompt/wrap-gateway-error';
import { assembleOperationName } from '../telemetry/assemble-operation-name';
import { getBaseTelemetryAttributes } from '../telemetry/get-base-telemetry-attributes';
import { getTracer } from '../telemetry/get-tracer';
import { recordSpan } from '../telemetry/record-span';
import { selectTelemetryAttributes } from '../telemetry/select-telemetry-attributes';
import { stringifyForTelemetry } from '../telemetry/stringify-for-telemetry';
import { TelemetrySettings } from '../telemetry/telemetry-settings';
import { createTextStreamResponse } from '../text-stream/create-text-stream-response';
import { pipeTextStreamToResponse } from '../text-stream/pipe-text-stream-to-response';
import { LanguageModelRequestMetadata } from '../types';
import {
  CallWarning,
  FinishReason,
} from '../types/language-model';
import { ProviderMetadata } from '../types/provider-metadata';
import { addLanguageModelUsage, LanguageModelUsage } from '../types/usage';
import { UIMessage } from '../ui';
import { createUIMessageStreamResponse } from '../ui-message-stream/create-ui-message-stream-response';
import { getResponseUIMessageId } from '../ui-message-stream/get-response-ui-message-id';
import { handleUIMessageStreamFinish } from '../ui-message-stream/handle-ui-message-stream-finish';
import { pipeUIMessageStreamToResponse } from '../ui-message-stream/pipe-ui-message-stream-to-response';
import {
  InferUIMessageChunk,
  UIMessageChunk,
} from '../ui-message-stream/ui-message-chunks';
import { UIMessageStreamResponseInit } from '../ui-message-stream/ui-message-stream-response-init';
import { InferUIMessageData, InferUIMessageMetadata } from '../ui/ui-messages';
import { asArray } from '../util/as-array';
import {
  AsyncIterableStream,
  createAsyncIterableStream,
} from '../util/async-iterable-stream';
import { consumeStream } from '../util/consume-stream';
import { createStitchableStream } from '../util/create-stitchable-stream';
import { DelayedPromise } from '../util/delayed-promise';
import { DownloadFunction } from '../util/download/download-function';
import { now as originalNow } from '../util/now';
import { prepareRetries } from '../util/prepare-retries';
import { collectToolApprovals } from './collect-tool-approvals';
import { ContentPart } from './content-part';
import { executeToolCall } from './execute-tool-call';
import { Output } from './output';
import { PrepareStepFunction } from './prepare-step';
import { ResponseMessage } from './response-message';
import {
  runToolsTransformation,
  SingleRequestTextStreamPart,
} from './run-tools-transformation';
import { DefaultStepResult, StepResult } from './step-result';
import {
  isStopConditionMet,
  stepCountIs,
  StopCondition,
} from './stop-condition';
import {
  ConsumeStreamOptions,
  StreamTextResult,
  TextStreamPart,
  UIMessageStreamOptions,
} from './stream-text-result';
import { toResponseMessages } from './to-response-messages';
import { TypedToolCall } from './tool-call';
import { ToolCallRepairFunction } from './tool-call-repair-function';
import { ToolOutput } from './tool-output';
import { StaticToolOutputDenied } from './tool-output-denied';

const originalGenerateId = createIdGenerator({
  prefix: 'aitxt',
  size: 24,
});

const textStreamingAction: ActionTransformer<
  Prompt &
    CallSettings & {
      model: LanguageModel;
      tools?: ToolSet;
      toolChoice?: ToolChoice<ToolSet>;
      stopWhen?: StopCondition<ToolSet> | Array<StopCondition<ToolSet>>;
      output?: Output<any, any>;
      telemetry?: TelemetrySettings;
      providerOptions?: ProviderOptions;
      activeTools?: Array<keyof ToolSet>;
      prepareStep?: PrepareStepFunction<ToolSet>;
      repairToolCall?: ToolCallRepairFunction<ToolSet>;
      download?: DownloadFunction;
      experimental_context?: unknown;
      _internal?: {
        now?: () => number;
        generateId?: IdGenerator;
        currentDate?: () => Date;
      };
      onChunk?: (event: {
        chunk: Extract<
          TextStreamPart<ToolSet>,
          {
            type:
              | 'text-delta'
              | 'reasoning-delta'
              | 'source'
              | 'tool-call'
              | 'tool-input-start'
              | 'tool-input-delta'
              | 'tool-result'
              | 'raw';
          }
        >;
      }) => PromiseLike<void> | void;
      onError?: (event: {
        error: unknown;
      }) => PromiseLike<void> | void;
      onStepFinish?: (stepResult: StepResult<ToolSet>) => PromiseLike<void> | void;
      onFinish?: (
        event: StepResult<ToolSet> & {
          readonly steps: StepResult<ToolSet>[];
          readonly totalUsage: LanguageModelUsage;
        },
      ) => PromiseLike<void> | void;
      onAbort?: (event: {
        readonly steps: StepResult<ToolSet>[];
      }) => PromiseLike<void> | void;
    },
  any
> = {
  transformInput: async ({
    model,
    tools,
    toolChoice,
    system,
    prompt,
    messages,
    maxRetries,
    abortSignal,
    headers,
    stopWhen = stepCountIs(1),
    experimental_output,
    output = experimental_output,
    experimental_telemetry: telemetry,
    prepareStep,
    providerOptions,
    experimental_activeTools,
    activeTools = experimental_activeTools,
    experimental_repairToolCall: repairToolCall,
    experimental_transform: transform,
    experimental_download: download,
    includeRawChunks = false,
    onChunk,
    onError = ({ error }) => {
      console.error(error);
    },
    onFinish,
    onAbort,
    onStepFinish,
    experimental_context,
    _internal: {
      now = originalNow,
      generateId = originalGenerateId,
      currentDate = () => new Date(),
    } = {},
    ...settings
  }) => {
    return new DefaultStreamTextResult({
      model: resolveLanguageModel(model),
      telemetry,
      headers,
      settings,
      maxRetries,
      abortSignal,
      system,
      prompt,
      messages,
      tools,
      toolChoice,
      transforms: asArray(transform),
      activeTools,
      repairToolCall,
      stopConditions: asArray(stopWhen),
      output,
      providerOptions,
      prepareStep,
      includeRawChunks,
      onChunk,
      onError,
      onFinish,
      onAbort,
      onStepFinish,
      now,
      currentDate,
      generateId,
      experimental_context,
      download,
    });
  },
  transformOutput: (output: any) => {
    // The output from the provider is passed through
    return output;
  },

  validateInput: (input: any) => {
    // For now, we assume the input is valid
    return true;
  },

  validateOutput: (output: any) => {
    // For now, we assume the output is valid
    return true;
  },
};

registerAction('text.stream', textStreamingAction);
