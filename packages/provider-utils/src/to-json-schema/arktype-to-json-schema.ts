import { JSONSchema7 } from '@omni-stack/provider';

export const arktypeToJsonSchema = (schema: unknown) => (): JSONSchema7 => {
  return (schema as any).toJsonSchema();
};
