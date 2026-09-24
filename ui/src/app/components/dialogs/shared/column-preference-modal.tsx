import React, { useEffect, useState } from 'react';
import { ErrorMessage } from '@/app/components/ui/feedback/error-message';
import {
  Checkbox,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  PrimaryButton,
  SecondaryButton,
  Stack,
} from '@/app/components/ui/primitives';
import { RadioButton, RadioButtonGroup } from '@carbon/react';

type TableColumnPreference = {
  name: string;
  key: string;
  visible: boolean;
};

interface TablePreferenceModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultPageSize: number[];
  columns: TableColumnPreference[];
  onChangeColumns: (columns: TableColumnPreference[]) => void;
  pageSize: number;
  onChangePageSize: (size: number) => void;
}

export function ColumnPreferencesDialog({
  open,
  setOpen,
  defaultPageSize,
  columns,
  onChangeColumns,
  pageSize,
  onChangePageSize,
}: TablePreferenceModalProps) {
  const [selectedPageSize, setSelectedPageSize] = useState(pageSize);
  const [selectedColumns, setSelectedColumns] = useState<
    TableColumnPreference[]
  >([]);
  const [error, setError] = useState('');
  const closeDialog = () => setOpen(false);

  useEffect(() => {
    setSelectedPageSize(pageSize);
  }, [pageSize]);

  useEffect(() => {
    setSelectedColumns(columns);
  }, [columns]);

  const changeVisibility = (key: string) => {
    setSelectedColumns(currentColumns =>
      currentColumns.map(column =>
        column.key === key ? { ...column, visible: !column.visible } : column,
      ),
    );
  };

  const onAction = () => {
    const visibleColumns = selectedColumns.filter(column => column.visible);
    if (visibleColumns.length < 1 && selectedColumns.length > 0) {
      setError('Select at least one visible column');
      return;
    }
    onChangePageSize(selectedPageSize);
    onChangeColumns(selectedColumns);
    closeDialog();
  };

  return (
    <Modal open={open} onClose={closeDialog} size="sm">
      <ModalHeader
        label="Table Settings"
        title="Column Preferences"
        onClose={closeDialog}
      />
      <ModalBody>
        <Stack gap={6}>
          {selectedColumns.length > 0 && (
            <FormGroup legendText="Visible Columns">
              <Stack gap={3}>
                {selectedColumns.map(column => (
                  <Checkbox
                    key={column.key}
                    id={`col-pref-${column.key}`}
                    labelText={column.name}
                    checked={column.visible}
                    onChange={() => changeVisibility(column.key)}
                  />
                ))}
              </Stack>
            </FormGroup>
          )}
          <FormGroup legendText="Page Size">
            <RadioButtonGroup
              name="page-size"
              valueSelected={String(selectedPageSize)}
              onChange={(value: string | number | undefined) => {
                if (value !== undefined) setSelectedPageSize(Number(value));
              }}
              orientation="vertical"
            >
              {defaultPageSize.map(sz => (
                <RadioButton
                  key={sz}
                  id={`page-size-${sz}`}
                  value={String(sz)}
                  labelText={`${sz} Items`}
                />
              ))}
            </RadioButtonGroup>
          </FormGroup>
          <ErrorMessage message={error} />
        </Stack>
      </ModalBody>
      <ModalFooter>
        <SecondaryButton size="lg" onClick={closeDialog}>
          Cancel
        </SecondaryButton>
        <PrimaryButton size="lg" onClick={onAction}>
          Save Preference
        </PrimaryButton>
      </ModalFooter>
    </Modal>
  );
}
