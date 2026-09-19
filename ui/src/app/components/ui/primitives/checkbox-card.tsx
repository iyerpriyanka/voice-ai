import { cn } from '@/utils';
import { RadioTile } from '@carbon/react';
import React, { FC, InputHTMLAttributes } from 'react';

interface CheckboxCardProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string | JSX.Element;
  wrapperClassNames?: string;
  selectedClassNames?: string;
}

const CheckboxCard: FC<CheckboxCardProps> = ({
  id,
  label,
  wrapperClassNames,
  selectedClassNames,
  className,
  checked,
  disabled,
  children,
  name,
  onChange,
  required,
  tabIndex,
  value = '',
}) => {
  return (
    <RadioTile
      id={id}
      name={name}
      value={typeof value === 'number' ? value : String(value)}
      checked={Boolean(checked)}
      disabled={disabled}
      required={required}
      tabIndex={tabIndex}
      onChange={(_value, _name, event) => {
        if (event.type === 'change') {
          onChange?.(event as React.ChangeEvent<HTMLInputElement>);
        }
      }}
      className={cn(
        'relative h-fit',
        wrapperClassNames,
        className,
        checked && selectedClassNames,
        !disabled && 'cursor-pointer',
      )}
    >
      {label}
      {children}
    </RadioTile>
  );
};
export default React.memo(CheckboxCard);
