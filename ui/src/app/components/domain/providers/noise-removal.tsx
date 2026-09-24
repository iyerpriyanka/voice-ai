import { useMemo } from 'react';
import { NoiseCancellation } from '@/providers';
import { NoiseCancellationConfigComponent } from '@/app/components/domain/providers/noise-removal/provider';
import { Dropdown } from '@carbon/react';
import { Stack } from '@/app/components/ui/primitives';
import type { HTMLAttributes } from 'react';
import type { Metadata } from '@rapidaai/react';
import type { RapidaProvider } from '@/providers';
import type { ProviderSelectionChange } from '@/app/components/domain/providers/provider-component-props';

interface NoiseCancellationProviderProps
  extends HTMLAttributes<HTMLDivElement> {
  noiseCancellationProvider?: string;
  onChangeNoiseCancellationProvider: (v: string) => void;
  parameters?: Metadata[];
  onChangeParameter?: (parameters: Metadata[]) => void;
}

const getProviderName = (item: RapidaProvider | null): string =>
  item?.name ?? '';

export function NoiseCancellationProvider({
  noiseCancellationProvider,
  onChangeNoiseCancellationProvider,
  parameters,
  onChangeParameter,
}: NoiseCancellationProviderProps) {
  const providers = useMemo(() => NoiseCancellation(), []);
  const selectedProvider =
    providers.find(x => x.code === noiseCancellationProvider) || null;

  return (
    <Stack gap={6}>
      <Dropdown
        id="noise-provider"
        titleText="Background noise provider"
        label="Select noise removal provider"
        items={providers}
        selectedItem={selectedProvider}
        itemToString={getProviderName}
        onChange={({
          selectedItem,
        }: ProviderSelectionChange<RapidaProvider>) => {
          if (selectedItem)
            onChangeNoiseCancellationProvider(selectedItem.code);
        }}
      />
      {noiseCancellationProvider && parameters && onChangeParameter && (
        <NoiseCancellationConfigComponent
          provider={noiseCancellationProvider}
          parameters={parameters}
          onChangeParameter={onChangeParameter}
          onChangeProvider={onChangeNoiseCancellationProvider}
        />
      )}
    </Stack>
  );
}
