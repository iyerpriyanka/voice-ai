import { useCallback, useEffect, useState } from 'react';
import type { KnowledgeDocument } from '@rapidaai/react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  PrimaryButton,
  SecondaryButton,
} from '@/app/components/ui/primitives';
import type { ModalProps } from '@/app/components/ui/primitives';
import { ManualFile } from '@/app/pages/knowledge-base/action/components/datasource-uploader/manual-file';
import { useCreateKnowledgeDocumentPageStore } from '@/stores/knowledge/create-knowledge-document.store';
import { useCredential } from '@/hooks/use-credential';
import { useRapidaStore } from '@/stores/app';
import { Notification } from '@/app/components/ui/feedback';

interface CreateKnowledgeDocumentDialogProps extends ModalProps {
  knowledgeId: string;
  onReload: () => void;
}

export function CreateKnowledgeDocumentDialog(
  props: CreateKnowledgeDocumentDialogProps,
) {
  const { knowledgeId, modalOpen, onReload, setModalOpen } = props;
  const [errorMessage, setErrorMessage] = useState('');
  const { clear } = useCreateKnowledgeDocumentPageStore();
  const closeDialog = useCallback(() => setModalOpen(false), [setModalOpen]);

  useEffect(() => {
    clear();
  }, [clear, knowledgeId]);

  const [userId, token, projectId] = useCredential();
  const { loading, showLoader, hideLoader } = useRapidaStore();
  const knowledgeDocumentAction = useCreateKnowledgeDocumentPageStore();

  const onSuccess = useCallback(
    (_documents: KnowledgeDocument[]) => {
      hideLoader();
      closeDialog();
      onReload();
    },
    [closeDialog, hideLoader, onReload],
  );

  const onError = useCallback(
    (e: string) => {
      hideLoader();
      setErrorMessage(e);
    },
    [hideLoader],
  );

  const onCreateKnowledgeDocument = () => {
    setErrorMessage('');
    showLoader('overlay');
    knowledgeDocumentAction.onCreateKnowledgeDocument(
      knowledgeId,
      projectId,
      token,
      userId,
      onSuccess,
      onError,
    );
  };

  return (
    <Modal
      open={modalOpen}
      onClose={closeDialog}
      size="lg"
      containerClassName="!w-[1000px] !max-w-[1000px]"
      preventCloseOnClickOutside
    >
      <ModalHeader
        label="Knowledge"
        title="Add document to knowledge"
        onClose={closeDialog}
      />
      <ModalBody hasForm hasScrollingContent>
        <ManualFile />
        {errorMessage && (
          <Notification kind="error" title="Error" subtitle={errorMessage} />
        )}
      </ModalBody>
      <ModalFooter>
        <SecondaryButton size="lg" onClick={closeDialog}>
          Cancel
        </SecondaryButton>
        <PrimaryButton
          size="lg"
          isLoading={loading}
          onClick={onCreateKnowledgeDocument}
        >
          Create Document
        </PrimaryButton>
      </ModalFooter>
    </Modal>
  );
}
