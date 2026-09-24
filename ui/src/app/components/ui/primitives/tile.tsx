import type { ReactNode } from 'react';
import { Tile as CarbonTile, SkeletonPlaceholder } from '@carbon/react';
import { cn } from '@/utils';

export interface CarbonTileProps {
  children?: ReactNode;
  className?: string;
  isLoading?: boolean;
}

/** Carbon Tile: static content container with optional skeleton loading. */
export function Tile({
  children,
  className,
  isLoading = false,
}: CarbonTileProps) {
  if (isLoading) {
    return <SkeletonPlaceholder className={cn('!w-full', className)} />;
  }

  return <CarbonTile className={cn(className)}>{children}</CarbonTile>;
}
