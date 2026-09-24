import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/app/components/ui/primitives';
import type { ReactElement } from 'react';
import { memo } from 'react';
import type { ModalProps } from '@/app/components/ui/primitives';
import { Button } from '@carbon/react';
import { Checkmark } from '@carbon/icons-react';

type HowItWorksStep = {
  title: string;
  icon: ReactElement;
  description: string;
};

type HowItWorksDialogProps = ModalProps & {
  steps: HowItWorksStep[];
  title?: string;
  className?: string;
};

export function HowItWorksDialog({
  modalOpen,
  setModalOpen,
  steps,
  title = 'How it works',
  className = 'w-[800px]',
}: HowItWorksDialogProps) {
  return (
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
}

function HowItWorksComponent({ steps }: { steps: HowItWorksStep[] }) {
  return (
    <ModalBody>
      <div className="-mx-8 grid grid-flow-col divide-x divide-border-subtle">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col px-8">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[10px] font-medium tracking-[0.08em] text-muted tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="h-3 w-px bg-border-subtle" />
              <div className="text-primary [&_svg]:w-4 [&_svg]:h-4">
                {step.icon}
              </div>
            </div>
            <h3 className="mb-2 text-sm font-semibold leading-snug text-foreground">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </ModalBody>
  );
}

export const HowItWorks = memo(HowItWorksComponent);
