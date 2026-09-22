import { IconOnlyButton } from '@/app/components/ui/primitives/button';
import { TrashCan } from '@carbon/icons-react';
import type { MouseEventHandler } from 'react';

interface DeleteButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
}

export function DeleteButton({
  onClick,
  className,
  disabled,
}: DeleteButtonProps) {
  return (
    <IconOnlyButton
      kind="ghost"
      size="sm"
      renderIcon={TrashCan}
      iconDescription="Delete"
      onClick={onClick}
      disabled={disabled}
      className={className}
    />
  );
}
