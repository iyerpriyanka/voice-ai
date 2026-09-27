import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import {
  TableForm,
  TableFormCell,
  TableFormHeaderCell,
  TableFormRow,
  tableFormContainerClassName,
} from '../table-form';

describe('TableForm', () => {
  it('renders the shared editable table-form classes', () => {
    render(
      <TableForm>
        <thead>
          <tr>
            <TableFormHeaderCell>Key</TableFormHeaderCell>
            <TableFormHeaderCell className="w-10" divider={false}>
              Action
            </TableFormHeaderCell>
          </tr>
        </thead>
        <tbody>
          <TableFormRow>
            <TableFormCell>
              <input aria-label="Key" />
            </TableFormCell>
            <TableFormCell className="w-10 text-center" divider={false}>
              <button type="button">Remove</button>
            </TableFormCell>
          </TableFormRow>
        </tbody>
      </TableForm>,
    );

    expect(screen.getByRole('table')).toHaveClass(
      'border-border-subtle',
      '[&_input]:!border-none',
    );
    expect(screen.getByRole('columnheader', { name: 'Key' })).toHaveClass(
      'border-r',
      'border-border-subtle',
      'font-semibold',
      'uppercase',
    );
    expect(screen.getByLabelText('Key').closest('td')).toHaveClass(
      'p-0',
      'border-r',
      'border-border-subtle',
    );
    expect(
      screen.getByRole('button', { name: 'Remove' }).closest('td'),
    ).toHaveClass('w-10', 'text-center');
  });

  it('exports the Carbon table form container class', () => {
    expect(tableFormContainerClassName).toContain('![padding-block-start:0]');
    expect(tableFormContainerClassName).toContain('border-border-subtle');
    expect(tableFormContainerClassName).toContain(
      '[&_.cds--select-input]:!border-none',
    );
  });
});
