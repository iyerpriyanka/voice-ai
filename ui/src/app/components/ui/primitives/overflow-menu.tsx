import type { ElementType, MouseEventHandler, ReactNode } from 'react';
import {
  OverflowMenu as CarbonOverflowMenu,
  OverflowMenuItem as CarbonOverflowMenuItem,
} from '@carbon/react';
import { cn } from '@/utils';

type OverflowMenuSize = 'xs' | 'sm' | 'md' | 'lg';
type MenuDirection = 'top' | 'bottom';

export interface OverflowMenuProps {
  children: ReactNode;
  className?: string;
  size: OverflowMenuSize;
  iconDescription?: string;
  renderIcon?: ElementType;
  direction?: MenuDirection;
  flipped?: boolean;
  open?: boolean;
  onClick?: MouseEventHandler;
  onClose?: () => void;
  onOpen?: () => void;
  'aria-label'?: string;
  id?: string;
  menuOptionsClass?: string;
  selectorPrimaryFocus?: string;
}

export interface OverflowMenuItemProps {
  className?: string;
  itemText: ReactNode;
  disabled?: boolean;
  isDelete?: boolean;
  hasDivider?: boolean;
  href?: string;
  onClick?: MouseEventHandler;
  dangerDescription?: string;
  requireTitle?: boolean;
  title?: string;
  wrapperClassName?: string;
}

/**
 * Carbon OverflowMenu: a vertical dot menu that reveals a list of actions.
 */
export function OverflowMenu({
  children,
  className,
  size,
  iconDescription = 'More actions',
  renderIcon,
  direction = 'bottom',
  flipped = false,
  open,
  onClick,
  onClose,
  onOpen,
  id,
  menuOptionsClass,
  selectorPrimaryFocus,
  ...rest
}: OverflowMenuProps) {
  return (
    <CarbonOverflowMenu
      className={cn(className)}
      size={size}
      iconDescription={iconDescription}
      renderIcon={renderIcon}
      direction={direction}
      flipped={flipped}
      open={open}
      onClick={onClick}
      onClose={onClose}
      onOpen={onOpen}
      id={id}
      menuOptionsClass={menuOptionsClass}
      selectorPrimaryFocus={selectorPrimaryFocus}
      {...rest}
    >
      {children}
    </CarbonOverflowMenu>
  );
}

/**
 * Carbon OverflowMenuItem: a single action inside an OverflowMenu.
 * Use `isDelete` for danger/destructive items, `hasDivider` for visual separation.
 */
export function OverflowMenuItem({
  className,
  itemText,
  disabled = false,
  isDelete = false,
  hasDivider = false,
  href,
  onClick,
  dangerDescription,
  requireTitle,
  title,
  wrapperClassName,
}: OverflowMenuItemProps) {
  return (
    <CarbonOverflowMenuItem
      className={cn(className)}
      itemText={itemText}
      disabled={disabled}
      isDelete={isDelete}
      hasDivider={hasDivider}
      href={href}
      onClick={onClick}
      dangerDescription={dangerDescription}
      requireTitle={requireTitle}
      title={title}
      wrapperClassName={wrapperClassName}
    />
  );
}
