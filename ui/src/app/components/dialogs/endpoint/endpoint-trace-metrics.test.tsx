import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { EndpointMetrics } from './endpoint-trace-metrics';

jest.mock('@/app/components/ui/primitives/tooltip', () => ({
  Tooltip: ({ children, icon }: any) => (
    <span>
      {icon}
      {children}
    </span>
  ),
}));

jest.mock('@/app/components/ui/feedback/empty-state', () => ({
  EmptyState: ({ title, subtitle, icon: Icon }: any) => (
    <div>
      {Icon ? <Icon /> : null}
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  ),
}));

jest.mock('@carbon/icons-react', () => ({
  ChartLine: () => <svg data-testid="empty-icon" />,
  CheckmarkFilled: () => <svg data-testid="success-icon" />,
  ErrorFilled: () => <svg data-testid="error-icon" />,
  Information: () => <svg data-testid="info-icon" />,
}));

const makeMetric = (name: string, description: string, value: string) => ({
  getName: () => name,
  getDescription: () => description,
  getValue: () => value,
});

describe('EndpointMetrics', () => {
  it('renders an empty state when there are no metrics', () => {
    render(<EndpointMetrics metrics={[]} />);

    expect(screen.getByText('No metrics found')).toBeInTheDocument();
    expect(
      screen.getByText('No metrics were recorded for this trace.'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
  });

  it('renders metric descriptions with the standard info icon', () => {
    render(
      <EndpointMetrics
        metrics={[makeMetric('latency', 'Total request latency', '245') as any]}
      />,
    );

    expect(screen.getByText('latency')).toBeInTheDocument();
    expect(screen.getByText('Total request latency')).toBeInTheDocument();
    expect(screen.getByText('245')).toBeInTheDocument();
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
  });

  it('renders boolean values with standard status icons', () => {
    render(
      <EndpointMetrics
        metrics={[
          makeMetric('cache_hit', 'Cache was not used', 'false') as any,
          makeMetric('failed', 'Request failed', 'true') as any,
        ]}
      />,
    );

    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
  });
});
