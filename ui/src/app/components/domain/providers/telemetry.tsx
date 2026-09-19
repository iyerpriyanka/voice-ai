import { CredentialDropdown } from '@/app/components/domain/dropdowns/credential-dropdown';
import { ProviderComponentProps } from '@/app/components/domain/providers/provider-component-props';
import {
  GetDefaultTelemetryIfInvalid,
  TelemetryConfigComponent,
} from '@/app/components/domain/providers/telemetry/provider';
import { TELEMETRY_PROVIDER } from '@/providers';
import { Metadata, VaultCredential } from '@rapidaai/react';
import { useCallback } from 'react';
import { Dropdown } from '@carbon/react';
import { Stack } from '@/app/components/ui/primitives/form';
import { HelpToggletip } from '@/app/components/domain/providers/help-label';
import { FormLabel } from '@/app/components/ui/primitives/form-label';

export const TelemetryProvider: React.FC<ProviderComponentProps> = props => {
  const { parameters, provider, onChangeParameter, onChangeProvider } = props;

  const getParamValue = useCallback(
    (key: string) =>
      parameters?.find(p => p.getKey() === key)?.getValue() ?? '',
    [parameters],
  );

  const updateParameter = (key: string, value: string) => {
    const updatedParams = [...(parameters || [])];
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
    TELEMETRY_PROVIDER.find(x => x.code === provider) || null;

  return (
    <Stack gap={6}>
      <div className="inline-flex items-center gap-1">
        <FormLabel htmlFor="telemetry-provider">Telemetry provider</FormLabel>
        <HelpToggletip
          label="Telemetry provider"
          helpText="Select a telemetry provider for assistant observability."
        />
      </div>
      <Dropdown
        id="telemetry-provider"
        titleText=""
        label="Select telemetry provider"
        items={TELEMETRY_PROVIDER}
        selectedItem={selectedProvider}
        itemToString={(item: any) => item?.name || ''}
        onChange={({ selectedItem }: any) => {
          if (!selectedItem) return;
          onChangeProvider(selectedItem.code);
          onChangeParameter(
            GetDefaultTelemetryIfInvalid(selectedItem.code, parameters || []),
          );
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
          <TelemetryConfigComponent {...props} />
        </div>
      )}
    </Stack>
  );
};
