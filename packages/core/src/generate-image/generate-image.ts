import { ActionV1 } from '@omni-stack/provider';
import { ProviderOptions, withUserAgentSuffix } from '@omni-stack/provider-utils';
import { NoImageGeneratedError } from '../error/no-image-generated-error';
import {
  detectMediaType,
  imageMediaTypeSignatures,
} from '../util/detect-media-type';
import { prepareRetries } from '../util/prepare-retries';
import {
  DefaultGeneratedFile,
  GeneratedFile,
} from '../generate-text/generated-file';
import { ImageGenerationWarning } from '../types/image-model';
import { ImageModelResponseMetadata } from '../types/image-model-response-metadata';
import { GenerateImageResult } from './generate-image-result';
import { logWarnings } from '../logger/log-warnings';
import { VERSION } from '../version';
import { execute } from '../execute';

/**
Generates images using an image model.

@param model - The image model to use.
@param prompt - The prompt that should be used to generate the image.
@param n - Number of images to generate. Default: 1.
@param size - Size of the images to generate. Must have the format `{width}x{height}`.
@param aspectRatio - Aspect ratio of the images to generate. Must have the format `{width}:{height}`.
@param seed - Seed for the image generation.
@param providerOptions - Additional provider-specific options that are passed through to the provider
as body parameters.
@param maxRetries - Maximum number of retries. Set to 0 to disable retries. Default: 2.
@param abortSignal - An optional abort signal that can be used to cancel the call.
@param headers - Additional HTTP headers to be sent with the request. Only applicable for HTTP-based providers.

@returns A result object that contains the generated images.
 */
export async function generateImage({
  model,
  prompt,
  n = 1,
  size,
  aspectRatio,
  seed,
  providerOptions,
  maxRetries,
  abortSignal,
  headers,
}: {
  model: ActionV1;
  prompt: string;
  n?: number;
  size?: `${number}x${number}`;
  aspectRatio?: `${number}:${number}`;
  seed?: number;
  providerOptions?: ProviderOptions;
  maxRetries?: number;
  abortSignal?: AbortSignal;
  headers?: Record<string, string>;
}): Promise<GenerateImageResult> {
  const headersWithUserAgent = withUserAgentSuffix(
    headers ?? {},
    `ai/${VERSION}`,
  );

  const { retry } = prepareRetries({
    maxRetries: maxRetries,
    abortSignal,
  });

  const response = await retry(async () => {
    return await execute({
      type: 'image.generate',
      model,
      input: prompt,
      parameters: {
        n,
        size,
        aspectRatio,
        seed,
      },
      stream: false,
      providerOptions,
      headers: headersWithUserAgent,
    });
  });

  // Type assertion since we know this is an image generation response
  const imageResponse = response as { images: Array<{ base64?: string; url?: string; data?: Uint8Array }>; warnings?: Array<{ type: string; message: string }>; providerMetadata?: any };

  const images: Array<DefaultGeneratedFile> = imageResponse.images.map(
    (image: { base64?: string; url?: string; data?: Uint8Array }) => {
      let data: string | Uint8Array;
      let mediaType: string | undefined;

      if (image.data) {
        data = image.data;
        mediaType = detectMediaType({
          data: image.data,
          signatures: imageMediaTypeSignatures,
        }) ?? 'image/png';
      } else if (image.base64) {
        data = Buffer.from(image.base64, 'base64');
        mediaType = detectMediaType({
          data: data,
          signatures: imageMediaTypeSignatures,
        }) ?? 'image/png';
      } else if (image.url) {
        data = image.url;
        mediaType = undefined; // Will be detected when loaded
      } else {
        throw new Error('Image data is missing');
      }

      return new DefaultGeneratedFile({
        data,
        mediaType: mediaType ?? 'image/png',
      });
    }
  );

  const warnings: Array<ImageGenerationWarning> = (imageResponse.warnings || []).map(w => ({
    type: 'other' as const,
    message: w.message,
  }));
  const responses: Array<ImageModelResponseMetadata> = []; // Will be populated by provider
  const providerMetadata: any = imageResponse.providerMetadata || {};

  logWarnings(warnings);

  if (!images.length) {
    throw new NoImageGeneratedError({ responses });
  }

  return new DefaultGenerateImageResult({
    images,
    warnings,
    responses,
    providerMetadata,
  });
}

class DefaultGenerateImageResult implements GenerateImageResult {
  readonly images: Array<GeneratedFile>;
  readonly warnings: Array<ImageGenerationWarning>;
  readonly responses: Array<ImageModelResponseMetadata>;
  readonly providerMetadata: any;

  constructor(options: {
    images: Array<GeneratedFile>;
    warnings: Array<ImageGenerationWarning>;
    responses: Array<ImageModelResponseMetadata>;
    providerMetadata: any;
  }) {
    this.images = options.images;
    this.warnings = options.warnings;
    this.responses = options.responses;
    this.providerMetadata = options.providerMetadata;
  }

  get image() {
    return this.images[0];
  }
}
