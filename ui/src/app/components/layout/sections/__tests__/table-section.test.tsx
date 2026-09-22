import React from 'react';
import { render, screen } from '@testing-library/react';
import { ScrollableTableSection, TableSection } from '../table-section';

describe('table sections', () => {
  it('renders a flexible table section and forwards attributes', () => {
    render(
      <TableSection
        aria-label="Project table"
        className="custom-section"
        data-testid="table-section"
      >
        Table content
      </TableSection>,
    );

    expect(screen.getByLabelText('Project table')).toHaveClass(
      'flex-1',
      'flex',
      'flex-col',
      'custom-section',
    );
    expect(screen.getByTestId('table-section')).toHaveTextContent(
      'Table content',
    );
  });

  it('renders a scrollable table region and forwards attributes', () => {
    render(
      <ScrollableTableSection
        aria-label="Trace table"
        className="custom-scroll"
        data-testid="scrollable-table-section"
      >
        Scrollable content
      </ScrollableTableSection>,
    );

    expect(screen.getByLabelText('Trace table')).toHaveClass(
      'flex-1',
      'min-h-0',
      'overflow-auto',
      'custom-scroll',
    );
    expect(screen.getByTestId('scrollable-table-section')).toHaveTextContent(
      'Scrollable content',
    );
  });
});
