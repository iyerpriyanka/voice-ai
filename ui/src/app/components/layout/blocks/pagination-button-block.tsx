import type { FC, HTMLAttributes } from 'react';
import { cn } from '@/utils';

export const PaginationButtonBlock: FC<
  HTMLAttributes<HTMLDivElement>
> = ({ className, children, ...attributes }) => {
  return (
    <div
      {...attributes}
      className={cn(
        'flex flex-row divide-x divide-border-subtle',
        className,
      )}
    >
      {children}
    </div>
  );
};
