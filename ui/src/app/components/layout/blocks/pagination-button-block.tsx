import type { HTMLAttributes } from 'react';
import { cn } from '@/utils';

export function PaginationButtonBlock({
  className,
  children,
  ...attributes
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...attributes}
      className={cn('flex flex-row divide-x divide-border-subtle', className)}
    >
      {children}
    </div>
  );
}
