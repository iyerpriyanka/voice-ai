import { cn } from '@/utils';
import type { HTMLAttributes } from 'react';

export function Table(props: HTMLAttributes<HTMLTableElement>) {
  return (
    <table {...props} className={cn('text-sm', props.className)}>
      {props.children}
    </table>
  );
}
