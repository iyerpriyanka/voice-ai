import { Metadata } from '@rapidaai/react';
import {
  GetCohereEmbeddingDefaultOptions,
  ValidateCohereEmbeddingDefaultOptions,
} from '@/app/components/domain/providers/embedding/cohere/constants';
import {
  GetGeminiEmbeddingDefaultOptions,
  ValidateGeminiEmbeddingDefaultOptions,
} from '@/app/components/domain/providers/embedding/gemini/constants';
import {
  GetOpenaiEmbeddingDefaultOptions,
  ValidateOpenaiEmbeddingDefaultOptions,
} from '@/app/components/domain/providers/embedding/openai/constants';
import {
  GetVoyageEmbeddingDefaultOptions,
  ValidateVoyageEmbeddingDefaultOptions,
} from '@/app/components/domain/providers/embedding/voyageai/constants';

export const GetDefaultEmbeddingConfigIfInvalid = (
  provider: string,
  parameters: Metadata[],
): Metadata[] => {
  switch (provider) {
    case 'cohere':
      return GetCohereEmbeddingDefaultOptions(parameters);
    case 'openai':
      return GetOpenaiEmbeddingDefaultOptions(parameters);
    case 'gemini':
      return GetGeminiEmbeddingDefaultOptions(parameters);
    case 'voyageai':
      return GetVoyageEmbeddingDefaultOptions(parameters);
    default:
      return parameters;
  }
};

export const ValidateEmbeddingDefaultOptions = (
  provider: string,
  parameters: Metadata[],
): string | undefined => {
  switch (provider) {
    case 'cohere':
      return ValidateCohereEmbeddingDefaultOptions(parameters);
    case 'openai':
      return ValidateOpenaiEmbeddingDefaultOptions(parameters);
    case 'gemini':
      return ValidateGeminiEmbeddingDefaultOptions(parameters);
    case 'voyageai':
      return ValidateVoyageEmbeddingDefaultOptions(parameters);
    default:
      return 'Please select a valid provider and model for embedding';
  }
};
