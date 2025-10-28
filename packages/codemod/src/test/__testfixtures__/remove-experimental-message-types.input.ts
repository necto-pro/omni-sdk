// @ts-nocheck
import { CoreMessage, CoreUserMessage, CoreAssistantMessage, CoreToolMessage } from '@omni-stack/core';

function processMessage(message: CoreMessage) {
  console.log(message);
}

function handleUser(msg: CoreUserMessage) {
  console.log(msg);
}

const assistant: CoreAssistantMessage = {
  role: 'assistant',
  content: 'Hello'
};

type ToolHandler = (msg: CoreToolMessage) => void;
