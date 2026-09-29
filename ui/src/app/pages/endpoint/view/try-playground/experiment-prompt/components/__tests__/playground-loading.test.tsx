import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ExecuteMessage } from '@/app/pages/endpoint/view/try-playground/experiment-prompt/components/execute-message';
import { PlaygroundHeader } from '@/app/pages/endpoint/view/try-playground/experiment-prompt/components/playground-header';

jest.mock('@carbon/react', () => ({
  Button: ({ children, disabled, renderIcon: Icon, type }: any) => (
    <button disabled={disabled} type={type}>
      {children}
      {Icon && <Icon />}
    </button>
  ),
  HeaderGlobalBar: ({ children }: any) => <div>{children}</div>,
  Loading: ({ description, small, withOverlay }: any) => (
    <span
      data-testid="carbon-loading"
      data-description={description}
      data-small={String(small)}
      data-with-overlay={String(withOverlay)}
    />
  ),
  InlineLoading: ({ description, iconDescription, status }: any) => (
    <span
      data-testid="carbon-inline-loading"
      data-description={description}
      data-icon-description={iconDescription}
      data-status={status}
    />
  ),
  InlineNotification: ({ kind, title, subtitle }: any) => (
    <div data-kind={kind}>
      <strong>{title}</strong>
      <span>{subtitle}</span>
    </div>
  ),
  Tag: ({ children }: any) => <span>{children}</span>,
}));

jest.mock('@carbon/icons-react', () => ({
  Play: () => <span>play icon</span>,
}));

describe('endpoint playground loading states', () => {
  it('uses Carbon InlineLoading while endpoint execution is running', () => {
    render(<ExecuteMessage loading metrics={[]} />);

    expect(screen.getByTestId('carbon-inline-loading')).toHaveAttribute(
      'data-icon-description',
      'Executing endpoint',
    );
    expect(screen.getByTestId('carbon-inline-loading')).toHaveAttribute(
      'data-status',
      'active',
    );
    expect(screen.getByTestId('carbon-inline-loading')).toHaveAttribute(
      'data-description',
      'Executing your endpoint.',
    );
  });

  it('uses Carbon notifications for execution errors', () => {
    render(<ExecuteMessage apiError="Request timed out" metrics={[]} />);

    expect(screen.getByText('Endpoint execution failed')).toBeInTheDocument();
    expect(screen.getByText('Request timed out').parentElement).toHaveAttribute(
      'data-kind',
      'error',
    );
  });

  it('uses Carbon Loading inside the execute button', () => {
    render(<PlaygroundHeader isValid={false} loading />);

    expect(
      screen.getByRole('heading', { name: 'Playground' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('endpoint-page-header')).toContainElement(
      screen.getByRole('heading', { name: 'Playground' }),
    );
    expect(screen.queryByText('Hosted endpoint')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Running/i })).toBeDisabled();
    expect(screen.getByTestId('carbon-loading')).toHaveAttribute(
      'data-small',
      'true',
    );
    expect(screen.queryByText('play icon')).not.toBeInTheDocument();
  });

  it('disables execution when unsupported endpoint variables exist', () => {
    render(<PlaygroundHeader isValid loading={false} disabled />);

    expect(screen.getByRole('button', { name: /Run/i })).toBeDisabled();
    expect(screen.queryByText('2 arguments')).not.toBeInTheDocument();
    expect(screen.queryByText('1 unsupported')).not.toBeInTheDocument();
  });
});
