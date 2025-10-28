
import { ActionTransformer, registerAction } from '../actions';

const embeddingAction: ActionTransformer = {
  transformInput: (input: any) => {
    // For embedding, the input is expected to be a single value or an array of values
    if (Array.isArray(input)) {
      return {
        input: input.map(value => ({ content: value })),
      };
    } else {
      return {
        input: [{ content: input }],
      };
    }
  },
  transformOutput: (output: any) => {
    // The output from the provider should be the embedding(s)
    if (output.embeddings && output.embeddings.length > 1) {
      return { embeddings: output.embeddings };
    }
    return { embedding: output.embeddings[0] };
  },
  validateInput: (input: any) => {
    // Any input is valid for embedding for now
    return true;
  },
  validateOutput: (output: any) => {
    // The output should contain embeddings
    return output && output.embeddings && Array.isArray(output.embeddings);
  }
};

registerAction('embedding.create', embeddingAction);
