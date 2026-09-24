import { FormLabel } from '@/app/components/ui/primitives';
import { FieldSet } from '@/app/components/ui/primitives';
import { Slider } from '@/app/components/ui/primitives';
import { Input } from '@/app/components/ui/primitives';
import { memo } from 'react';
import { HelpToggletip } from '@/app/components/domain/providers/help-label';

interface SliderFieldProps {
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  value: string;
  inputWidth?: string;
  parse?: (v: string) => number;
  onChange: (value: string) => void;
}

export const SliderField = memo<SliderFieldProps>(
  ({
    label,
    hint,
    min,
    max,
    step,
    value,
    inputWidth = 'w-16',
    parse = parseInt,
    onChange,
  }) => (
    <FieldSet className="col-span-1">
      <div className="inline-flex items-center gap-1">
        <FormLabel>{label}</FormLabel>
        <HelpToggletip label={label} helpText={hint} />
      </div>
      <div className="flex space-x-2 justify-center items-center">
        <Slider
          min={min}
          max={max}
          step={step}
          value={parse(value)}
          onSlide={v => onChange(v.toString())}
        />
        <Input
          min={min}
          max={max}
          className={`bg-light-background ${inputWidth}`}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
    </FieldSet>
  ),
);
