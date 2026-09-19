import { cn } from '@/utils';
import {
  TextInput as CarbonTextInput,
  type TextInputProps as CarbonTextInputProps,
} from '@carbon/react';
import { forwardRef, useId } from 'react';

export interface InputProps
  extends Omit<CarbonTextInputProps, 'id' | 'labelText'> {
  id?: string;
  labelText?: CarbonTextInputProps['labelText'];
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      'aria-label': ariaLabel,
      className,
      hideLabel = true,
      id,
      labelText,
      name,
      size = 'md',
      ...props
    },
    ref,
  ) => {
    const generatedId = useId().replace(/:/g, '');
    const inputId = id ?? name ?? `input-${generatedId}`;
    const accessibleLabel =
      labelText ||
      ariaLabel ||
      (typeof name === 'string' ? name : undefined) ||
      props.placeholder ||
      'Input';

    return (
      <CarbonTextInput
        {...props}
        ref={ref}
        id={inputId}
        name={name}
        labelText={accessibleLabel}
        hideLabel={hideLabel}
        size={size}
        className={cn('w-full', className)}
      />
    );
  },
);
