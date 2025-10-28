import {
  LanguageModelV3,
  LanguageModelV3Content,
  LanguageModelV3ToolCall,
} from '@omni-stack/provider';
import {
  createIdGenerator,
  getErrorMessage,
  IdGenerator,
  ProviderOptions,
  withUserAgentSuffix,
} from '@omni-stack/provider-utils';
import { Tracer } from '@opentelemetry/api';
import { NoOutputSpecifiedError } from '../error/no-output-specified-error';
import { logWarnings } from '../logger/log-warnings';
import { resolveLanguageModel } from '../model/resolve-model';
import { ModelMessage } from '../prompt';
import { CallSettings } from '../prompt/call-settings';
import { convertToLanguageModelPrompt } from '../prompt/convert-to-language-model-prompt';
import { createToolModelOutput } from '../prompt/create-tool-model-output';
import { prepareCallSettings } from '../prompt/prepare-call-settings';
import { prepareToolsAndToolChoice } from '../prompt/prepare-tools-and-tool-choice';
import { Prompt } from '../prompt/prompt';
import { standardizePrompt } from '../prompt/standardize-prompt';
import { wrapGatewayError } from '../prompt/wrap-gateway-error';
import { assembleOperationName } from '../telemetry/assemble-operation-name';
import { getBaseTelemetryAttributes } from '../telemetry/get-base-telemetry-attributes';
import { getTracer } from '../telemetry/get-tracer';
import { recordSpan } from '../telemetry/record-span';
import { selectTelemetryAttributes } from '../telemetry/select-telemetry-attributes';
import { stringifyForTelemetry } from '../telemetry/stringify-for-telemetry';
import { TelemetrySettings } from '../telemetry/telemetry-settings';
import { LanguageModel, ToolChoice } from '../types';
import { addLanguageModelUsage, LanguageModelUsage } from '../types/usage';
import { asArray } from '../util/as-array';
import { DownloadFunction } from '../util/download/download-function';
import { prepareRetries } from '../util/prepare-retries';
import { VERSION } from '../version';
import { collectToolApprovals } from './collect-tool-approvals';
import { ContentPart } from './content-part';
import { executeToolCall } from './execute-tool-call';
import { extractTextContent } from './extract-text-content';
import { GenerateTextResult } from './generate-text-result';
import { DefaultGeneratedFile } from './generated-file';
import { isApprovalNeeded } from './is-approval-needed';
import { Output } from './output';
import { parseToolCall } from './parse-tool-call';
import { PrepareStepFunction } from './prepare-step';
import { ResponseMessage } from './response-message';
import { DefaultStepResult, StepResult } from './step-result';
import {
  isStopConditionMet,
  stepCountIs,
  StopCondition,
} from './stop-condition';
import { toResponseMessages } from './to-response-messages';
import { ToolApprovalRequestOutput } from './tool-approval-request-output';
import { TypedToolCall } from './tool-call';
import { ToolCallRepairFunction } from './tool-call-repair-function';
import { TypedToolError } from './tool-error';
import { ToolOutput } from './tool-output';
import { TypedToolResult } from './tool-result';
import { ToolSet } from './tool-set';
import { execute } from '../execute';
import './text-generation-action';

const originalGenerateId = createIdGenerator({
  prefix: 'aitxt',
  size: 24,
});

/**
Callback that is set using the `onStepFinish` option.

@param stepResult - The result of the step.
 */
export type GenerateTextOnStepFinishCallback<TOOLS extends ToolSet> = (
  stepResult: StepResult<TOOLS>,
) => Promise<void> | void;

/**
Callback that is set using the `onFinish` option.

@param event - The event that is passed to the callback.
 */
export type GenerateTextOnFinishCallback<TOOLS extends ToolSet> = (
  event: StepResult<TOOLS> & {
    /**
Details for all steps.
   */
    readonly steps: StepResult<TOOLS>[];

    /**
Total usage for all steps. This is the sum of the usage of all steps.
     */
    readonly totalUsage: LanguageModelUsage;
  },
) => PromiseLike<void> | void;

