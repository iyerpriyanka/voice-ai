import type { ModalProps } from '@/app/components/ui/primitives';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  PrimaryButton,
  SecondaryButton,
  Stack,
  TextInput,
  TextArea,
} from '@/app/components/ui/primitives';
import { Notification } from '@/app/components/ui/feedback';
import { useRapidaStore } from '@/stores/app';
import { useEffect, useState } from 'react';

interface UpdateDescriptionDialogProps extends ModalProps {
  title?: string;
  name?: string;
  description?: string;
  onUpdateDescription: (
    name: string,
    description: string,
    onError: (err: string) => void,
    onSuccess: () => void,
  ) => void;
}

export function UpdateDescriptionDialog(props: UpdateDescriptionDialogProps) {
  const {
    title = 'Edit details',
    modalOpen,
    setModalOpen,
    onUpdateDescription: updateDescription,
  } = props;
  const [error, setError] = useState('');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const rapidaStore = useRapidaStore();
  const closeDialog = () => setModalOpen(false);

  useEffect(() => {
    if (props.name) setName(props.name);
    if (props.description) setDescription(props.description);
  }, [props.name, props.description]);

  const onUpdateDescription = () => {
    rapidaStore.showLoader('overlay');
    updateDescription(
      name,
      description,
      err => {
        rapidaStore.hideLoader();
        setError(err);
      },
      () => {
        rapidaStore.hideLoader();
        closeDialog();
      },
    );
  };

  return (
    <Modal open={modalOpen} onClose={closeDialog} size="sm">
      <ModalHeader label="Details" title={title} onClose={closeDialog} />
      <ModalBody hasForm>
        <Stack gap={6}>
          <TextInput
            id="edit-name"
            labelText="Name"
            value={name}
            placeholder="e.g. emotion detector"
            onChange={e => setName(e.target.value)}
          />
          <TextArea
            id="edit-description"
            labelText="Description"
            rows={4}
            value={description}
            placeholder="Provide a readable description and how to use it."
            onChange={e => setDescription(e.target.value)}
          />
          {error && (
            <Notification kind="error" title="Error" subtitle={error} />
          )}
        </Stack>
      </ModalBody>
      <ModalFooter>
        <SecondaryButton size="lg" onClick={closeDialog}>
          Cancel
        </SecondaryButton>
        <PrimaryButton
          size="lg"
          onClick={onUpdateDescription}
          isLoading={rapidaStore.loading}
        >
          Save changes
        </PrimaryButton>
      </ModalFooter>
    </Modal>
  );
}
