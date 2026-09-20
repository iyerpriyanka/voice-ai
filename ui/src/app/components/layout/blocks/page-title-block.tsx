import type { FC, HTMLAttributes } from 'react';
import { cn } from '@/utils';

export const PageTitleBlock: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...attributes
}) => {
  return (
    <div
      {...attributes}
      className={cn('text-base text-foreground', className)}
    >
      {children}
    </div>
  );
};
