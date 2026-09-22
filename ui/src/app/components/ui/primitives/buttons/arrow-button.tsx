import {
  PrimaryButton,
  SecondaryButton,
} from '@/app/components/ui/primitives/button';
import { ArrowRight } from '@carbon/icons-react';
import { useRapidaStore } from '@/hooks';
import { cn } from '@/utils';
import type { ButtonHTMLAttributes } from 'react';

interface ArrowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  loading?: boolean;
}

export function ArrowButton({
  label,
  loading,
  disabled,
  className,
  ...props
}: ArrowButtonProps) {
  const { isBlocking } = useRapidaStore();

  return (
    <PrimaryButton
      size="md"
      {...props}
      disabled={loading || disabled || isBlocking()}
      isLoading={loading || isBlocking()}
      renderIcon={ArrowRight}
      className={cn(isBlocking() ? 'opacity-80' : 'opacity-100', className)}
    >
      {label}
    </PrimaryButton>
  );
}

export function ArrowBorderButton({
  label,
  loading,
  disabled,
  className,
  ...props
}: ArrowButtonProps) {
  const { isBlocking } = useRapidaStore();

  return (
    <SecondaryButton
      size="md"
      {...props}
      disabled={loading || disabled || isBlocking()}
      isLoading={loading || isBlocking()}
      renderIcon={ArrowRight}
      className={cn(isBlocking() ? 'opacity-80' : 'opacity-100', className)}
    >
      {label}
    </SecondaryButton>
  );
}
