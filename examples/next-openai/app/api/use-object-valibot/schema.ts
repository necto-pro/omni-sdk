import { DeepPartial } from '@omni-stack/core';
import * as v from 'valibot';

// define a schema for the notifications
export const notificationSchema = v.object({
  notifications: v.array(
    v.object({
      name: v.string(),
      message: v.string(),
      minutesAgo: v.number(),
    }),
  ),
});

// define a type for the partial notifications during generation
export type PartialNotification = DeepPartial<typeof notificationSchema>;
