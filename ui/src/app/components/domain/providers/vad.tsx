import { VAD } from '@/providers';
import { VADConfigComponent } from '@/app/components/domain/providers/vad/provider';
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

export function VADProvider({
  provider,
  parameters,
  onChangeProvider,
  onChangeParameter,
}: ProviderComponentProps) {
  const providers = useMemo(() => VAD(), []);
  const selectedProvider = providers.find(x => x.code === provider) || null;

  return (
    <Stack gap={6}>
      <Dropdown
        id="vad-provider"
        titleText="VAD provider"
        label="Select VAD provider"
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
        <VADConfigComponent
          provider={provider}
          parameters={parameters}
          onChangeProvider={onChangeProvider}
          onChangeParameter={onChangeParameter}
        />
      )}
    </Stack>
  );
}
