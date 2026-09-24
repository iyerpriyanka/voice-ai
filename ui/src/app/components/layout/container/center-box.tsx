import type { HTMLAttributes } from 'react';
import { cn } from '@/utils';

export function CenterBox({
  children,
  className,
  ...attributes
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...attributes}
      className={cn(
        'grid min-h-dvh grid-cols-[1fr_2.5rem_minmax(0,var(--container-2xl))_2.5rem_1fr] grid-rows-[1fr_auto_1fr] overflow-clip bg-surface text-foreground',
        className,
      )}
    >
      <div className="col-start-2 row-span-full row-start-1 border-x border-border-subtle" />
      <div className="col-start-4 row-span-full border-x border-border-subtle" />
      <main className="col-start-3 row-start-2 grid grid-cols-1 border-y border-border-subtle">
        <div className="grid! grid-cols-1! items-center! bg-surface p-10!">
          <div className="grid w-full grid-cols-1 gap-10">{children}</div>
        </div>
      </main>
    </div>
  );
}
