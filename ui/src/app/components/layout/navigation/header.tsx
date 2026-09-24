import type { HTMLAttributes } from 'react';
import { memo } from 'react';
import { Header as CarbonHeader } from '@carbon/react';
import { useTheme } from '@/theme/theme-provider';
import { BrandedLogo } from '@/app/components/layout/brand/branded-logo';
import { cn } from '@/utils';

interface HeaderProps extends HTMLAttributes<HTMLElement> {}

function HeaderComponent({
  className,
  'aria-label': ariaLabel,
  ...attributes
}: HeaderProps) {
  const { theme } = useTheme();

  return (
    <CarbonHeader
      {...attributes}
      aria-label={ariaLabel ?? `${theme.brand.name} Platform`}
      className={cn(
        'bg-shell! border-b! border-border-subtle! px-3!',
        className,
      )}
    >
      <div className="flex h-full min-w-0 items-center">
        <BrandedLogo
          variant="full"
          className="h-6 w-auto max-w-[12rem] object-left"
          textClassName="text-base"
        />
      </div>
    </CarbonHeader>
  );
}

export const Header = memo(HeaderComponent);
Header.displayName = 'Header';
