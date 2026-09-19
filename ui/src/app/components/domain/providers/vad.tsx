import { ProviderComponentProps } from '@/app/components/domain/providers/provider-component-props';
import { VAD } from '@/providers';
import { VADConfigComponent } from '@/app/components/domain/providers/vad/provider';
import { useMemo } from 'react';
import { Dropdown } from '@carbon/react';
import { Stack } from '@/app/components/ui/primitives/form';

export const VADProvider: React.FC<ProviderComponentProps> = props => {
  const { provider, onChangeProvider } = props;
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
        itemToString={(item: any) => item?.name || ''}
        onChange={({ selectedItem }: any) => {
          if (selectedItem) onChangeProvider(selectedItem.code);
        }}
      />
      {provider && <VADConfigComponent {...props} />}
    </Stack>
  );
};
