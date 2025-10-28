// Action Provider - Central hub for action management
// Similar to MCP architecture for action discovery and capabilities

export interface ActionCapability {
  actionType: string;
  specificationVersion: 'v1' | 'v2' | 'v3'; // Action specification version
  name: string;
  description: string;
  inputModalities: InputModality[];
  outputModalities: OutputModality[];
  parameters: ActionParameter[];
  examples: ActionExample[];
  // Version-specific metadata
  versionInfo: {
    introduced: string; // When this version was introduced
    deprecated?: string; // When this version was deprecated
    breakingChanges?: string[]; // List of breaking changes from previous version
    newFeatures?: string[]; // New features in this version
  };
}

export interface InputModality {
  type: 'text' | 'image' | 'audio' | 'video' | 'file' | 'structured';
  description: string;
  required: boolean;
  constraints?: {
    maxSize?: string;
    formats?: string[];
    dimensions?: { width?: number; height?: number };
  };
}

export interface OutputModality {
  type: 'text' | 'image' | 'audio' | 'video' | 'file' | 'structured';
  description: string;
  constraints?: {
    maxSize?: string;
    formats?: string[];
    dimensions?: { width?: number; height?: number };
  };
}

export interface ActionParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  default?: any;
  constraints?: {
    min?: number;
    max?: number;
    enum?: any[];
    pattern?: string;
  };
}

export interface ActionExample {
  name: string;
  description: string;
  input: any;
  parameters?: Record<string, any>;
  expectedOutput: any;
}

export interface ModelActionCompatibility {
  modelId: string;
  supportedActions: string[];
  capabilities: {
    [actionType: string]: {
      maxInputSize?: string;
      maxOutputSize?: string;
      supportedParameters?: string[];
      rateLimits?: {
        requestsPerMinute?: number;
        tokensPerMinute?: number;
      };
    };
  };
}

export interface ActionProvider {
  // Provider identification
  readonly providerId: string;
  readonly name: string;
  readonly version: string;
  readonly description: string;

  initialize(): Promise<void>;

  // Action discovery
  getAvailableActions(): Promise<ActionCapability[]>;
  getActionCapability(actionType: string): Promise<ActionCapability | null>;
  
  // Model compatibility
  getModelActionCompatibility(modelId: string): Promise<ModelActionCompatibility | null>;
  getCompatibleModels(actionType: string): Promise<string[]>;
  
  // Action execution
  executeAction(actionType: string, input: any, parameters?: Record<string, any>, providerOptions?: Record<string, any>, headers?: Record<string, string>): Promise<any>;
  
  // Action registration (for dynamic providers)
  registerAction(capability: ActionCapability, transformer: any): void;
  unregisterAction(actionType: string): void;
  
  // Health and status
  isHealthy(): Promise<boolean>;
  getStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    availableActions: number;
    supportedModels: number;
    lastUpdated: Date;
  }>;
}

// Base implementation for providers
export abstract class BaseActionProvider implements ActionProvider {
  protected actionRegistry = new Map<string, ActionCapability>();
  protected transformers = new Map<string, any>();
  protected modelCompatibility = new Map<string, ModelActionCompatibility>();

  constructor(
    public readonly providerId: string,
    public readonly name: string,
    public readonly version: string,
    public readonly description: string
  ) {}

  async getAvailableActions(): Promise<ActionCapability[]> {
    return Array.from(this.actionRegistry.values());
  }

  async getActionCapability(actionType: string): Promise<ActionCapability | null> {
    return this.actionRegistry.get(actionType) || null;
  }

  async getModelActionCompatibility(modelId: string): Promise<ModelActionCompatibility | null> {
    return this.modelCompatibility.get(modelId) || null;
  }

  async getCompatibleModels(actionType: string): Promise<string[]> {
    const models: string[] = [];
    for (const [modelId, compatibility] of this.modelCompatibility) {
      if (compatibility.supportedActions.includes(actionType)) {
        models.push(modelId);
      }
    }
    return models;
  }

  async executeAction(actionType: string, input: any, parameters?: Record<string, any>, providerOptions?: Record<string, any>, headers?: Record<string, string>): Promise<any> {
    const transformer = this.transformers.get(actionType);
    if (!transformer) {
      throw new Error(`Action '${actionType}' not found in provider '${this.providerId}'`);
    }
    return transformer.execute(input, parameters, providerOptions, headers);
  }

  registerAction(capability: ActionCapability, transformer: any): void {
    this.actionRegistry.set(capability.actionType, capability);
    this.transformers.set(capability.actionType, transformer);
  }

  unregisterAction(actionType: string): void {
    this.actionRegistry.delete(actionType);
    this.transformers.delete(actionType);
  }

  async isHealthy(): Promise<boolean> {
    return this.actionRegistry.size > 0;
  }

  async getStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    availableActions: number;
    supportedModels: number;
    lastUpdated: Date;
  }> {
    const isHealthy = await this.isHealthy();
    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      availableActions: this.actionRegistry.size,
      supportedModels: this.modelCompatibility.size,
      lastUpdated: new Date()
    };
  }

  // Abstract methods for providers to implement
  abstract initialize(): Promise<void>;
  abstract getSupportedModels(): Promise<string[]>;
}
