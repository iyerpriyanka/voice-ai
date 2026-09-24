import { Tag } from '@carbon/react';
import { Ai } from '@carbon/icons-react';

const providerLabels: Record<string, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  google: 'Google',
  gemini: 'Gemini',
  azure: 'Azure',
  'azure-openai': 'Azure OpenAI',
  groq: 'Groq',
  mistral: 'Mistral',
  cohere: 'Cohere',
  deepseek: 'DeepSeek',
  'custom-tts': 'Custom TTS',
  'custom-stt': 'Custom STT',
};

interface ProviderTagProps {
  provider?: string;
}

const getProviderLabel = (provider?: string) => {
  const providerId = provider?.trim();

  if (!providerId) {
    return 'Unknown';
  }

  return providerLabels[providerId.toLowerCase()] || providerId;
};

export function ProviderTag({ provider }: ProviderTagProps) {
  return (
    <Tag
      size="md"
      type="cool-gray"
      renderIcon={Ai}
      className="!whitespace-nowrap"
    >
      {getProviderLabel(provider)}
    </Tag>
  );
}
