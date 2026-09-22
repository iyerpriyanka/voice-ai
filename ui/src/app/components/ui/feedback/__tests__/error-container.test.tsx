import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ErrorContainer } from '../error-container';

jest.mock('@/app/components/ui/primitives/button', () => ({
  PrimaryButton: ({ children, renderIcon: Icon, ...props }: any) => (
    <button {...props}>
      {children}
      {Icon ? <Icon /> : null}
    </button>
  ),
}));

jest.mock('@carbon/icons-react', () => ({
  ArrowLeft: () => <svg data-testid="action-icon" />,
}));

describe('ErrorContainer', () => {
  it('renders error content with the standard action icon', () => {
    render(
      <ErrorContainer
        code="404"
        title="Page not found"
        description="The page does not exist."
        actionLabel="Go back"
        onAction={jest.fn()}
      />,
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(screen.getByText('The page does not exist.')).toBeInTheDocument();
    expect(screen.getByTestId('action-icon')).toBeInTheDocument();
  });

  it('runs the configured action', () => {
    const onAction = jest.fn();

    render(
      <ErrorContainer
        code="500"
        title="Something went wrong"
        description="Try again later."
        actionLabel="Retry"
        onAction={onAction}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
