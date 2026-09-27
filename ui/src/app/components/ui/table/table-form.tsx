import { cn } from '@/utils';
import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

export const tableFormContainerClassName =
  '![padding-block-start:0] border border-border-subtle [&_input]:!border-none [&_.cds--form-item]:!m-0 [&_.cds--list-box]:!border-none [&_.cds--select-input]:!border-none [&_.cds--text-input]:!border-none [&_.cds--text-input]:!outline-none';

export function TableForm(props: HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      {...props}
      className={cn(
        'w-full border-collapse border border-border-subtle text-sm [&_input]:!border-none [&_.cds--form-item]:!m-0 [&_.cds--select-input]:!border-none [&_.cds--text-input]:!border-none [&_.cds--text-input]:!outline-none',
        props.className,
      )}
    >
      {props.children}
    </table>
  );
}

export function TableFormRow(props: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      {...props}
      className={cn(
        'border-b border-border-subtle last:border-b-0',
        props.className,
      )}
    >
      {props.children}
    </tr>
  );
}

interface TableFormHeaderCellProps
  extends ThHTMLAttributes<HTMLTableCellElement> {
  divider?: boolean;
}

export function TableFormHeaderCell({
  divider = true,
  ...props
}: TableFormHeaderCellProps) {
  return (
    <th
      {...props}
      className={cn(
        'border-b border-border-subtle px-3 py-2 text-left text-xs font-semibold uppercase text-muted',
        divider && 'border-r',
        props.className,
      )}
    >
      {props.children}
    </th>
  );
}

interface TableFormCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  divider?: boolean;
}

export function TableFormCell({
  divider = true,
  ...props
}: TableFormCellProps) {
  return (
    <td
      {...props}
      className={cn(
        'p-0',
        divider && 'border-r border-border-subtle',
        props.className,
      )}
    >
      {props.children}
    </td>
  );
}
