import { Metadata } from '@rapidaai/react';
import { Dropdown } from '@carbon/react';
import { COHERE_RERANKER_MODEL } from '@/app/components/domain/providers/reranker/cohere/constants';
import type { ProviderSelectionChange } from '@/app/components/domain/providers/provider-component-props';

type RerankerModel = (typeof COHERE_RERANKER_MODEL)[number];

const getModelName = (item: RerankerModel | null): string => item?.name ?? '';

export function ConfigureCohereRerankerModel({
  onParameterChange,
  parameters,
  disabled,
}: {
  onParameterChange: (parameters: Metadata[]) => void;
  parameters: Metadata[] | null;
  disabled?: boolean;
}) {
  const currentParameters = parameters ?? [];
  const getParamValue = (key: string) =>
    currentParameters.find(p => p.getKey() === key)?.getValue() ?? '';

  return (
    <Dropdown
      id="cohere-reranker-model"
      disabled={disabled}
      titleText="Reranker model"
      label="Select reranker model"
      items={COHERE_RERANKER_MODEL}
      selectedItem={COHERE_RERANKER_MODEL.find(
        x =>
          x.id === getParamValue('model.id') &&
          x.name === getParamValue('model.name'),
      )}
      itemToString={getModelName}
      onChange={({ selectedItem }: ProviderSelectionChange<RerankerModel>) => {
        if (!selectedItem) return;
        const updatedParams = [...currentParameters];
        const newIdParam = new Metadata();
        const newNameParam = new Metadata();

        newIdParam.setKey('model.id');
        newIdParam.setValue(selectedItem.id);
        newNameParam.setKey('model.name');
        newNameParam.setValue(selectedItem.name);

        const filteredParams = updatedParams.filter(
          p => p.getKey() !== 'model.id' && p.getKey() !== 'model.name',
        );
        filteredParams.push(newIdParam, newNameParam);
        onParameterChange(filteredParams);
      }}
    />
  );
}
