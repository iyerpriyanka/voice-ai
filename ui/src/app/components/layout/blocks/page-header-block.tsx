import type { FC, HTMLAttributes } from 'react';
import { cn } from '@/utils';

export const PageHeaderBlock: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...attributes
}) => {
  return (
    <div
      {...attributes}
      className={cn(
        'flex h-12 shrink-0 items-center justify-between border-b border-border-subtle bg-shell pl-4 pr-0',
        className,
      )}
    >
      {children}
    </div>
  );
};
