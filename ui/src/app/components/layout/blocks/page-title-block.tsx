import type { HTMLAttributes } from 'react';
import { cn } from '@/utils';

export function PageTitleBlock({
  className,
  children,
  ...attributes
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...attributes} className={cn('text-base text-foreground', className)}>
      {children}
    </div>
  );
}
