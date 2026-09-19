import { IconOnlyButton } from '@/app/components/ui/button';
import { ModalHeader, ModalProps } from '@/app/components/ui/modal';
import type { FC, HTMLAttributes, ReactNode } from 'react';
import useMeasure from 'react-use-measure';
import {
  useDragControls,
  useMotionValue,
  useAnimate,
  motion,
} from 'framer-motion';
import { cn } from '@/utils';
import { Close } from '@carbon/icons-react';

export interface SideModalProps
  extends ModalProps,
    HTMLAttributes<HTMLDivElement> {
  title?: string;
  label?: string;
  children: ReactNode;
  loading?: boolean;
}

export const RightSideModal: FC<SideModalProps> = ({
  title,
  label,
  modalOpen,
  setModalOpen,
  children,
  className,
}) => {
  const [scope, animate] = useAnimate();
  const [drawerRef, { width }] = useMeasure();

  const x = useMotionValue(0);
  const controls = useDragControls();

  const handleClose = async () => {
    animate(scope.current, {
      opacity: [1, 0],
    });
    const xStart = typeof x.get() === 'number' ? x.get() : 0;
    await animate('#drawer', {
      x: [xStart, width],
    });

    setModalOpen(false);
  };

  return (
    <>
      {modalOpen && (
        <motion.div
          ref={scope}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-neutral-950/70"
        >
          <motion.div
            id="drawer"
            ref={drawerRef}
            onClick={e => e.stopPropagation()}
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            transition={{
              ease: 'easeInOut',
            }}
            className={cn(
              className,
              'absolute right-0 top-0 h-full min-w-80 overflow-hidden bg-white dark:bg-gray-900',
            )}
            style={{ x }}
            drag="x"
            dragControls={controls}
            onDragEnd={() => {
              if (x.get() >= 100) {
                handleClose();
              }
            }}
            dragListener={false}
            dragConstraints={{
              left: 0,
              right: 0,
            }}
            dragElastic={{
              left: 0,
              right: 0.5,
            }}
          >
            <div className="absolute left-0 bottom-0 top-0 z-10 flex justify-center">
              <button
                type="button"
                aria-label="Resize drawer"
                onPointerDown={e => {
                  controls.start(e);
                }}
                className="h-1/2 my-auto w-2 cursor-grab touch-none rounded-[2px] bg-gray-300 dark:bg-slate-700 hover:bg-primary active:cursor-grabbing"
              />
            </div>
            <div className="relative z-0 h-full overflow-auto flex flex-col">
              {title || label ? (
                <ModalHeader
                  title={title}
                  label={label}
                  onClose={handleClose}
                />
              ) : (
                <header className="absolute top-0 z-10 right-0 p-4">
                  <IconOnlyButton
                    kind="ghost"
                    size="sm"
                    iconDescription="Close"
                    renderIcon={Close}
                    onClick={handleClose}
                  />
                </header>
              )}
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
