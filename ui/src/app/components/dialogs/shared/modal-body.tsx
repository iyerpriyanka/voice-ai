import { cn } from '@/utils';
import type { FC, HTMLAttributes } from 'react';

export const ModalBody: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...attributes
}) => {
  return (
    <div
      {...attributes}
      className={cn(
        'flex flex-col gap-6 shrink',
        'relative px-4 py-5',
        className,
      )}
    >
      {children}
    </div>
  );
};
