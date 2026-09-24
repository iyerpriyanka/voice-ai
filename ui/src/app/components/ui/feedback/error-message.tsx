import type { HTMLAttributes } from 'react';
import { Notification } from './notification';

interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function ErrorMessage(props: ErrorMessageProps) {
  if (!props.message) return null;
  return <Notification kind="error" title="Error" subtitle={props.message} />;
}
