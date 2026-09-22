import { Metadata } from '@rapidaai/react';
import { loadProviderConfig } from '@/providers/config-loader';
import {
  getDefaultsFromConfig,
  validateFromConfig,
} from '@/providers/config-defaults';
import { ConfigRenderer } from '@/app/components/domain/providers/config-renderer';
import type { VaultCredential } from '@rapidaai/react';
import type { ProviderComponentProps } from '@/app/components/domain/providers/provider-component-props';

type ProviderCredentialRef = string | VaultCredential;

const getProviderCredentialId = (credential: ProviderCredentialRef): string =>
  typeof credential === 'string' ? credential : credential.getId();

export const GetDefaultSpeakerConfig = (
  existing: Metadata[] = [],
): Metadata[] => {
  const defaultConfig = [
    {
      key: 'speaker.ambient',
      value: 'none',
    },
    {
      key: 'speaker.ambient_volume',
      value: '18',
    },
    {
      key: 'speaker.conjunction.boundaries',
      value: '',
    },
    {
      key: 'speaker.conjunction.break',
      value: '240',
    },
    {
      key: 'speaker.pronunciation.dictionaries',
      value: '',
    },
  ];

  const result = [...existing];
  defaultConfig.forEach(item => {
    if (!existing.some(e => e.getKey() === item.key)) {
      const metadata = new Metadata();
      metadata.setKey(item.key);
      metadata.setValue(item.value);
      result.push(metadata);
    }
  });
  return result;
};

export const GetDefaultTextToSpeechIfInvalid = (
  provider: string,
  parameters: Metadata[],
): Metadata[] => {
  const config = loadProviderConfig(provider);
  if (config?.tts)
    return getDefaultsFromConfig(config, 'tts', parameters, provider);
  return parameters;
};

export const ValidateTextToSpeechIfInvalid = (
  provider: string,
  parameters: Metadata[],
  providerCredentials?: ProviderCredentialRef[],
): string | undefined => {
  const config = loadProviderConfig(provider);
  if (!config?.tts) return undefined;

  const validationError = validateFromConfig(
    config,
    'tts',
    provider,
    parameters,
  );
  if (validationError) return validationError;

  if (!providerCredentials) return undefined;

  const credentialID = parameters
    .find(opt => opt.getKey() === 'rapida.credential_id')
    ?.getValue();
  if (!credentialID) {
    return `Please provide a valid ${provider} credential.`;
  }
  if (
    !providerCredentials
      .map(credential => getProviderCredentialId(credential))
      .includes(credentialID)
  ) {
    return `Please select a valid ${provider} credential.`;
  }

  return undefined;
};

export function TextToSpeechConfigComponent({
  provider,
  parameters,
  onChangeParameter,
}: ProviderComponentProps) {
  const config = loadProviderConfig(provider);
  if (!config?.tts) return null;
  return (
    <ConfigRenderer
      provider={provider}
      category="tts"
      config={config.tts}
      parameters={parameters}
      onParameterChange={onChangeParameter}
    />
  );
}
