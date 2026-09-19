import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { TablePagination } from './table-pagination';

jest.mock('@/app/components/ui/button', () => ({
  GhostButton: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('@/app/components/dialogs/column-preference-modal', () => ({
  ColumnPreferencesDialog: ({ open }: any) =>
    open ? <div data-testid="column-preferences-dialog" /> : null,
}));

jest.mock('@/app/components/ui/tooltip-plus', () => ({
  __esModule: true,
  default: ({ children }: any) => <span>{children}</span>,
}));

jest.mock('@carbon/icons-react', () => ({
  ChevronLeft: () => <svg data-testid="previous-icon" />,
  ChevronRight: () => <svg data-testid="next-icon" />,
  SettingsAdjust: () => <svg data-testid="settings-icon" />,
}));

describe('TablePagination', () => {
  it('renders page controls with design-system icons', () => {
    render(
      <TablePagination
        currentPage={2}
        pageSize={10}
        totalItem={30}
        onChangeCurrentPage={jest.fn()}
      />,
    );

    expect(screen.getByTestId('previous-icon')).toBeInTheDocument();
    expect(screen.getByTestId('next-icon')).toBeInTheDocument();
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
  });

  it('changes pages and opens column preferences', () => {
    const onChangeCurrentPage = jest.fn();

    render(
      <TablePagination
        currentPage={2}
        pageSize={10}
        totalItem={30}
        onChangeCurrentPage={onChangeCurrentPage}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onChangeCurrentPage).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onChangeCurrentPage).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByRole('button', { name: 'Setting' }));
    expect(screen.getByTestId('column-preferences-dialog')).toBeInTheDocument();
  });

  it('disables unavailable page directions', () => {
    render(
      <TablePagination
        currentPage={1}
        pageSize={10}
        totalItem={10}
        onChangeCurrentPage={jest.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });
});
