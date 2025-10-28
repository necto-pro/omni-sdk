// @ts-nocheck
import { LanguageModelV2 } from '@omni-stack/provider';
import { LanguageModelV2 } from '@omni-stack/provider';
import { LanguageModelV2Middleware } from '@omni-stack/provider';
import { LanguageModelV2Middleware } from '@omni-stack/provider';
import { someOtherFunction } from '@omni-stack/core';

// Multiple imports in one declaration
import {
  LanguageModelV2 as LMV1Multi,
  LanguageModelV2 as LMV2Multi,
  LanguageModelV2Middleware as LMV1MiddlewareMulti,
  LanguageModelV2Middleware as LMV2MiddlewareMulti,
} from '@omni-stack/provider';

import { anotherFunction } from '@omni-stack/core';

// Import with alias
import { LanguageModelV2 as LMV1 } from '@omni-stack/provider';

// Mixed imports
import { LanguageModelV2 as LMV1Mixed } from '@omni-stack/provider';

import { generateText } from '@omni-stack/core';

// Should not affect other packages
import { LanguageModelV1 as LMV1Other } from 'some-other-package';
import { LanguageModelV2 as LMV2Other } from 'another-package';
