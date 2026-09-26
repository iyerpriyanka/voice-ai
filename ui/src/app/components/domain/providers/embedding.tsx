import { Metadata } from '@rapidaai/react';
import { ConfigureCohereEmbeddingModel } from '@/app/components/domain/providers/embedding/cohere';
import { ConfigureGeminiEmbeddingModel } from '@/app/components/domain/providers/embedding/gemini';
import { ConfigureOpenaiEmbeddingModel } from '@/app/components/domain/providers/embedding/openai';
import { ConfigureVoyageEmbeddingModel } from '@/app/components/domain/providers/embedding/voyageai';
import { useCallback } from 'react';
import { CredentialDropdown } from '@/app/components/domain/dropdowns/credential-dropdown';
import { Dropdown } from '@carbon/react';
import { Stack } from '@/app/components/ui/primitives';
import { HelpToggletip } from '@/app/components/domain/providers/help-label';
import { EMBEDDING_PROVIDERS } from '@/providers';
import type { VaultCredential } from '@rapidaai/react';
import type {
  ProviderComponentProps,
  ProviderSelectionChange,
} from '@/app/components/domain/providers/provider-component-props';
import type { RapidaProvider } from '@/providers';
export {
  GetDefaultEmbeddingConfigIfInvalid,
  ValidateEmbeddingDefaultOptions,
} from '@/providers/embedding-defaults';

/**
 *
 * @param param0
 * @returns
 */
const getProviderName = (item: RapidaProvider | null): string =>
  item?.name ?? '';

export function EmbeddingConfigComponent({
  provider,
  parameters,
  onChangeParameter,
}: ProviderComponentProps) {
  switch (provider) {
    case 'cohere':
      return (
        <ConfigureCohereEmbeddingModel
          parameters={parameters}
          onParameterChange={onChangeParameter}
        />
      );
    case 'openai':
      return (
        <ConfigureOpenaiEmbeddingModel
          parameters={parameters}
          onParameterChange={onChangeParameter}
        />
      );
    case 'voyageai':
      return (
        <ConfigureVoyageEmbeddingModel
          parameters={parameters}
          onParameterChange={onChangeParameter}
        />
      );
    case 'gemini':
      return (
        <ConfigureGeminiEmbeddingModel
          parameters={parameters}
          onParameterChange={onChangeParameter}
        />
      );
    default:
      return null;
  }
}

/**
 *
 * @param props
 * @returns
 */
export function EmbeddingProvider({
  provider,
  parameters,
  onChangeProvider,
  onChangeParameter,
}: ProviderComponentProps) {
  const getParamValue = useCallback(
    (key: string) => {
      return parameters.find(p => p.getKey() === key)?.getValue() ?? '';
    },
    [parameters],
  );

  const updateParameter = (key: string, value: string) => {
    const updatedParams = [...parameters];
    const existingIndex = updatedParams.findIndex(p => p.getKey() === key);
    const newParam = new Metadata();
    newParam.setKey(key);
    newParam.setValue(value);
    if (existingIndex >= 0) {
      updatedParams[existingIndex] = newParam;
    } else {
      updatedParams.push(newParam);
    }
    onChangeParameter(updatedParams);
  };

  const selectedProvider =
    EMBEDDING_PROVIDERS.find(x => x.code === provider) || null;

  return (
    <Stack gap={6}>
      <Dropdown
        id="embedding-provider"
        titleText={
          <span className="inline-flex items-center gap-1">
            Embedding provider
            <HelpToggletip
              label="Embedding provider"
              helpText="Select an embedding provider and model for knowledge retrieval."
            />
          </span>
        }
        label="Select embedding provider"
        items={EMBEDDING_PROVIDERS}
        selectedItem={selectedProvider}
        itemToString={getProviderName}
        onChange={({
          selectedItem,
        }: ProviderSelectionChange<RapidaProvider>) => {
          if (!selectedItem) return;
          onChangeProvider(selectedItem.code);
        }}
      />
      {provider && (
        <EmbeddingConfigComponent
          parameters={parameters}
          provider={provider}
          onChangeParameter={onChangeParameter}
          onChangeProvider={onChangeProvider}
        />
      )}
      {provider && (
        <CredentialDropdown
          onChangeCredential={(c: VaultCredential) => {
            updateParameter('rapida.credential_id', c.getId());
          }}
          currentCredential={getParamValue('rapida.credential_id')}
          provider={provider}
        />
      )}
    </Stack>
  );
}