/**
Generate a text and call tools for a given prompt using a language model.

This function does not stream the output. If you want to stream the output, use `streamText` instead.

@param model - The language model to use.

@param tools - Tools that are accessible to and can be called by the model. The model needs to support calling tools.
@param toolChoice - The tool choice strategy. Default: 'auto'.

@param system - A system message that will be part of the prompt.
@param prompt - A simple text prompt. You can either use `prompt` or `messages` but not both.
@param messages - A list of messages. You can either use `prompt` or `messages` but not both.

@param maxOutputTokens - Maximum number of tokens to generate.
@param temperature - Temperature setting.
The value is passed through to the provider. The range depends on the provider and model.
It is recommended to set either `temperature` or `topP`, but not both.
@param topP - Nucleus sampling.
The value is passed through to the provider. The range depends on the provider and model.
It is recommended to set either `temperature` or `topP`, but not both.
@param topK - Only sample from the top K options for each subsequent token.
Used to remove "long tail" low probability responses.
Recommended for advanced use cases only. You usually only need to use temperature.
@param presencePenalty - Presence penalty setting.
It affects the likelihood of the model to repeat information that is already in the prompt.
The value is passed through to the provider. The range depends on the provider and model.
@param frequencyPenalty - Frequency penalty setting.
It affects the likelihood of the model to repeatedly use the same words or phrases.
The value is passed through to the provider. The range depends on the provider and model.
@param stopSequences - Stop sequences.
If set, the model will stop generating text when one of the stop sequences is generated.
@param seed - The seed (integer) to use for random sampling.
If set and supported by the model, calls will generate deterministic results.

@param maxRetries - Maximum number of retries. Set to 0 to disable retries. Default: 2.
@param abortSignal - An optional abort signal that can be used to cancel the call.
@param headers - Additional HTTP headers to be sent with the request. Only applicable for HTTP-based providers.

@param experimental_generateMessageId - Generate a unique ID for each message.

@param onStepFinish - Callback that is called when each step (LLM call) is finished, including intermediate steps.
@param onFinish - Callback that is called when all steps are finished and the response is complete.

@returns
A result object that contains the generated text, the results of the tool calls, and additional information.
 */
export async function generateText<
  TOOLS extends ToolSet,
  OUTPUT = never,
  PARTIAL_OUTPUT = never,
