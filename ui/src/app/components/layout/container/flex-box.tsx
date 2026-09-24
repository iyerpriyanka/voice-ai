import { GeneralFooter } from '@/app/components/layout/footer/general-footer';
import { Header } from '@/app/components/layout/navigation/header';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils';

interface FlexBoxProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  showFooter?: boolean;
  isFloatingHeader?: boolean;
}

export function FlexBox({
  children,
  showFooter = true,
  isFloatingHeader = false,
  className,
  ...attributes
}: FlexBoxProps) {
  return (
    <main
      {...attributes}
      className={cn(
        'relative flex min-h-[100dvh] flex-1 flex-col bg-surface text-foreground antialiased',
        className,
      )}
    >
      <Header className={cn(isFloatingHeader && 'sticky top-0 z-20')} />
      <div className="flex flex-1 grow flex-col">{children}</div>
      {showFooter && <GeneralFooter />}
    </main>
  );
}
