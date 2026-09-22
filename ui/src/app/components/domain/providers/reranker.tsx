import { Metadata } from '@rapidaai/react';
import { ConfigureCohereRerankerModel } from '@/app/components/domain/providers/reranker/cohere';
import { GetCohereRerankerDefaultOptions } from '@/app/components/domain/providers/reranker/cohere/constants';
import { Dropdown } from '@carbon/react';
import { Stack } from '@/app/components/ui/primitives';
import { HelpToggletip } from '@/app/components/domain/providers/help-label';
import { RERANKER_PROVIDER } from '@/providers';
import type {
  ProviderComponentProps,
  ProviderSelectionChange,
} from '@/app/components/domain/providers/provider-component-props';
import type { RapidaProvider } from '@/providers';

const getProviderName = (item: RapidaProvider | null): string =>
  item?.name ?? '';

export const GetDefaultRerankerConfigIfInvalid = (
  provider: string,
  parameters: Metadata[],
): Metadata[] => {
  switch (provider) {
    case 'cohere':
      return GetCohereRerankerDefaultOptions(parameters);
    default:
      return parameters;
  }
};

export function RerankerConfigComponent({
  provider,
  parameters,
  onChangeParameter,
}: ProviderComponentProps) {
  switch (provider) {
    case 'cohere':
      return (
        <ConfigureCohereRerankerModel
          parameters={parameters}
          onParameterChange={onChangeParameter}
        />
      );
    default:
      return null;
  }
}

export function RerankerProvider({
  provider,
  parameters,
  onChangeProvider,
  onChangeParameter,
}: ProviderComponentProps) {
  const selectedProvider =
    RERANKER_PROVIDER.find(x => x.code === provider) || null;

  return (
    <Stack gap={6}>
      <Dropdown
        id="reranker-provider"
        titleText={
          <span className="inline-flex items-center gap-1">
            Reranker provider
            <HelpToggletip
              label="Reranker provider"
              helpText="Select a reranker provider and model for knowledge retrieval ranking."
            />
          </span>
        }
        label="Select reranker provider"
        items={RERANKER_PROVIDER}
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
        <RerankerConfigComponent
          provider={provider}
          parameters={parameters}
          onChangeProvider={onChangeProvider}
          onChangeParameter={onChangeParameter}
        />
      )}
    </Stack>
  );
}
