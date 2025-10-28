import {
  codeInterpreter,
  fileSearch,
  imageGeneration,
} from '@open-stack/openai/internal';

export const azureOpenaiTools: {
  codeInterpreter: typeof codeInterpreter;
  fileSearch: typeof fileSearch;
  imageGeneration: typeof imageGeneration;
} = {
  codeInterpreter,
  fileSearch,
  imageGeneration,
};
