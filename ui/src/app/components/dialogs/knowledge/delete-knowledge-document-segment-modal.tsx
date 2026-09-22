import { useState } from 'react';
import type {
  BaseResponse,
  KnowledgeDocumentSegment,
  ServiceError,
} from '@rapidaai/react';
import { DeleteKnowledgeDocumentSegment } from '@rapidaai/react';
import {
  DangerButton,
  GhostButton,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextArea,
} from '@/app/components/ui/primitives';
import { Notification } from '@/app/components/ui/feedback';
import { useCurrentCredential } from '@/hooks/use-credential';
import { connectionConfig } from '@/configs';

interface DeleteKnowledgeDocumentSegmentDialogProps {
  segment: KnowledgeDocumentSegment;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteKnowledgeDocumentSegmentDialog({
  segment,
  onClose,
  onDelete,
}: DeleteKnowledgeDocumentSegmentDialogProps) {
  const { authId, token, projectId } = useCurrentCredential();
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!reason.trim()) {
      setError('Please provide a reason for deletion.');
      return;
    }
    setError(null);
    DeleteKnowledgeDocumentSegment(
      connectionConfig,
      segment.getDocumentId(),
      segment.getIndex().toString(),
      reason.trim(),
      (err: ServiceError | null, response: BaseResponse | null) => {
        if (err) {
          setError('Failed to delete the segment. Please try again.');
        } else {
          onDelete();
          onClose();
        }
      },
      {
        authorization: token,
        'x-project-id': projectId,
        'x-auth-id': authId,
      },
    );
  };

  return (
    <Modal open={true} onClose={onClose} size="sm" danger>
      <ModalHeader
        label="Knowledge"
        title="Are you sure you want to delete this document segment?"
        onClose={onClose}
      />
      <ModalBody hasForm>
        <TextArea
          id="delete-reason"
          labelText="Reason"
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Please provide a reason for deleting this segment"
          rows={4}
        />
        {error ? (
          <Notification kind="error" title="Error" subtitle={error} />
        ) : null}
      </ModalBody>
      <ModalFooter danger>
        <GhostButton size="md" type="button" onClick={onClose}>
          Cancel
        </GhostButton>
        <DangerButton size="md" type="button" onClick={handleDelete}>
          Delete Segment
        </DangerButton>
      </ModalFooter>
    </Modal>
  );
}
