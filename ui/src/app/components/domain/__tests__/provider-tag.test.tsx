import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProviderTag } from '../provider-tag';

jest.mock('@carbon/icons-react', () => ({
  Ai: () => <svg data-testid="ai-icon" />,
}));

jest.mock('@carbon/react', () => ({
  Tag: ({ children, className, renderIcon: Icon, size, type }: any) => (
    <span className={className} data-size={size} data-type={type}>
      {Icon ? <Icon /> : null}
      {children}
    </span>
  ),
}));

describe('ProviderTag', () => {
  it('renders known provider names with the Carbon tag contract', () => {
    render(<ProviderTag provider="AZURE-OPENAI" />);

    expect(
      screen.getByText('Azure OpenAI').closest('[data-type]'),
    ).toHaveAttribute('data-type', 'cool-gray');
    expect(
      screen.getByText('Azure OpenAI').closest('[data-size]'),
    ).toHaveAttribute('data-size', 'md');
    expect(screen.getByTestId('ai-icon')).toBeInTheDocument();
  });

  it('falls back to custom provider names and unknown values', () => {
    render(
      <>
        <ProviderTag provider="  internal-provider  " />
        <ProviderTag />
      </>,
    );

    expect(screen.getByText('internal-provider')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});
