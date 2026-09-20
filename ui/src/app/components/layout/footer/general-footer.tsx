import type { HTMLAttributes } from 'react';
import { HeaderMenuItem, HeaderName, HeaderNavigation } from '@carbon/react';
import { useTheme } from '@/theme/theme-provider';
import { cn } from '@/utils';

export function GeneralFooter({
  className,
  ...attributes
}: HTMLAttributes<HTMLElement>) {
  const { theme } = useTheme();

  return (
    <footer
      {...attributes}
      aria-label={`${theme.brand.name} platform footer`}
      className={cn(
        'h-12 flex shrink-0 items-center',
        'bg-shell text-foreground',
        'border-t border-border-subtle',
        className,
      )}
    >
      <HeaderName href="/" prefix={theme.brand.name}>
        Platform
      </HeaderName>
      <HeaderNavigation aria-label={`${theme.brand.name} footer links`}>
        <HeaderMenuItem href={theme.links.terms}>
          <span className="opacity-80">Terms and Conditions</span>
        </HeaderMenuItem>
        <HeaderMenuItem href={theme.links.privacy}>
          <span className="opacity-80">Privacy Policy</span>
        </HeaderMenuItem>
        <HeaderMenuItem href={theme.links.documentation}>
          <span className="opacity-80">Documentation</span>
        </HeaderMenuItem>
        <HeaderMenuItem href={theme.links.source}>
          <span className="opacity-80">Source</span>
        </HeaderMenuItem>
        <HeaderMenuItem href={theme.links.support}>
          <span className="opacity-80">Support</span>
        </HeaderMenuItem>
      </HeaderNavigation>
    </footer>
  );
}
