import { ImageModelV3 } from '@omni-stack/provider';
import { notImplemented } from './not-implemented';
import { ActionV1 } from '@omni-stack/provider';

export class MockImageModelV3 implements ImageModelV3, ActionV1 {
  specificationVersion = 'v3' as const;
  provider = 'mock-provider' as const;
  modelId = 'mock-model-id' as const;
  maxImagesPerCall: ImageModelV3['maxImagesPerCall'];

  doGenerate: ImageModelV3['doGenerate'];

  constructor({
    provider = 'mock-provider',
    modelId = 'mock-model-id',
    maxImagesPerCall = 1,
    doGenerate = notImplemented,
  }: {
    provider?: ImageModelV3['provider'];
    modelId?: ImageModelV3['modelId'];
    maxImagesPerCall?: ImageModelV3['maxImagesPerCall'];
    doGenerate?: ImageModelV3['doGenerate'];
  } = {}) {
    this.provider = provider;
    this.modelId = modelId;
    this.maxImagesPerCall = maxImagesPerCall;
    this.doGenerate = doGenerate;
  }

  async doAction(options: any): Promise<any> {
    return this.doGenerate(options);
  }
}
