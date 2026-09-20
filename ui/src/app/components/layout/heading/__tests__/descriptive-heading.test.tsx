import React from 'react';
import { render, screen } from '@testing-library/react';
import { DescriptiveHeading } from '../descriptive-heading';

describe('DescriptiveHeading', () => {
  it('renders a page heading without an empty subheading element', () => {
    render(<DescriptiveHeading heading="Organization Profile" />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Organization Profile' }),
    ).toHaveClass('text-foreground');
    expect(screen.queryByText('', { selector: 'p' })).not.toBeInTheDocument();
  });

  it('renders info text and links the subheading as the description', () => {
    render(
      <DescriptiveHeading
        heading="Archive Organization"
        id="archive-heading"
        info="Danger zone"
        subheading="This action cannot be undone."
      />,
    );

    const container = screen
      .getByRole('heading', {
        level: 1,
        name: 'Archive Organization (Danger zone)',
      })
      .parentElement;

    expect(container).toHaveAttribute(
      'aria-describedby',
      'archive-heading-description',
    );
    expect(screen.getByText('(Danger zone)')).toHaveClass('text-muted');
    expect(screen.getByText('This action cannot be undone.')).toHaveAttribute(
      'id',
      'archive-heading-description',
    );
    expect(screen.getByText('This action cannot be undone.')).toHaveClass(
      'text-muted',
    );
  });

  it('supports alternate heading levels, caller attributes, and class names', () => {
    render(
      <DescriptiveHeading
        aria-describedby="custom-description"
        className="custom-root"
        data-testid="heading-root"
        heading="Security"
        headingClassName="custom-heading"
        infoClassName="custom-info"
        level={2}
        subheading="Manage organization access."
        subheadingClassName="custom-subheading"
      />,
    );

    expect(screen.getByTestId('heading-root')).toHaveClass('custom-root');
    expect(screen.getByTestId('heading-root')).toHaveAttribute(
      'aria-describedby',
      'custom-description',
    );
    expect(
      screen.getByRole('heading', { level: 2, name: 'Security' }),
    ).toHaveClass('custom-heading');
    expect(screen.getByText('Manage organization access.')).toHaveClass(
      'custom-subheading',
    );
  });
});
