import { useProviderContext } from '@/context/provider-context';
import { cn } from '@/utils';
import { Tag } from '@carbon/react';
import type { HTMLAttributes } from 'react';
import { useMemo } from 'react';

type ToolProviderLike = {
  getId: () => string;
  getImage: () => string;
  getName: () => string;
};

interface ToolProviderPillProps extends HTMLAttributes<HTMLSpanElement> {
  toolProvider?: ToolProviderLike;
  toolProviderId?: string;
}

export function ToolProviderPill({
  toolProvider,
  toolProviderId,
  className,
  onClick,
}: ToolProviderPillProps) {
  const { toolProviders = [] } = useProviderContext() as ReturnType<
    typeof useProviderContext
  > & {
    toolProviders?: ToolProviderLike[];
  };

  const currentTool = useMemo(
    () =>
      toolProvider ||
      toolProviders.find(provider => provider.getId() === toolProviderId) ||
      null,
    [toolProvider, toolProviderId, toolProviders],
  );

  const label = currentTool?.getName() || toolProviderId || 'Unknown tool';

  return (
    <Tag
      size="md"
      type="blue"
      onClick={onClick}
      className={cn('!inline-flex !max-w-full !items-center', className)}
    >
      <span className="flex min-w-0 items-center gap-1.5">
        {currentTool?.getImage() && (
          <img
            alt={currentTool.getName()}
            src={currentTool.getImage()}
            className="h-4 w-4 shrink-0"
          />
        )}
        <span className="truncate">{label}</span>
      </span>
    </Tag>
  );
}
