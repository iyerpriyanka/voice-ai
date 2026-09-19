import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/app/components/ui/primitives';
import React, { FC } from 'react';
import { ModalProps } from '@/app/components/ui/primitives';
import { Button } from '@carbon/react';
import { Checkmark } from '@carbon/icons-react';

export const HowItWorksDialog: FC<
  ModalProps & {
    steps: Array<{
      title: string;
      icon: React.ReactElement;
      description: string;
    }>;
    title?: string;
    className?: string;
  }
> = ({
  modalOpen,
  setModalOpen,
  steps,
  title = 'How it works',
  className = 'w-[800px]',
}) => (
  <Modal
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    size="lg"
    containerClassName={className}
  >
    <ModalHeader title={title} onClose={() => setModalOpen(false)} />
    <HowItWorks steps={steps} />
    <ModalFooter>
      <Button
        type="button"
        kind="primary"
        size="md"
        renderIcon={Checkmark}
        onClick={() => setModalOpen(false)}
      >
        Got it
      </Button>
    </ModalFooter>
  </Modal>
);

export const HowItWorks: FC<{
  steps: Array<{
    title: string;
    icon: React.ReactElement;
    description: string;
  }>;
}> = React.memo(({ steps }) => {
  return (
    <ModalBody>
      <div className="grid grid-flow-col divide-x divide-gray-200 dark:divide-gray-800 -mx-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col px-8">
            {/* Step indicator row */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[10px] font-medium tracking-[0.08em] text-gray-400 dark:text-gray-500 tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="w-px h-3 bg-gray-300 dark:bg-gray-700" />
              <div className="text-primary [&_svg]:w-4 [&_svg]:h-4">
                {step.icon}
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 leading-snug">
              {step.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </ModalBody>
  );
});
