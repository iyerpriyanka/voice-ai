import React, { type FC, useId } from 'react';
import { Toggle } from '@carbon/react';
import { cn } from '@/utils';

export const Switch: FC<{
  enable: boolean;
  setEnable: (e: boolean) => void;
  id?: string;
  name?: string;
  label?: string;
}> = React.memo(({ enable, setEnable, id, name, label }) => {
  const generatedId = useId();
  const toggleId = id ?? `${name ?? 'switch'}-${generatedId}`;

  return (
    <Toggle
      id={toggleId}
      name={name}
      labelText={label ?? name ?? 'Switch'}
      hideLabel
      size="sm"
      toggled={enable}
      onToggle={setEnable}
    />
  );
});

export const SwitchWithLabel: FC<{
  enable: boolean;
  setEnable: (e: boolean) => void;
  id?: string;
  label?: string;
  className?: string;
}> = React.memo(({ enable, setEnable, id, label, className }) => {
  return (
    <div
      className={cn(
        'w-full',
        'form-input',
        'min-h-10',
        'dark:placeholder-gray-600 placeholder-gray-400',
        'dark:text-gray-300 text-gray-600',
        'border-b border-gray-300 dark:border-gray-700',
        'bg-white dark:bg-gray-950',
        'px-4 py-2 flex justify-between items-center w-full gap-4',
        className,
      )}
    >
      <span>{label}</span>
      <Switch enable={enable} setEnable={setEnable} id={id} label={label} />
    </div>
  );
});
