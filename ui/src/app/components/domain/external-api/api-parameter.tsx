import { KeyValueTable } from './key-value-table';
import type { KeyValueRow } from './key-value-table';

interface ApiParameterProps {
  inputClass?: string;
  initialValues: KeyValueRow[];
  setParameterValue: (params: KeyValueRow[]) => void;
  actionButtonLabel?: string;
}

export function ApiParameter({
  initialValues,
  setParameterValue,
  actionButtonLabel = 'Add new pair',
}: ApiParameterProps) {
  const emptyLabel = actionButtonLabel.replace(/^Add\s+/i, '').toLowerCase();

  return (
    <KeyValueTable
      addButtonLabel={actionButtonLabel}
      emptyLabel={emptyLabel}
      keyInputPrefix="api-param-key"
      rows={initialValues}
      valueInputPrefix="api-param-val"
      onChange={setParameterValue}
    />
  );
}

export const APiParameter = ApiParameter;
