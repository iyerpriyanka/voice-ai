import type { FC, HTMLAttributes } from 'react';
import { cn } from '@/utils';

interface SectionDividerProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
}

export const SectionDivider: FC<SectionDividerProps> = ({
  label,
  className,
  ...attributes
}) => (
  <div
    {...attributes}
    className={cn('flex items-center gap-3', className)}
    role="separator"
  >
    <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
      {label}
    </span>
    <div className="h-px flex-1 bg-border-subtle" />
  </div>
);
