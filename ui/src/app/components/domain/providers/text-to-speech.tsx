import { CredentialDropdown } from '@/app/components/domain/dropdowns/credential-dropdown';
import { TextToSpeechConfigComponent } from '@/app/components/domain/providers/text-to-speech/provider';
import { TEXT_TO_SPEECH_PROVIDER } from '@/providers';
import { Metadata } from '@rapidaai/react';
import { useCallback } from 'react';
import { Dropdown } from '@carbon/react';
import { Stack } from '@/app/components/ui/primitives';
import { HelpToggletip } from '@/app/components/domain/providers/help-label';
import type { VaultCredential } from '@rapidaai/react';
import type {
  ProviderComponentProps,
  ProviderSelectionChange,
} from '@/app/components/domain/providers/provider-component-props';
import type { RapidaProvider } from '@/providers';

const getProviderName = (item: RapidaProvider | null): string =>
  item?.name ?? '';

export function TextToSpeechProvider({
  provider,
  parameters,
  onChangeProvider,
  onChangeParameter,
}: ProviderComponentProps) {
  const getParamValue = useCallback(
    (key: string) => parameters.find(p => p.getKey() === key)?.getValue() ?? '',
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
    TEXT_TO_SPEECH_PROVIDER.find(x => x.code === provider) || null;

  return (
    <Stack gap={6}>
      <Dropdown
        id="tts-provider"
        titleText={
          <span className="inline-flex items-center gap-1">
            Voice output provider
            <HelpToggletip
              label="Voice output provider"
              helpText="Select a text-to-speech provider for generated assistant audio."
            />
          </span>
        }
        label="Select voice output provider"
        items={TEXT_TO_SPEECH_PROVIDER}
        selectedItem={selectedProvider}
        itemToString={getProviderName}
        onChange={({
          selectedItem,
        }: ProviderSelectionChange<RapidaProvider>) => {
          if (selectedItem) onChangeProvider(selectedItem.code);
        }}
      />
      {provider && (
        <CredentialDropdown
          onChangeCredential={(c: VaultCredential) => {
            updateParameter('rapida.credential_id', c.getId());
          }}
          currentCredential={getParamValue('rapida.credential_id')}
          provider={provider}
        />
      )}
      {provider && (
        <div className="grid grid-cols-3 gap-x-6 gap-y-3">
          <TextToSpeechConfigComponent
            parameters={parameters}
            provider={provider}
            onChangeParameter={onChangeParameter}
            onChangeProvider={onChangeProvider}
          />
        </div>
      )}
    </Stack>
  );
}
