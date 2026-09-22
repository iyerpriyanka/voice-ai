import { loadProviderConfig } from '@/providers/config-loader';
import { getDefaultsFromConfig } from '@/providers/config-defaults';
import { Metadata } from '@rapidaai/react';
import { ConfigRenderer } from '@/app/components/domain/providers/config-renderer';
import type { ProviderComponentProps } from '@/app/components/domain/providers/provider-component-props';

const upsertScopedProvider = (
  parameters: Metadata[],
  scopePrefix: string,
  key: string,
  value: string,
): Metadata[] => {
  const nonScoped = parameters.filter(p => !p.getKey().startsWith(scopePrefix));
  const scoped = parameters.filter(
    p => p.getKey().startsWith(scopePrefix) && p.getKey() !== key,
  );

  const providerMetadata = new Metadata();
  providerMetadata.setKey(key);
  providerMetadata.setValue(value);

  return [...nonScoped, providerMetadata, ...scoped];
};

export const GetDefaultVADConfig = (
  provider: string,
  current: Metadata[],
): Metadata[] => {
  const config = loadProviderConfig(provider);
  if (!config?.vad) return current;
  const defaults = getDefaultsFromConfig(config, 'vad', current, provider, {
    includeCredential: false,
    replacePrefix: 'microphone.vad.',
  });
  return upsertScopedProvider(
    defaults,
    'microphone.vad.',
    'microphone.vad.provider',
    provider,
  );
};

export function VADConfigComponent({
  provider,
  parameters,
  onChangeParameter,
}: ProviderComponentProps) {
  const config = loadProviderConfig(provider);
  if (!config?.vad) return null;

  return (
    <ConfigRenderer
      provider={provider}
      category="vad"
      config={config.vad}
      parameters={parameters}
      onParameterChange={onChangeParameter}
    />
  );
}