>({
  model: modelArg,
  tools,
  toolChoice,
  system,
  prompt,
  messages,
  maxRetries: maxRetriesArg,
  abortSignal,
  headers,
  stopWhen = stepCountIs(1),
  experimental_output,
  output = experimental_output,
  experimental_telemetry: telemetry,
  providerOptions,
  experimental_activeTools,
  activeTools = experimental_activeTools,
  experimental_prepareStep,
  prepareStep = experimental_prepareStep,
  experimental_repairToolCall: repairToolCall,
  experimental_download: download,
  experimental_context,
  _internal: {
    generateId = originalGenerateId,
    currentDate = () => new Date(),
  } = {},
  onStepFinish,
  onFinish,
  ...settings
}: CallSettings &
  Prompt & {
    /**
     * The language model to use.
     */
    model: LanguageModel;

    /**
The tools that the model can call. The model needs to support calling tools.
*/
    tools?: TOOLS;

    /**
     * The tool choice strategy. Default: 'auto'.
     */
    toolChoice?: ToolChoice<NoInfer<TOOLS>>;

    /**
Condition for stopping the generation when there are tool results in the last step.
When the condition is an array, any of the conditions can be met to stop the generation.

@default stepCountIs(1)
     */
    stopWhen?:
      | StopCondition<NoInfer<TOOLS>>
      | Array<StopCondition<NoInfer<TOOLS>>>;

    /**
Optional telemetry configuration (experimental).
     */
    experimental_telemetry?: TelemetrySettings;

    /**
Additional provider-specific options. They are passed through
to the provider from the AI SDK and enable provider-specific
functionality that can be fully encapsulated in the provider.
 */
    providerOptions?: ProviderOptions;

    /**
     * @deprecated Use `activeTools` instead.
     */
    experimental_activeTools?: Array<keyof NoInfer<TOOLS>>;

    /**
Limits the tools that are available for the model to call without
changing the tool call and result types in the result.
     */
    activeTools?: Array<keyof NoInfer<TOOLS>>;

    /**
Optional specification for parsing structured outputs from the LLM response.
     */
    output?: Output<OUTPUT, PARTIAL_OUTPUT>;

    /**
Optional specification for parsing structured outputs from the LLM response.

@deprecated Use `output` instead.
     */
    experimental_output?: Output<OUTPUT, PARTIAL_OUTPUT>;

    /**
Custom download function to use for URLs.

By default, files are downloaded if the model does not support the URL for the given media type.
     */
    experimental_download?: DownloadFunction | undefined;

    /**
     * @deprecated Use `prepareStep` instead.
     */
    experimental_prepareStep?: PrepareStepFunction<NoInfer<TOOLS>>;

    /**
Optional function that you can use to provide different settings for a step.
    */
    prepareStep?: PrepareStepFunction<NoInfer<TOOLS>>;

    /**
A function that attempts to repair a tool call that failed to parse.
     */
    experimental_repairToolCall?: ToolCallRepairFunction<NoInfer<TOOLS>>;

    /**
     * Callback that is called when each step (LLM call) is finished, including intermediate steps.
     */
    onStepFinish?: GenerateTextOnStepFinishCallback<NoInfer<TOOLS>>;

    /**
     * Callback that is called when all steps are finished and the response is complete.
     */
    onFinish?: GenerateTextOnFinishCallback<NoInfer<TOOLS>>;

    /**
     * Context that is passed into tool execution.
     *
     * Experimental (can break in patch releases).
     *
     * @default undefined
     */
    experimental_context?: unknown;

    /**
     * Internal. For test use only. May change without notice.
     */
    _internal?: {
      generateId?: IdGenerator;
      currentDate?: () => Date;
    };
  }): Promise<GenerateTextResult<TOOLS, OUTPUT>> {
  const { retry } = prepareRetries({
    maxRetries: maxRetriesArg,
    abortSignal,
  });

  const result = await retry(() =>
    execute({
      type: 'text.generate',
      model: modelArg,
      input: { system, prompt, messages, ...settings } as any, // TODO fix
      parameters: {
        tools,
        toolChoice,
        stopWhen,
        output,
        telemetry,
                  providerOptions,
        activeTools,
        prepareStep,
                  repairToolCall,
        download,
                experimental_context,
        _internal: { generateId, currentDate },
        onStepFinish,
        onFinish,
      },
      stream: false,
      providerOptions,
      headers,
          }),
        );

  return result as Promise<GenerateTextResult<TOOLS, OUTPUT>>;
}

async function executeTools<TOOLS extends ToolSet>({
  toolCalls,
  tools,
  tracer,
  telemetry,
  messages,
  abortSignal,
  experimental_context,
}: {
  toolCalls: Array<TypedToolCall<TOOLS>>;
  tools: TOOLS;
  tracer: Tracer;
  telemetry: TelemetrySettings | undefined;
  messages: ModelMessage[];
  abortSignal: AbortSignal | undefined;
  experimental_context: unknown;
}): Promise<Array<ToolOutput<TOOLS>>> {
  const toolOutputs = await Promise.all(
    toolCalls.map(async toolCall =>
      executeToolCall({
        toolCall,
        tools,
        tracer,
        telemetry,
        messages,
        abortSignal,
        experimental_context,
      }),
    ),
  );

  return toolOutputs.filter(
    (output): output is NonNullable<typeof output> => output != null,
  );
}

