import type { ModalProps } from '@/app/components/ui/primitives';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/app/components/ui/primitives';
import { PrimaryButton, SecondaryButton } from '@/app/components/ui/primitives';
import { Textarea } from '@/app/components/ui/primitives';
import { Checkmark } from '@carbon/icons-react';
import type { FC } from 'react';
import { useState } from 'react';

export const MessageFeedbackDialog: FC<
  ModalProps & { onSubmitFeedback: (feedback: string) => void }
> = ({ modalOpen, setModalOpen, onSubmitFeedback }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const closeDialog = () => setModalOpen(false);

  return (
    <Modal open={modalOpen} onClose={closeDialog} size="sm">
      <ModalHeader
        title="What can be improved?"
        onClose={closeDialog}
      />
      <ModalBody hasForm>
        <div className="px-4 py-6">
          <p className="mt-1 text-base font-semibold text-foreground">
            Tell us what went wrong or how we can make this answer more helpful.
          </p>
          <div className="mt-4">
            <Textarea
              required
              rows={3}
              placeholder="Your feedback..."
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <SecondaryButton size="lg" onClick={closeDialog}>
          Cancel
        </SecondaryButton>
        <PrimaryButton
          size="lg"
          type="button"
          onClick={() => {
            closeDialog();
            onSubmitFeedback(feedbackText);
          }}
          disabled={!feedbackText.trim()}
          renderIcon={Checkmark}
        >
          Submit feedback
        </PrimaryButton>
      </ModalFooter>
    </Modal>
  );
};
