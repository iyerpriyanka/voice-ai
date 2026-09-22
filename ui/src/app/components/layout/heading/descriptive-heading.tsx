import { useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface DescriptiveHeadingProps extends HTMLAttributes<HTMLDivElement> {
  heading: ReactNode;
  info?: string;
  subheading?: ReactNode;
  level?: HeadingLevel;
  headingClassName?: string;
  infoClassName?: string;
  subheadingClassName?: string;
}

export function DescriptiveHeading({
  heading,
  info,
  subheading,
  level = 1,
  className,
  headingClassName,
  infoClassName,
  subheadingClassName,
  id,
  'aria-describedby': ariaDescribedBy,
  ...attributes
}: DescriptiveHeadingProps) {
  const generatedDescriptionId = useId();
  const descriptionId = subheading
    ? `${id ?? generatedDescriptionId}-description`
    : undefined;
  const HeadingTag = `h${level}` as const;

  return (
    <div
      {...attributes}
      aria-describedby={ariaDescribedBy ?? descriptionId}
      className={cn('flex flex-col py-2', className)}
      id={id}
    >
      <HeadingTag
        className={cn(
          'text-[28px] leading-9 text-foreground',
          headingClassName,
        )}
      >
        {heading}
        {info && (
          <small className={cn('ml-2 text-base text-muted', infoClassName)}>
            ({info})
          </small>
        )}
      </HeadingTag>
      {subheading && (
        <p
          className={cn(
            'mt-2 text-sm leading-5 text-muted',
            subheadingClassName,
          )}
          id={descriptionId}
        >
          {subheading}
        </p>
      )}
    </div>
  );
}
