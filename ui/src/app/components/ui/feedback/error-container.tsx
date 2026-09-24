import { PrimaryButton } from '@/app/components/ui/primitives/button';
import { ArrowLeft } from '@carbon/icons-react';
import { useId } from 'react';
import { cn } from '@/utils';

interface ErrorContainerProps {
  code: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  className?: string;
}

export function ErrorContainer({
  code,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: ErrorContainerProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        'flex min-h-[24rem] items-center justify-center px-6 py-16 text-[var(--cds-text-primary)]',
        className,
      )}
    >
      <div className="max-w-xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--cds-text-secondary)]">
          {code}
        </p>
        <h1 id={titleId} className="text-3xl font-semibold leading-tight">
          {title}
        </h1>
        <p className="mx-auto mb-8 mt-3 max-w-lg text-base leading-6 text-[var(--cds-text-secondary)]">
          {description}
        </p>
        <PrimaryButton size="md" onClick={onAction} renderIcon={ArrowLeft}>
          {actionLabel}
        </PrimaryButton>
      </div>
    </section>
  );
}
