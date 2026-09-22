import type { ReactNode } from 'react';
import { InlineNotification, ActionableNotification } from '@carbon/react';
import { cn } from '@/utils';

type NotificationKind = 'info' | 'success' | 'warning' | 'error';

export interface CarbonNotificationProps {
  kind: NotificationKind;
  title: string;
  subtitle?: string;
  className?: string;
  lowContrast?: boolean;
  hideCloseButton?: boolean;
  onClose?: () => void;
}

/** Carbon InlineNotification: static notification banner. */
export function Notification({
  kind,
  title,
  subtitle,
  className,
  lowContrast = true,
  hideCloseButton = true,
  onClose,
}: CarbonNotificationProps) {
  return (
    <InlineNotification
      kind={kind}
      title={title}
      subtitle={subtitle}
      lowContrast={lowContrast}
      hideCloseButton={hideCloseButton}
      onCloseButtonClick={onClose}
      className={cn('!max-w-full', className)}
    />
  );
}

export interface ActionableNotificationProps {
  kind: NotificationKind;
  title: string;
  subtitle?: string;
  actionButtonLabel: string;
  onActionButtonClick: () => void;
  className?: string;
  lowContrast?: boolean;
  hideCloseButton?: boolean;
  inline?: boolean;
  onClose?: () => void;
}

/** Carbon ActionableNotification: notification with action button. */
export function ActionNotification({
  kind,
  title,
  subtitle,
  actionButtonLabel,
  onActionButtonClick,
  className,
  lowContrast = true,
  hideCloseButton = true,
  inline = false,
  onClose,
}: ActionableNotificationProps) {
  return (
    <ActionableNotification
      kind={kind}
      title={title}
      subtitle={subtitle}
      actionButtonLabel={actionButtonLabel}
      onActionButtonClick={onActionButtonClick}
      lowContrast={lowContrast}
      hideCloseButton={hideCloseButton}
      inline={inline}
      onCloseButtonClick={onClose}
      className={cn('!max-w-full', className)}
    />
  );
}

export interface LinkNotificationProps {
  kind: NotificationKind;
  title: string;
  subtitle?: string;
  linkText: string;
  onLinkClick: () => void;
  className?: string;
  lowContrast?: boolean;
  hideCloseButton?: boolean;
}

/** Carbon notification with link-styled action button. */
export function LinkNotification({
  kind,
  title,
  subtitle,
  linkText,
  onLinkClick,
  className,
  lowContrast = true,
  hideCloseButton = true,
}: LinkNotificationProps) {
  return (
    <ActionableNotification
      role="none"
      kind={kind}
      title={title}
      subtitle={subtitle}
      actionButtonLabel={linkText}
      onActionButtonClick={onLinkClick}
      lowContrast={lowContrast}
      hideCloseButton={hideCloseButton}
      inline
      className={cn('!max-w-full notice-link-style', className)}
    />
  );
}
