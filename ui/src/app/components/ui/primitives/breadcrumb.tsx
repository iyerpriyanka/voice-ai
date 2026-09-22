import type { ReactNode } from 'react';
import {
  Breadcrumb as CarbonBreadcrumb,
  BreadcrumbItem as CarbonBreadcrumbItem,
  BreadcrumbSkeleton,
} from '@carbon/react';
import { cn } from '@/utils';

export interface BreadcrumbItemData {
  label: ReactNode;
  href?: string;
  /** Render custom content inside the BreadcrumbItem instead of a plain link. */
  render?: () => ReactNode;
}

export interface CarbonBreadcrumbProps {
  items: BreadcrumbItemData[];
  className?: string;
  noTrailingSlash?: boolean;
  isLoading?: boolean;
}

/** Carbon Breadcrumb: renders items or a skeleton placeholder when loading. */
export function Breadcrumb({
  items,
  className,
  noTrailingSlash = true,
  isLoading = false,
}: CarbonBreadcrumbProps) {
  if (isLoading) {
    return <BreadcrumbSkeleton className={cn(className)} />;
  }

  return (
    <CarbonBreadcrumb
      noTrailingSlash={noTrailingSlash}
      className={cn(className)}
    >
      {items.map((item, idx) => (
        <CarbonBreadcrumbItem
          key={idx}
          href={item.render ? undefined : item.href}
        >
          {item.render ? item.render() : item.label}
        </CarbonBreadcrumbItem>
      ))}
    </CarbonBreadcrumb>
  );
}

export { CarbonBreadcrumbItem as BreadcrumbItem };
