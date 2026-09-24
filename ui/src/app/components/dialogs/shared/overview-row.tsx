import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils';

export interface OverviewRowProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  children: ReactNode;
}

export const OverviewRow = ({
  className,
  label,
  children,
  ...attributes
}: OverviewRowProps) => (
  <div
    {...attributes}
    className={cn(
      'flex h-12 items-center justify-between gap-4 px-4',
      className,
    )}
  >
    <span className="shrink-0 text-xs font-medium uppercase tracking-[0.08em] text-muted">
      {label}
    </span>
    <div className="flex items-center">{children}</div>
  </div>
);
