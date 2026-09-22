import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Tooltip } from '../tooltip';

jest.mock('@carbon/react', () => ({
  Tooltip: ({ align, children, label }: any) => (
    <span data-align={align} data-testid="carbon-tooltip">
      {children}
      <span data-testid="tooltip-label">{label}</span>
    </span>
  ),
}));

describe('Tooltip', () => {
  it('uses Carbon Tooltip with the provided icon trigger and content', () => {
    render(
      <Tooltip icon={<button type="button">Info</button>}>
        Helpful context
      </Tooltip>,
    );

    expect(screen.getByTestId('carbon-tooltip')).toHaveAttribute(
      'data-align',
      'bottom',
    );
    expect(screen.getByRole('button', { name: 'Info' })).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-label')).toHaveTextContent(
      'Helpful context',
    );
  });

  it('forwards custom alignment to Carbon Tooltip', () => {
    render(
      <Tooltip align="right" icon={<span>Trigger</span>}>
        More context
      </Tooltip>,
    );

    expect(screen.getByTestId('carbon-tooltip')).toHaveAttribute(
      'data-align',
      'right',
    );
  });
});
