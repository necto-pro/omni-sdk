// Generic action registry - no hard-coded action types
// This will be populated dynamically by providers

export interface ActionTransformer<TInput = any, TOutput = any> {
  // Transform user input to ActionV1Request format
  transformInput(input: TInput): {
    input: string | any[]; // InputItem[]
    parameters?: Record<string, any>;
  };
  
  // Transform ActionV1Response to user output format
  transformOutput(response: any): TOutput;
  
  // Validate input against provider-specific schema
  validateInput(input: TInput): boolean;
  
  // Validate output against provider-specific schema
  validateOutput(output: any): boolean;
}

export interface ActionRegistry {
  [actionType: string]: ActionTransformer;
}

// Dynamic registry that providers can register with
export const actionRegistry: ActionRegistry = {};

// Register an action transformer
export function registerAction<TInput, TOutput>(
  actionType: string,
  transformer: ActionTransformer<TInput, TOutput>
): void {
  actionRegistry[actionType] = transformer;
}

// Get transformer for an action type
export function getActionTransformer(actionType: string): ActionTransformer | undefined {
  return actionRegistry[actionType];
}

// Check if an action type is registered
export function isActionRegistered(actionType: string): boolean {
  return actionType in actionRegistry;
}

// Get all registered action types
export function getRegisteredActionTypes(): string[] {
  return Object.keys(actionRegistry);
}

