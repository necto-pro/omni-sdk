import { ActionV1, ActionV1Request, ActionV1Response, InputItem, Tool, ToolChoiceOptions, ToolChoiceTypes, ToolChoiceFunction } from '@omni-stack/provider';
import { globalProviderRegistry } from '@omni-stack/provider';

export interface ExecuteOptions {
  type: string;
  model: ActionV1;
  input: any; // Generic input - will be transformed by provider
  parameters?: Record<string, any>;
  providerOptions?: Record<string, any>;
  headers?: Record<string, string>;
  instructions?: string;
  stream?: boolean;
  tools?: Tool[];
  toolChoice?: ToolChoiceOptions | ToolChoiceTypes | ToolChoiceFunction;
  metadata?: any;
  user?: string;
  specificationVersion?: string; // Optional: specify action version
}

export async function execute(options: ExecuteOptions): Promise<any> {
  const { type, model, input, parameters = {}, specificationVersion, providerOptions, headers, ...otherOptions } = options;
  
  // Find the best provider for this action type and model
  const provider = await globalProviderRegistry.findBestProvider(type, model.modelId, specificationVersion);
  if (!provider) {
    const availableActions = await globalProviderRegistry.getAllAvailableActions(specificationVersion);
    const actionTypes = availableActions.map(a => a.actionType);
    const versionInfo = specificationVersion ? ` (version ${specificationVersion})` : '';
    throw new Error(`No provider found for action type '${type}'${versionInfo}. Available actions: ${actionTypes.join(', ')}`);
  }

  // Get action capability for validation
  const capability = await provider.getActionCapability(type);
  if (!capability) {
    throw new Error(`Action '${type}' not found in provider '${provider.providerId}'`);
  }

  // Validate specification version if provided
  if (specificationVersion && capability.specificationVersion !== specificationVersion) {
    throw new Error(`Action '${type}' version mismatch. Expected '${specificationVersion}', got '${capability.specificationVersion}'`);
  }

  // Execute the action using the provider
  const result = await provider.executeAction(type, input, parameters, providerOptions, headers);
  
  return result;
}

export async function* executeStream(options: ExecuteOptions): AsyncIterable<any> {
  const { type, model, input, parameters = {}, specificationVersion, providerOptions, headers, ...otherOptions } = options;
  
  if (!model.doActionStream) {
    throw new Error('Model does not support streaming');
  }

  // Find the best provider for this action type and model
  const provider = await globalProviderRegistry.findBestProvider(type, model.modelId, specificationVersion);
  if (!provider) {
    const availableActions = await globalProviderRegistry.getAllAvailableActions(specificationVersion);
    const actionTypes = availableActions.map(a => a.actionType);
    const versionInfo = specificationVersion ? ` (version ${specificationVersion})` : '';
    throw new Error(`No provider found for action type '${type}'${versionInfo}. Available actions: ${actionTypes.join(', ')}`);
  }

  // For now, streaming is handled by the provider
  // In a full implementation, providers would support streaming
  const result = await provider.executeAction(type, input, parameters, providerOptions, headers);
  yield result;
}