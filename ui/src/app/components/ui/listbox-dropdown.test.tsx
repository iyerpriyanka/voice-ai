import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Dropdown } from './listbox-dropdown';

jest.mock('@headlessui/react', () => ({
  Listbox: ({ children, value, onChange, disabled }: any) => (
    <div data-value={value || ''} data-disabled={disabled ? 'true' : 'false'}>
      {children({ open: true })}
      <button type="button" onClick={() => onChange('one')}>
        choose-one
      </button>
    </div>
  ),
  ListboxButton: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  ListboxOption: ({ children, value }: any) => (
    <div data-testid={`option-${value}`}>{children({ selected: value === 'one' })}</div>
  ),
  ListboxOptions: ({ children }: any) => <div>{children}</div>,
  Transition: ({ children }: any) => <>{children}</>,
}));

jest.mock('@headlessui-float/react', () => ({
  Float: ({ children }: any) => <>{children}</>,
}));

jest.mock('@/app/components/ui/loaders/spinner', () => ({
  Spinner: () => <span data-testid="spinner" />,
}));

jest.mock('@/app/components/ui/icon-input', () => ({
  SearchIconInput: ({ onChange }: any) => (
    <input aria-label="Search" onChange={onChange} />
  ),
}));

jest.mock('@carbon/icons-react', () => ({
  Checkmark: () => <svg data-testid="selected-icon" />,
  ChevronDown: () => <svg data-testid="chevron-icon" />,
}));

describe('Dropdown', () => {
  it('renders placeholder and standard chevron icon', () => {
    render(
      <Dropdown
        currentValue={null}
        setValue={jest.fn()}
        allValue={['one']}
        placeholder="Choose value"
        option={value => <span>{value}</span>}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Choose value' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Choose value')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-icon')).toBeInTheDocument();
  });

  it('calls setValue from listbox changes and marks the selected option', () => {
    const setValue = jest.fn();

    render(
      <Dropdown
        currentValue="one"
        setValue={setValue}
        allValue={['one', 'two']}
        placeholder="Choose value"
        option={value => <span>{value}</span>}
      />,
    );

    expect(screen.getByTestId('selected-icon')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'choose-one' }));

    expect(setValue).toHaveBeenCalledWith('one');
  });

  it('renders search input when searchable', () => {
    const onSearching = jest.fn();

    render(
      <Dropdown
        currentValue={null}
        setValue={jest.fn()}
        allValue={['one']}
        placeholder="Choose value"
        searchable
        onSearching={onSearching}
        option={value => <span>{value}</span>}
      />,
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
      target: { value: 'one' },
    });

    expect(onSearching).toHaveBeenCalledTimes(1);
  });
});
