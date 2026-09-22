import { useRapidaStore } from '@/hooks';
import type { HTMLAttributes } from 'react';

import { cn } from '@/utils';

export function LineLoader(props: HTMLAttributes<HTMLDivElement>) {
  const { loading } = useRapidaStore();
  return <AnimatedLine animate={loading ? 'infinite' : ''} {...props} />;
}

export function AnimatedLine({
  animate,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { animate: string }) {
  return (
    <div {...props} className={cn('w-full overflow-hidden', className)}>
      <div
        className={cn(
          'bg-linear-to-r h-0.5 from-indigo-500 via-purple-500 to-pink-500 w-full transition-all duration-700 translate-x-full',
        )}
        style={{
          animation: `fill 2s linear ${animate}`,
        }}
      ></div>
    </div>
  );
}
