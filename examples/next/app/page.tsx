import { generateId } from '@omni-stack/core';
import Chat from './chat/[chatId]/chat';

export default async function ChatPage() {
  return <Chat chatData={{ id: generateId(), messages: [] }} isNewChat />;
}
