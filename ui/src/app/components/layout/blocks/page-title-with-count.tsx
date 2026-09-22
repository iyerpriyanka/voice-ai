import type { HTMLAttributes, ReactNode } from 'react';
import { PageTitleBlock } from '@/app/components/layout/blocks/page-title-block';
import { cn } from '@/utils';

interface PageTitleWithCountProps extends HTMLAttributes<HTMLDivElement> {
  count: number;
  total: number;
  children: ReactNode;
}

export function PageTitleWithCount({
  count,
  total,
  children,
  className,
  ...attributes
}: PageTitleWithCountProps) {
  return (
    <div {...attributes} className={cn('flex items-center gap-3', className)}>
      <PageTitleBlock>{children}</PageTitleBlock>
      <span
        aria-label={`${count} of ${total}`}
        className="text-xs tabular-nums text-muted"
      >
        {count}/{total}
      </span>
    </div>
  );
}
