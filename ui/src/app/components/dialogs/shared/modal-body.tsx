import { cn } from '@/utils';
import type { HTMLAttributes } from 'react';

export function ModalBody({
  className,
  children,
  ...attributes
}: HTMLAttributes<HTMLDivElement>) {
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
}
