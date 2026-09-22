import { IconOnlyButton } from '@/app/components/ui/primitives/button';
import { Renew } from '@carbon/icons-react';
import type { MouseEventHandler } from 'react';

interface ReloadButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  className?: string;
}

export function ReloadButton({
  onClick,
  isLoading,
  className,
}: ReloadButtonProps) {
  return (
    <IconOnlyButton
      kind="ghost"
      size="sm"
      renderIcon={Renew}
      iconDescription="Reload"
      onClick={onClick}
      disabled={isLoading}
      className={className}
    />
  );
}
