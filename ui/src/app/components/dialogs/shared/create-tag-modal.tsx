import { memo, useEffect, useState } from 'react';
import type { Tag } from '@rapidaai/react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  PrimaryButton,
  SecondaryButton,
} from '@/app/components/ui/primitives';
import { Notification } from '@/app/components/ui/feedback/notification';
import { TagInput } from '@/app/components/ui/composites/tag-input';
import { KnowledgeTags } from '@/app/components/domain/tags/knowledge-tags';
import { ModalProps } from '@/app/components/ui/primitives/modal';
import { useRapidaStore } from '@/stores/app';

interface CreateTagDialogProps extends ModalProps {
  title: string;
  tags?: string[];
  allTags?: string[];
  onCreateTag: (
    tags: string[],
    onError: (err: string) => void,
    onSuccess: (e: Tag) => void,
  ) => void;
}

function CreateTagDialogComponent({
  title,
  tags,
  allTags,
  onCreateTag,
  setModalOpen,
  modalOpen,
}: CreateTagDialogProps) {
  const [error, setError] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const rapidaStore = useRapidaStore();
  const closeDialog = () => setModalOpen(false);

  const addTag = (tag: string) => {
    setSelectedTags(currentTags => [...currentTags, tag]);
  };

  const removeTag = (tag: string) => {
    setSelectedTags(currentTags =>
      currentTags.filter(currentTag => currentTag !== tag),
    );
  };

  useEffect(() => {
    setSelectedTags(tags ?? []);
  }, [tags]);

  const createTag = () => {
    rapidaStore.showLoader('overlay');
    onCreateTag(
      selectedTags,
      (err: string) => {
        rapidaStore.hideLoader();
        setError(err);
      },
      (_rc: Tag) => {
        rapidaStore.hideLoader();
        closeDialog();
      },
    );
  };

  return (
    <Modal
      open={modalOpen}
      onClose={closeDialog}
      size="sm"
      preventCloseOnClickOutside
    >
      <ModalHeader label="Tags" title={title} onClose={closeDialog} />
      <ModalBody hasForm>
        <TagInput
          tags={selectedTags}
          addTag={addTag}
          removeTag={removeTag}
          allTags={allTags ?? KnowledgeTags}
        />
        {error && <Notification kind="error" title="Error" subtitle={error} />}
      </ModalBody>
      <ModalFooter>
        <SecondaryButton size="lg" onClick={closeDialog}>
          Cancel
        </SecondaryButton>
        <PrimaryButton
          size="lg"
          onClick={createTag}
          isLoading={rapidaStore.loading}
        >
          Save tags
        </PrimaryButton>
      </ModalFooter>
    </Modal>
  );
}

export const CreateTagDialog = memo(CreateTagDialogComponent);
