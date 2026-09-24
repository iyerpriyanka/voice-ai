import { Metadata } from '@rapidaai/react';
import { Dropdown } from '@carbon/react';
import { OPENAI_EMBEDDING_MODEL } from '@/app/components/domain/providers/embedding/openai/constants';
import type { ProviderSelectionChange } from '@/app/components/domain/providers/provider-component-props';

type EmbeddingModel = (typeof OPENAI_EMBEDDING_MODEL)[number];

const getModelName = (item: EmbeddingModel | null): string => item?.name ?? '';

export function ConfigureOpenaiEmbeddingModel({
  onParameterChange,
  parameters,
}: {
  onParameterChange: (parameters: Metadata[]) => void;
  parameters: Metadata[] | null;
}) {
  const currentParameters = parameters ?? [];
  const getParamValue = (key: string) =>
    currentParameters.find(p => p.getKey() === key)?.getValue() ?? '';

  return (
    <Dropdown
      id="openai-embedding-model"
      titleText="Embedding model"
      label="Select embedding model"
      items={OPENAI_EMBEDDING_MODEL}
      selectedItem={OPENAI_EMBEDDING_MODEL.find(
        x =>
          x.id === getParamValue('model.id') &&
          getParamValue('model.name') === x.name,
      )}
      itemToString={getModelName}
      onChange={({ selectedItem }: ProviderSelectionChange<EmbeddingModel>) => {
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
