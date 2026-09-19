import { Dropdown as CarbonDropdown } from '@carbon/react';
import React, { ChangeEvent, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils';

export interface DropdownProps<T> extends HTMLAttributes<HTMLDivElement> {
  currentValue?: T | null;
  setValue: (value: T) => void;
  allValue: T[];
  option?: (value: T, isSelected: boolean) => React.ReactElement;
  label?: (value: T) => React.ReactElement;
  placeholder?: string;
  multiple?: boolean;
  disable?: boolean;
  placement?: 'bottom' | 'top';
  searchable?: boolean;
  onSearching?: (qry: ChangeEvent<HTMLInputElement>) => void;
}

const getItemLabel = (item: any): string => {
  if (item == null) return '';
  if (typeof item === 'string' || typeof item === 'number') return String(item);
  if (typeof item.name === 'string') return item.name;
  if (typeof item.label === 'string') return item.label;
  if (typeof item.code === 'string') return item.code;
  if (typeof item.id === 'string' || typeof item.id === 'number') {
    return String(item.id);
  }
  return String(item);
};

export function Dropdown<T>(props: DropdownProps<T>) {
  const {
    allValue,
    className,
    currentValue,
    disable,
    id,
    label,
    multiple: _multiple,
    onSearching: _onSearching,
    option,
    placeholder = 'Select option',
    placement,
    searchable: _searchable,
    setValue,
    ...rest
  } = props;

  const dropdownId =
    id ||
    `dropdown-${placeholder
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-|-$/g, '')}`;
  const selectedItem = currentValue ?? undefined;

  return (
    <CarbonDropdown<T>
      {...rest}
      aria-label={placeholder}
      className={cn('w-full', className)}
      direction={placement}
      disabled={disable}
      hideLabel
      id={dropdownId}
      items={allValue}
      itemToElement={item =>
        option ? option(item, Object.is(item, selectedItem)) : getItemLabel(item)
      }
      itemToString={item => getItemLabel(item)}
      label={placeholder}
      onChange={({ selectedItem: nextSelectedItem }) => {
        if (nextSelectedItem != null) setValue(nextSelectedItem);
      }}
      renderSelectedItem={(item): ReactNode =>
        label ? label(item) : getItemLabel(item)
      }
      selectedItem={selectedItem}
      titleText={placeholder}
    />
  );
}
