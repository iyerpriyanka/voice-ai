import { memo, type HTMLAttributes } from 'react';
import { cn } from '@/utils';

export interface SingleRowWrapperProps extends HTMLAttributes<HTMLDivElement> {}

function SingleRowWrapperComponent({
  className,
  children,
  ...attributes
}: SingleRowWrapperProps) {
  return (
    <div
      {...attributes}
      className={cn(
        'flex items-center justify-between space-x-1 rounded-[2px] border border-border-subtle bg-layer p-1 text-foreground',
        className,
      )}
    >
      {children}
    </div>
  );
}

const SingleRowWrapper = memo(SingleRowWrapperComponent);

export default SingleRowWrapper;
