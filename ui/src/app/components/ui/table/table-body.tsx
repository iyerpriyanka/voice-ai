import { cn } from '@/utils';
import type { HTMLAttributes } from 'react';

export function TableBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody {...props} className={cn('text-[15px]', props.className)}>
      {props.children}
    </tbody>
  );
}
