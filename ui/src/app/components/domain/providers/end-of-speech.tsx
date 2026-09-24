import { EndOfSpeech } from '@/providers';
import { EndOfSpeechConfigComponent } from '@/app/components/domain/providers/end-of-speech/provider';
import { useMemo } from 'react';
import { Dropdown } from '@carbon/react';
import { Stack } from '@/app/components/ui/primitives';
import type {
  ProviderComponentProps,
  ProviderSelectionChange,
} from '@/app/components/domain/providers/provider-component-props';
import type { RapidaProvider } from '@/providers';

const getProviderName = (item: RapidaProvider | null): string =>
  item?.name ?? '';

export function EndOfSpeechProvider({
  provider,
  parameters,
  onChangeProvider,
  onChangeParameter,
}: ProviderComponentProps) {
  const providers = useMemo(() => EndOfSpeech(), []);
  const selectedProvider = providers.find(x => x.code === provider) || null;

  return (
    <Stack gap={6}>
      <Dropdown
        id="eos-provider"
        titleText="End-of-speech provider"
        label="Select end of speech provider"
        items={providers}
        selectedItem={selectedProvider}
        itemToString={getProviderName}
        onChange={({
          selectedItem,
        }: ProviderSelectionChange<RapidaProvider>) => {
          if (selectedItem) onChangeProvider(selectedItem.code);
        }}
      />
      {provider && (
        <EndOfSpeechConfigComponent
          provider={provider}
          parameters={parameters}
          onChangeProvider={onChangeProvider}
          onChangeParameter={onChangeParameter}
        />
      )}
    </Stack>
  );
}
