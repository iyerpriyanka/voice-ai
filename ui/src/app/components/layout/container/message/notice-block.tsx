import { cn } from '@/utils';
import type { FC, HTMLAttributes, ReactNode } from 'react';

interface NoticeBlockFrameProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  toneClassName: string;
}

const NoticeBlockFrame = ({
  className,
  children,
  toneClassName,
  role = 'status',
  ...attributes
}: NoticeBlockFrameProps) => (
  <div
    {...attributes}
    role={role}
    className={cn(
      'border-0 border-l-4 px-4 py-3 text-sm text-foreground',
      toneClassName,
      className,
    )}
  >
    {children}
  </div>
);

export const BlueNoticeBlock: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...attributes
}) => (
  <NoticeBlockFrame
    {...attributes}
    className={className}
    toneClassName="border-l-blue-600 bg-blue-50 dark:bg-blue-900/20"
  >
    {children}
  </NoticeBlockFrame>
);

export const GreenNoticeBlock: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...attributes
}) => (
  <NoticeBlockFrame
    {...attributes}
    className={className}
    toneClassName="border-l-green-600 bg-green-50 dark:bg-green-900/20"
  >
    {children}
  </NoticeBlockFrame>
);

export const RedNoticeBlock: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...attributes
}) => (
  <NoticeBlockFrame
    {...attributes}
    className={className}
    role="alert"
    toneClassName="border-l-red-600 bg-red-50 dark:bg-red-900/20"
  >
    {children}
  </NoticeBlockFrame>
);

export const YellowNoticeBlock: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...attributes
}) => (
  <NoticeBlockFrame
    {...attributes}
    className={className}
    toneClassName="border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
  >
    {children}
  </NoticeBlockFrame>
);
