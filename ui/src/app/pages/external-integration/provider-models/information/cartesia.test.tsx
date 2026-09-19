import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import { CartesiaModelInformationPage } from './cartesia';

jest.mock('@/app/components/app-shell/helmet', () => ({
  Helmet: ({ title }: any) => <div data-testid="helmet">{title}</div>,
}));

jest.mock('@/app/components/dialogs/create-provider-credential-modal', () => ({
  CreateProviderCredentialDialog: () => (
    <div data-testid="create-provider-credential-dialog" />
  ),
}));

jest.mock('@/app/components/dialogs/view-provider-credential-modal', () => ({
  ViewProviderCredentialDialog: () => (
    <div data-testid="view-provider-credential-dialog" />
  ),
}));

jest.mock('@/app/components/layout/blocks/page-header-block', () => ({
  PageHeaderBlock: ({ children }: any) => <header>{children}</header>,
}));

jest.mock('@/app/components/layout/blocks/page-title-block', () => ({
  PageTitleBlock: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/app/components/layout/blocks/pagination-button-block', () => ({
  PaginationButtonBlock: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/app/components/layout/wrapper/blured-wrapper', () => ({
  BluredWrapper: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/app/components/ui/button', () => ({
  GhostButton: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
  PrimaryButton: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/app/components/ui/icon-input', () => ({
  SearchIconInput: ({ onChange }: any) => (
    <input
      aria-label="Search"
      onChange={event => onChange(event)}
      type="search"
    />
  ),
}));

jest.mock('@/app/components/ui/tooltip', () => ({
  Tooltip: ({ children, icon }: any) => (
    <span>
      {icon}
      {children}
    </span>
  ),
}));

jest.mock(
  '@/app/pages/external-integration/provider-models/information/voice-card',
  () => ({
    VoiceCard: ({ title, voiceId }: any) => (
      <article>
        <h2>{title}</h2>
        <span>{voiceId}</span>
      </article>
    ),
  }),
);

jest.mock('@/hooks/use-model', () => ({
  useAllProviderCredentials: () => ({
    providerCredentials: [{ getProvider: () => 'cartesia' }],
  }),
}));

jest.mock('@/providers', () => ({
  CARTESIA_VOICE: () => [
    {
      id: 'voice-alpha',
      name: 'Alpha',
      description: 'First voice',
      language: 'English',
      mode: 'support',
    },
    {
      id: 'voice-beta',
      name: 'Beta',
      description: 'Second voice',
      language: 'Spanish',
      mode: 'sales',
    },
  ],
  TEXT_TO_SPEECH: () => ({
    code: 'cartesia',
    description: 'Cartesia provider',
    image: '/cartesia.svg',
    name: 'Cartesia',
  }),
}));

jest.mock('@carbon/icons-react', () => ({
  Add: ({ className, strokeWidth }: any) => (
    <svg
      className={className}
      data-stroke-width={strokeWidth}
      data-testid="add-icon"
    />
  ),
  Checkmark: ({ className, strokeWidth }: any) => (
    <svg
      className={className}
      data-stroke-width={strokeWidth}
      data-testid="status-icon"
    />
  ),
}));

const renderPage = (path = '/providers/cartesia') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <CartesiaModelInformationPage />
    </MemoryRouter>,
  );

describe('CartesiaModelInformationPage', () => {
  it('renders provider status and add credential actions', async () => {
    renderPage();

    expect(screen.getByRole('button', { name: /add new credential/i }));
    expect(screen.getByTestId('add-icon')).toHaveClass('ml-1.5');
    expect(screen.getByTestId('add-icon')).not.toHaveAttribute(
      'data-stroke-width',
    );

    await waitFor(() =>
      expect(screen.getByTestId('status-icon')).toHaveClass('bg-blue-500'),
    );
    expect(screen.getByTestId('status-icon')).not.toHaveAttribute(
      'data-stroke-width',
    );
  });

  it('filters voices from the query string while keeping page actions visible', () => {
    renderPage('/providers/cartesia?query=beta');

    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add new credential/i }));
  });
});
