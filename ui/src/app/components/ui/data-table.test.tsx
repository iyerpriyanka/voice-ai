import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ScrollableResizableTable } from './data-table';

jest.mock('@/app/components/ui/input-checkbox', () => ({
  InputCheckbox: ({ onChange, ...props }: any) => (
    <input
      {...props}
      data-design-system-checkbox
      type="checkbox"
      onChange={onChange}
    />
  ),
}));

describe('ScrollableResizableTable', () => {
  it('renders the select-all action through the design-system checkbox', () => {
    render(
      <ScrollableResizableTable
        clms={[{ name: 'Name', key: 'name' }]}
        ontoggle={jest.fn()}
      >
        <tr>
          <td>Assistant</td>
        </tr>
      </ScrollableResizableTable>,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Select all rows' });
    expect(checkbox).toHaveAttribute('data-design-system-checkbox');
  });

  it('keeps the select-all checked callback contract', () => {
    const ontoggle = jest.fn();

    render(
      <ScrollableResizableTable
        clms={[{ name: 'Name', key: 'name' }]}
        ontoggle={ontoggle}
      >
        <tr>
          <td>Assistant</td>
        </tr>
      </ScrollableResizableTable>,
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));

    expect(ontoggle).toHaveBeenCalledWith(true);
  });
});
