import { IconOnlyButton } from '@/app/components/ui/primitives/button';
import { Edit } from '@carbon/icons-react';
import type { MouseEventHandler } from 'react';

interface EditButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
}

export function EditButton({ onClick, className, disabled }: EditButtonProps) {
  return (
    <IconOnlyButton
      kind="ghost"
      size="sm"
      renderIcon={Edit}
      iconDescription="Edit"
      onClick={onClick}
      disabled={disabled}
      className={className}
    />
  );
}
