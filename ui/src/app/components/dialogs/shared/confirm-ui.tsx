import { memo } from 'react';
import {
  DangerButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PrimaryButton,
  SecondaryButton,
} from '@/app/components/ui/primitives';

export type ConfirmDialogProps = {
  showing: boolean;
  type: 'info' | 'warning';
  title: string;
  content: string;
  confirmText?: string;
  onConfirm: () => void;
  cancelText?: string;
  onCancel: () => void;
  onClose: () => void;
};

function ConfirmDialog({
  showing,
  type,
  title,
  content,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onClose,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ConfirmButton = type === 'warning' ? DangerButton : PrimaryButton;

  return (
    <Modal
      danger={type === 'warning'}
      open={showing}
      size="xs"
      onClose={onClose}
    >
      <ModalHeader
        label={type === 'warning' ? 'Warning' : 'Confirm'}
        title={title}
        onClose={onClose}
      />
      <ModalBody>
        <p className="text-sm text-foreground">{content}</p>
      </ModalBody>
      <ModalFooter danger={type === 'warning'}>
        <SecondaryButton size="lg" onClick={onCancel}>
          {cancelText}
        </SecondaryButton>
        <ConfirmButton size="lg" onClick={onConfirm}>
          {confirmText}
        </ConfirmButton>
      </ModalFooter>
    </Modal>
  );
}
export default memo(ConfirmDialog);