class DefaultGenerateTextResult<TOOLS extends ToolSet, OUTPUT>
  implements GenerateTextResult<TOOLS, OUTPUT>
{
  readonly steps: GenerateTextResult<TOOLS, OUTPUT>['steps'];
  readonly totalUsage: LanguageModelUsage;

  private readonly resolvedOutput: OUTPUT;

  constructor(options: {
    steps: GenerateTextResult<TOOLS, OUTPUT>['steps'];
    resolvedOutput: OUTPUT;
    totalUsage: LanguageModelUsage;
  }) {
    this.steps = options.steps;
    this.resolvedOutput = options.resolvedOutput;
    this.totalUsage = options.totalUsage;
  }

  private get finalStep() {
    return this.steps[this.steps.length - 1];
  }

  get content() {
    return this.finalStep.content;
  }

  get text() {
    return this.finalStep.text;
  }

  get files() {
    return this.finalStep.files;
  }

  get reasoningText() {
    return this.finalStep.reasoningText;
  }

  get reasoning() {
    return this.finalStep.reasoning;
  }

  get toolCalls() {
    return this.finalStep.toolCalls;
  }

  get staticToolCalls() {
    return this.finalStep.staticToolCalls;
  }

  get dynamicToolCalls() {
    return this.finalStep.dynamicToolCalls;
  }

  get toolResults() {
    return this.finalStep.toolResults;
  }

  get staticToolResults() {
    return this.finalStep.staticToolResults;
  }

  get dynamicToolResults() {
    return this.finalStep.dynamicToolResults;
  }

  get sources() {
    return this.finalStep.sources;
  }

  get finishReason() {
    return this.finalStep.finishReason;
  }

  get warnings() {
    return this.finalStep.warnings;
  }

  get providerMetadata() {
    return this.finalStep.providerMetadata;
  }

  get response() {
    return this.finalStep.response;
  }

  get request() {
    return this.finalStep.request;
  }

  get usage() {
    return this.finalStep.usage;
  }

  get experimental_output() {
    return this.output;
  }

  get output() {
    if (this.resolvedOutput == null) {
      throw new NoOutputSpecifiedError();
    }

    return this.resolvedOutput;
  }
}

function asToolCalls(content: Array<LanguageModelV3Content>) {
  const parts = content.filter(
    (part): part is LanguageModelV3ToolCall => part.type === 'tool-call',
  );

  if (parts.length === 0) {
    return undefined;
  }

  return parts.map(toolCall => ({
    toolCallId: toolCall.toolCallId,
    toolName: toolCall.toolName,
    input: toolCall.input,
  }));
}

// TODO AI SDK 5.1 / AI SDK 6: rename to asOutput
function asContent<TOOLS extends ToolSet>({
  content,
  toolCalls,
  toolOutputs,
  toolApprovalRequests,
}: {
  content: Array<LanguageModelV3Content>;
  toolCalls: Array<TypedToolCall<TOOLS>>;
  toolOutputs: Array<ToolOutput<TOOLS>>;
  toolApprovalRequests: Array<ToolApprovalRequestOutput<TOOLS>>;
}): Array<ContentPart<TOOLS>> {
  return [
    ...content.map(part => {
      switch (part.type) {
        case 'text':
        case 'reasoning':
        case 'source':
          return part;

        case 'file': {
          return {
            type: 'file' as const,
            file: new DefaultGeneratedFile(part),
          };
        }

        case 'tool-call': {
          return toolCalls.find(
            toolCall => toolCall.toolCallId === part.toolCallId,
          )!;
        }

        case 'tool-result': {
          const toolCall = toolCalls.find(
            toolCall => toolCall.toolCallId === part.toolCallId,
          )!;

          if (toolCall == null) {
            throw new Error(`Tool call ${part.toolCallId} not found.`);
          }

          if (part.isError) {
            return {
              type: 'tool-error' as const,
              toolCallId: part.toolCallId,
              toolName: part.toolName as keyof TOOLS & string,
              input: toolCall.input,
              error: part.result,
              providerExecuted: true,
              dynamic: toolCall.dynamic,
            } as TypedToolError<TOOLS>;
          }

          return {
            type: 'tool-result' as const,
            toolCallId: part.toolCallId,
            toolName: part.toolName as keyof TOOLS & string,
            input: toolCall.input,
            output: part.result,
            providerExecuted: true,
            dynamic: toolCall.dynamic,
          } as TypedToolResult<TOOLS>;
        }
      }
    }),
    ...toolOutputs,
    ...toolApprovalRequests,
  ];
}
