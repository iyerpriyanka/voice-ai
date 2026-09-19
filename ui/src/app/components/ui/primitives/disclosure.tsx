import type { ReactNode } from 'react';

interface DisclosureProps {
  open: boolean;
  children?: ReactNode;
}

export function Disclosure({ open, children }: DisclosureProps) {
  if (!open) {
    return null;
  }

  return <div>{children}</div>;
}
