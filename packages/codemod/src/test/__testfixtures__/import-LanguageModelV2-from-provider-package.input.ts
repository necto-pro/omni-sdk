// @ts-nocheck
import { LanguageModelV1 } from '@omni-stack/core';
import { LanguageModelV2 } from '@omni-stack/core';
import { LanguageModelV1Middleware } from '@omni-stack/core';
import { LanguageModelV2Middleware } from '@omni-stack/core';
import { someOtherFunction } from '@omni-stack/core';

// Multiple imports in one declaration
import { 
  LanguageModelV1 as LMV1Multi, 
  LanguageModelV2 as LMV2Multi, 
  LanguageModelV1Middleware as LMV1MiddlewareMulti,
  LanguageModelV2Middleware as LMV2MiddlewareMulti,
  anotherFunction 
} from '@omni-stack/core';

// Import with alias
import { LanguageModelV1 as LMV1 } from '@omni-stack/core';

// Mixed imports
import { LanguageModelV1 as LMV1Mixed, generateText } from '@omni-stack/core';

// Should not affect other packages
import { LanguageModelV1 as LMV1Other } from 'some-other-package';
import { LanguageModelV2 as LMV2Other } from 'another-package';
