import type { HTMLAttributes } from 'react';
import { cn } from '@/utils';

export function BluredWrapper({
  className,
  children,
  ...attributes
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...attributes}
      className={cn(
        'flex items-center justify-between border-b border-border-subtle bg-shell text-foreground',
        className,
      )}
    >
      {children}
    </div>
  );
}
