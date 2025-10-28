import { createAI } from '@omni-stack/rsc';
import { AIState, submitUserMessage, UIState } from './actions';
import { generateId } from '@omni-stack/core';

export const AI = createAI({
  actions: { submitUserMessage },
  initialUIState: [] as UIState,
  initialAIState: { chatId: generateId(), messages: [] } as AIState,
});
