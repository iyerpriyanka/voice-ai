import { allProvider } from '@/providers';
import type { RapidaProvider } from '@/providers';
import { cn } from '@/utils';
import { Tag } from '@carbon/react';
import type { HTMLAttributes } from 'react';
import { useMemo } from 'react';

interface ProviderPillProps extends HTMLAttributes<HTMLSpanElement> {
  provider?: string;
}

export function ProviderPill({
  provider,
  className,
  onClick,
}: ProviderPillProps) {
  const currentProvider = useMemo<RapidaProvider | null>(
    () =>
      provider
        ? allProvider().find(
            item => item.code.toLowerCase() === provider.toLowerCase(),
          ) || null
        : null,
    [provider],
  );

  const label = currentProvider?.name || provider || 'Unknown provider';

  return (
    <Tag
      size="md"
      type="gray"
      onClick={onClick}
      className={cn('!inline-flex !max-w-full !items-center', className)}
    >
      <span className="flex min-w-0 items-center gap-1.5">
        {currentProvider?.image && (
          <img
            alt={currentProvider.name}
            src={currentProvider.image}
            className="h-4 w-4 shrink-0"
          />
        )}
        <span className="truncate">{label}</span>
      </span>
    </Tag>
  );
}
