import type { HTMLAttributes } from 'react';
import { cn } from '@/utils';

export function SidebarIconWrapper({
  className,
  children,
  ...attributes
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...attributes}
      className={cn(
        'flex h-8 w-12 flex-shrink-0 items-center justify-center',
        '[&_svg]:w-5 [&_svg]:h-5',
        className,
      )}
    >
      {children}
    </div>
  );
}
