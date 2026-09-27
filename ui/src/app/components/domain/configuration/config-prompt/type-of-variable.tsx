import { Select } from '@/app/components/ui/primitives';
import { cn } from '@/utils';
import { InputVarType } from '@/models/common';
import { memo } from 'react';

type TypeOfVariableProps = {
  type: string;
  onChange: (type: string) => void;
  allType: InputVarType[];
  className?: string;
  id?: string;
  'aria-label'?: string;
  hideLabel?: boolean;
  labelText?: string;
};

function TypeOfVariableComponent({
  type,
  onChange,
  allType,
  className,
  ...props
}: TypeOfVariableProps) {
  return (
    <Select
      aria-label="Variable type"
      {...props}
      value={type}
      placeholder="Select type of variable"
      options={allType.map(x => {
        return { name: x, value: x };
      })}
      className={cn('capitalize', className)}
      onChange={v => onChange(v.currentTarget.value)}
    />
  );
}

export const TypeOfVariable = memo(TypeOfVariableComponent);
