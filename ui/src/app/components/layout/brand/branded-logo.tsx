import { forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { useTheme } from '@/theme/theme-provider';
import { ResolvedThemeMode } from '@/theme/types';
import { cn } from '@/utils';

type BrandedLogoVariant = 'full' | 'compact';

interface BrandedLogoProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  variant?: BrandedLogoVariant;
  colorMode?: ResolvedThemeMode;
  textClassName?: string;
}

export const BrandedLogo = forwardRef<HTMLElement, BrandedLogoProps>(
  function BrandedLogo(
    { variant = 'full', colorMode, className, textClassName, ...attributes },
    ref,
  ) {
    const { resolvedMode, theme } = useTheme();
    const logo = theme.brand.logos?.[variant][colorMode ?? resolvedMode];

    if (logo) {
      return (
        <img
          {...attributes}
          ref={ref as Ref<HTMLImageElement>}
          src={logo}
          alt={theme.brand.name}
          className={cn('block object-contain', className)}
        />
      );
    }

    return (
      <span
        {...attributes}
        ref={ref as Ref<HTMLSpanElement>}
        className={cn(
          'block min-w-0 truncate font-semibold text-primary',
          className,
          textClassName,
        )}
      >
        {theme.brand.name}
      </span>
    );
  },
);
