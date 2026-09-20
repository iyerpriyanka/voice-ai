import type { FC, HTMLAttributes } from 'react';
import { cn } from '@/utils';

export const TableSection: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...attributes
}) => {
  return (
    <div {...attributes} className={cn('flex-1 flex flex-col', className)}>
      {children}
    </div>
  );
};

export const ScrollableTableSection: FC<
  HTMLAttributes<HTMLDivElement>
> = ({ className, children, ...attributes }) => {
  return (
    <div
      {...attributes}
      className={cn('flex-1 min-h-0 overflow-auto', className)}
    >
      {children}
    </div>
  );
};
