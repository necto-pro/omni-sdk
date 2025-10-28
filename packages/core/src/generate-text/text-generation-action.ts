import { ActionTransformer, registerAction } from '../actions';
import { Prompt } from '../prompt';
import { CallSettings } from '../prompt/call-settings';
import { convertToLanguageModelPrompt } from '../prompt/convert-to-language-model-prompt';
import { standardizePrompt } from '../prompt/standardize-prompt';
import { ToolChoice, LanguageModel } from '../types';
import { ToolSet } from './tool-set';
import { TypedToolResult } from './tool-result';
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
import { logWarnings } from '../logger/log-warnings';
import { resolveLanguageModel } from '../model/resolve-model';
import { ModelMessage } from '../prompt';
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
import { NoOutputSpecifiedError } from '../error/no-output-specified-error';

const originalGenerateId = createIdGenerator({
  prefix: 'aitxt',
  size: 24,
});

const textGenerationAction: ActionTransformer<
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
        generateId?: IdGenerator;
        currentDate?: () => Date;
      };
      onStepFinish?: (stepResult: StepResult<ToolSet>) => Promise<void> | void;
      onFinish?: (
        event: StepResult<ToolSet> & {
          readonly steps: StepResult<ToolSet>[];
          readonly totalUsage: LanguageModelUsage;
        },
      ) => PromiseLike<void> | void;
    },
  any
> = {
  transformInput: async originalInput => {
    return {
      input: [] as any[], // TODO: Fix type
      parameters: originalInput as any,
    };
  },

  transformOutput: (output: any) => {
    return output;
  },

  validateInput: (input: any) => {
    return true;
  },

  validateOutput: (output: any) => {
    return true;
  },
};

registerAction('text.generate', textGenerationAction);

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
          } as TypedToolResult<any>;
        }
      }
    }),
    ...toolOutputs,
    ...toolApprovalRequests,
  ];
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
