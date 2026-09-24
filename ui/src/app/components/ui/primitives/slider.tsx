import { cn } from '@/utils';
import {
  Slider as CarbonSlider,
  type SliderProps as CarbonSliderProps,
} from '@carbon/react';
import { useId, type ReactNode } from 'react';

type SliderNumber = number | string;

interface SliderProps
  extends Omit<
    CarbonSliderProps,
    | 'id'
    | 'inputType'
    | 'labelText'
    | 'max'
    | 'min'
    | 'onChange'
    | 'step'
    | 'value'
  > {
  id?: string;
  inputType?: string;
  labelText?: ReactNode;
  max?: number | string;
  min?: number | string;
  step?: number | string;
  type?: string;
  value?: SliderNumber;
  onChange?: CarbonSliderProps['onChange'];
  onSlide?: (value: number) => void;
}

const toSliderNumber = (value: SliderNumber | undefined, fallback: number) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number.parseFloat(String(value ?? ''));
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const Slider = ({
  'aria-label': ariaLabel,
  ariaLabelInput,
  className,
  hideLabel = true,
  id,
  inputType,
  labelText,
  max,
  min,
  name,
  onChange,
  onSlide,
  step,
  type,
  value,
  ...props
}: SliderProps) => {
  const generatedId = useId().replace(/:/g, '');
  const minValue = toSliderNumber(min, 0);
  const maxValue = toSliderNumber(max, 100);
  const stepValue = toSliderNumber(step, 1);
  const sliderValue = toSliderNumber(value, minValue);
  const sliderId = id ?? name ?? `slider-${generatedId}`;
  const accessibleLabel =
    labelText ||
    ariaLabel ||
    ariaLabelInput ||
    (typeof name === 'string' ? name : undefined) ||
    'Slider';

  return (
    <CarbonSlider
      {...props}
      id={sliderId}
      name={name}
      min={minValue}
      max={maxValue}
      step={stepValue}
      value={sliderValue}
      labelText={accessibleLabel}
      hideLabel={hideLabel}
      ariaLabelInput={ariaLabelInput ?? String(accessibleLabel)}
      inputType={inputType ?? type ?? 'number'}
      onChange={data => {
        onChange?.(data);
        if (typeof data.value === 'number') {
          onSlide?.(data.value);
        }
      }}
      className={cn('w-full', className)}
    />
  );
};
