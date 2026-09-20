import { useSidebar } from '@/context/sidebar-context';
import { cn } from '@/utils';
import type { FC, HTMLAttributes, MouseEvent } from 'react';

export interface AsideProps extends HTMLAttributes<HTMLElement> {}

export const Aside: FC<AsideProps> = ({
  className,
  children,
  onMouseEnter,
  onMouseLeave,
  ...attributes
}) => {
  const { open, setOpen } = useSidebar();

  const handleMouseEnter = (event: MouseEvent<HTMLElement>) => {
    onMouseEnter?.(event);
    setOpen(true);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLElement>) => {
    onMouseLeave?.(event);
    setOpen(false);
  };

  return (
    <aside
      {...attributes}
      className={cn(
        'flex flex-col shrink-0 z-12',
        'bg-shell text-foreground',
        'border-r border-border-subtle',
        'no-scrollbar overflow-y-auto',
        'group',
        open ? 'w-64' : 'w-12',
        'h-full transition-[width] duration-200 ease-in-out',
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </aside>
  );
};
