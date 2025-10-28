// Provider Registry - Manages multiple action providers
// Similar to MCP server registry

import { ActionProvider, ActionCapability, ModelActionCompatibility } from './action-provider';

export interface ProviderRegistry {
  // Provider management
  registerProvider(provider: ActionProvider): Promise<void>;
  unregisterProvider(providerId: string): Promise<void>;
  getProvider(providerId: string): ActionProvider | null;
  getAllProviders(): ActionProvider[];
  
  // Action discovery across all providers
  getAllAvailableActions(specificationVersion?: string): Promise<ActionCapability[]>;
  getActionProviders(actionType: string, specificationVersion?: string): Promise<ActionProvider[]>;
  findBestProvider(actionType: string, modelId?: string, specificationVersion?: string): Promise<ActionProvider | null>;
  
  // Version-specific discovery
  getActionVersions(actionType: string): Promise<string[]>;
  getLatestActionVersion(actionType: string): Promise<string | null>;
  
  // Model compatibility across providers
  getModelCompatibility(modelId: string): Promise<ModelActionCompatibility[]>;
  getCompatibleProviders(modelId: string): Promise<ActionProvider[]>;
  
  // Health and status
  getOverallStatus(): Promise<{
    totalProviders: number;
    totalActions: number;
    totalModels: number;
    healthyProviders: number;
    lastUpdated: Date;
  }>;
}

export class DefaultProviderRegistry implements ProviderRegistry {
  private providers = new Map<string, ActionProvider>();

  async registerProvider(provider: ActionProvider): Promise<void> {
    await provider.initialize();
    this.providers.set(provider.providerId, provider);
  }

  async unregisterProvider(providerId: string): Promise<void> {
    this.providers.delete(providerId);
  }

  getProvider(providerId: string): ActionProvider | null {
    return this.providers.get(providerId) || null;
  }

  getAllProviders(): ActionProvider[] {
    return Array.from(this.providers.values());
  }

  async getAllAvailableActions(specificationVersion?: string): Promise<ActionCapability[]> {
    const allActions: ActionCapability[] = [];
    
    for (const provider of this.providers.values()) {
      const actions = await provider.getAvailableActions();
      if (specificationVersion) {
        const filteredActions = actions.filter(action => action.specificationVersion === specificationVersion);
        allActions.push(...filteredActions);
      } else {
        allActions.push(...actions);
      }
    }
    
    return allActions;
  }

  async getActionProviders(actionType: string, specificationVersion?: string): Promise<ActionProvider[]> {
    const supportingProviders: ActionProvider[] = [];
    
    for (const provider of this.providers.values()) {
      const capability = await provider.getActionCapability(actionType);
      if (capability && (!specificationVersion || capability.specificationVersion === specificationVersion)) {
        supportingProviders.push(provider);
      }
    }
    
    return supportingProviders;
  }

  async findBestProvider(actionType: string, modelId?: string, specificationVersion?: string): Promise<ActionProvider | null> {
    const supportingProviders = await this.getActionProviders(actionType, specificationVersion);
    
    if (supportingProviders.length === 0) {
      return null;
    }
    
    // If modelId is specified, find providers that support this model
    if (modelId) {
      for (const provider of supportingProviders) {
        const compatibleModels = await provider.getCompatibleModels(actionType);
        if (compatibleModels.includes(modelId)) {
          return provider;
        }
      }
    }
    
    // Return the first available provider
    return supportingProviders[0];
  }

  async getActionVersions(actionType: string): Promise<string[]> {
    const versions = new Set<string>();
    
    for (const provider of this.providers.values()) {
      const capability = await provider.getActionCapability(actionType);
      if (capability) {
        versions.add(capability.specificationVersion);
      }
    }
    
    return Array.from(versions).sort();
  }

  async getLatestActionVersion(actionType: string): Promise<string | null> {
    const versions = await this.getActionVersions(actionType);
    if (versions.length === 0) return null;
    
    // Sort versions and return the latest (assuming semantic versioning)
    return versions[versions.length - 1];
  }

  async getModelCompatibility(modelId: string): Promise<ModelActionCompatibility[]> {
    const compatibilities: ModelActionCompatibility[] = [];
    
    for (const provider of this.providers.values()) {
      const compatibility = await provider.getModelActionCompatibility(modelId);
      if (compatibility) {
        compatibilities.push(compatibility);
      }
    }
    
    return compatibilities;
  }

  async getCompatibleProviders(modelId: string): Promise<ActionProvider[]> {
    const compatibleProviders: ActionProvider[] = [];
    
    for (const provider of this.providers.values()) {
      const compatibility = await provider.getModelActionCompatibility(modelId);
      if (compatibility) {
        compatibleProviders.push(provider);
      }
    }
    
    return compatibleProviders;
  }

  async getOverallStatus(): Promise<{
    totalProviders: number;
    totalActions: number;
    totalModels: number;
    healthyProviders: number;
    lastUpdated: Date;
  }> {
    let totalActions = 0;
    let totalModels = 0;
    let healthyProviders = 0;
    
    for (const provider of this.providers.values()) {
      const status = await provider.getStatus();
      if (status.status === 'healthy') {
        healthyProviders++;
      }
      totalActions += status.availableActions;
      totalModels += status.supportedModels;
    }
    
    return {
      totalProviders: this.providers.size,
      totalActions,
      totalModels,
      healthyProviders,
      lastUpdated: new Date()
    };
  }
}

// Global provider registry instance
export const globalProviderRegistry = new DefaultProviderRegistry();
