import { CredentialDropdown } from '@/app/components/domain/dropdowns/credential-dropdown';
import {
  GetDefaultTelemetryIfInvalid,
  TelemetryConfigComponent,
} from '@/app/components/domain/providers/telemetry/provider';
import { TELEMETRY_PROVIDER } from '@/providers';
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

export function TelemetryProvider({
  parameters,
  provider,
  onChangeParameter,
  onChangeProvider,
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
    TELEMETRY_PROVIDER.find(x => x.code === provider) || null;

  return (
    <Stack gap={6}>
      <Dropdown
        id="telemetry-provider"
        titleText={
          <span className="inline-flex items-center gap-1">
            Telemetry provider
            <HelpToggletip
              label="Telemetry provider"
              helpText="Select a telemetry provider for assistant observability."
            />
          </span>
        }
        label="Select telemetry provider"
        items={TELEMETRY_PROVIDER}
        selectedItem={selectedProvider}
        itemToString={getProviderName}
        onChange={({
          selectedItem,
        }: ProviderSelectionChange<RapidaProvider>) => {
          if (!selectedItem) return;
          onChangeProvider(selectedItem.code);
          onChangeParameter(
            GetDefaultTelemetryIfInvalid(selectedItem.code, parameters),
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
          <TelemetryConfigComponent
            parameters={parameters}
            provider={provider}
            onChangeParameter={onChangeParameter}
          />
        </div>
      )}
    </Stack>
  );
}
