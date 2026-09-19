import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { StatusIndicator } from './status';

const makeIcon = (name: string) =>
  function MockIcon({ size, className }: any) {
    return (
      <svg
        data-icon={name}
        data-size={size}
        className={className}
      />
    );
  };

jest.mock('@carbon/icons-react', () => ({
  Activity: makeIcon('activity'),
  Archive: makeIcon('archive'),
  CheckmarkFilled: makeIcon('checkmark-filled'),
  Close: makeIcon('close'),
  ConnectionSignal: makeIcon('connection-signal'),
  Email: makeIcon('email'),
  InProgress: makeIcon('in-progress'),
  Pending: makeIcon('pending'),
  SubtractAlt: makeIcon('subtract-alt'),
  Time: makeIcon('time'),
}));

describe('StatusIndicator', () => {
  it('renders success states with the standard completion icon', () => {
    render(<StatusIndicator state="SUCCESS" size="small" />);

    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(document.querySelector('[data-icon="checkmark-filled"]')).toHaveAttribute(
      'data-size',
      '12',
    );
  });

  it('renders progress states with the standard progress icon', () => {
    render(<StatusIndicator state="IN_PROGRESS" />);

    expect(screen.getByText('In progress')).toBeInTheDocument();
    expect(document.querySelector('[data-icon="in-progress"]')).toHaveAttribute(
      'data-size',
      '16',
    );
  });

  it('falls back to inactive for unknown states', () => {
    render(<StatusIndicator state="UNKNOWN" size="large" />);

    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(document.querySelector('[data-icon="subtract-alt"]')).toHaveAttribute(
      'data-size',
      '18',
    );
  });
});
