import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils';

export interface DeploymentRowProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  children: ReactNode;
}

export function DeploymentRow({
  className,
  label,
  children,
  ...attributes
}: DeploymentRowProps) {
  return (
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
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

export interface DeploymentSectionHeaderProps
  extends HTMLAttributes<HTMLDivElement> {
  label: string;
}

export function DeploymentSectionHeader({
  className,
  label,
  ...attributes
}: DeploymentSectionHeaderProps) {
  return (
    <div
      {...attributes}
      className={cn('flex h-9 items-center bg-layer px-4', className)}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
        {label}
      </span>
    </div>
  );
}
