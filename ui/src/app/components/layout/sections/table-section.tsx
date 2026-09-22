import type { HTMLAttributes } from 'react';
import { cn } from '@/utils';

export function TableSection({
  className,
  children,
  ...attributes
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...attributes} className={cn('flex-1 flex flex-col', className)}>
      {children}
    </div>
  );
}

export function ScrollableTableSection({
  className,
  children,
  ...attributes
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...attributes}
      className={cn('flex-1 min-h-0 overflow-auto', className)}
    >
      {children}
    </div>
  );
}
