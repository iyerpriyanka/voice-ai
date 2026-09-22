import { ToolProviderPill } from '@/app/components/domain/pills/tool-provider-pill';
import { cn } from '@/utils';
import { Globe } from '@carbon/icons-react';
import { Tag } from '@carbon/react';
import type { HTMLAttributes } from 'react';

interface DocumentSourcePillProps extends HTMLAttributes<HTMLSpanElement> {
  source?: string;
  type?: string;
}

export function DocumentSourcePill({
  source,
  type,
  className,
  onClick,
  children,
}: DocumentSourcePillProps) {
  if (type === 'tool')
    return (
      <ToolProviderPill
        className={cn('text-sm', className)}
        toolProviderId={source}
        onClick={onClick}
      />
    );

  const label = children || type || source || 'Document';

  return (
    <Tag
      size="md"
      type="gray"
      onClick={onClick}
      className={cn('!inline-flex !max-w-full !items-center', className)}
    >
      <span className="flex min-w-0 items-center gap-1.5">
        <Globe className="h-4 w-4 shrink-0" />
        <span className="truncate">{label}</span>
      </span>
    </Tag>
  );
}
