// @ts-nocheck
import { LanguageModelV2 } from '@open-stack/provider';
import { LanguageModelV2 } from '@open-stack/provider';
import { LanguageModelV2Middleware } from '@open-stack/provider';
import { LanguageModelV2Middleware } from '@open-stack/provider';
import { someOtherFunction } from 'ai';

// Multiple imports in one declaration
import {
  LanguageModelV2 as LMV1Multi,
  LanguageModelV2 as LMV2Multi,
  LanguageModelV2Middleware as LMV1MiddlewareMulti,
  LanguageModelV2Middleware as LMV2MiddlewareMulti,
} from '@open-stack/provider';

import { anotherFunction } from 'ai';

// Import with alias
import { LanguageModelV2 as LMV1 } from '@open-stack/provider';

// Mixed imports
import { LanguageModelV2 as LMV1Mixed } from '@open-stack/provider';

import { generateText } from 'ai';

// Should not affect other packages
import { LanguageModelV1 as LMV1Other } from 'some-other-package';
import { LanguageModelV2 as LMV2Other } from 'another-package';
