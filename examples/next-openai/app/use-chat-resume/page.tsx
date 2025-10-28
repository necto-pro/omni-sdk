import { Chat } from './chat';
import { createIdGenerator } from '@omni-stack/core';

const generateId = createIdGenerator({ size: 32 });

export default function Page() {
  const id = generateId();

  return <Chat id={id} autoResume={false} initialMessages={[]} />;
}
