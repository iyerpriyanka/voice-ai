import {
  Select as CarbonSelect,
  SelectItem,
  type SelectProps as CarbonSelectProps,
} from '@carbon/react';
import { forwardRef } from 'react';

export type SelectionOption = {
  name: string;
  value: string | number;
};

interface SelectProps
  extends Omit<CarbonSelectProps, 'children' | 'id' | 'labelText'> {
  autocomplete?: string;
  id?: string;
  labelText?: string;
  placeholder?: string;
  options: SelectionOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      autocomplete,
      autoComplete,
      className,
      hideLabel = true,
      labelText,
      name,
      options,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const accessibleLabel =
      labelText ||
      props['aria-label'] ||
      (typeof name === 'string' ? name : undefined) ||
      placeholder ||
      'Select option';

    return (
      <CarbonSelect
        {...props}
        ref={ref}
        autoComplete={autocomplete ?? autoComplete}
        className={className}
        hideLabel={hideLabel}
        id={props.id || name || accessibleLabel}
        labelText={accessibleLabel}
        name={name}
      >
        {placeholder && <SelectItem disabled value="" text={placeholder} />}
        {options.map(option => (
          <SelectItem
            key={option.value}
            value={option.value}
            text={option.name}
          />
        ))}
      </CarbonSelect>
    );
  },
);
