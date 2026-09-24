import { cn } from '@/utils';
import { RadioTile } from '@carbon/react';
import { memo, type ChangeEvent, type InputHTMLAttributes } from 'react';

interface CheckboxCardProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string | JSX.Element;
  wrapperClassNames?: string;
  selectedClassNames?: string;
}

function CheckboxCard({
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
}: CheckboxCardProps) {
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
          onChange?.(event as ChangeEvent<HTMLInputElement>);
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
}
export default memo(CheckboxCard);
