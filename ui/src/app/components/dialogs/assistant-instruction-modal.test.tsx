import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { AssistantWebwidgetDeploymentDialog } from './assistant-instruction-modal';

jest.mock('@/app/components/ui/primitives/modal', () => ({
  Modal: ({ open, children }: any) => (open ? <div>{children}</div> : null),
  ModalHeader: ({ title, children }: any) => (
    <header>
      <h2>{title}</h2>
      {children}
    </header>
  ),
  ModalBody: ({ children }: any) => <main>{children}</main>,
  ModalFooter: ({ children }: any) => <footer>{children}</footer>,
}));

jest.mock('@/app/components/ui/primitives/button', () => ({
  PrimaryButton: ({ children, renderIcon: Icon, ...props }: any) => (
    <button {...props}>
      {children}
      {Icon ? <Icon /> : null}
    </button>
  ),
  SecondaryButton: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('@carbon/icons-react', () => ({
  Launch: () => <svg data-testid="documentation-icon" />,
}));

jest.mock('@/app/components/ui/editor/code-highlighting', () => ({
  CodeHighlighting: ({ code }: any) => <pre>{code}</pre>,
}));

jest.mock('@/app/components/dialogs/deployment-modal-primitives', () => ({
  DeploymentSectionHeader: ({ label }: any) => <h3>{label}</h3>,
}));

jest.mock('@/theme/documentation-url', () => ({
  useDocumentationUrl: () => 'https://docs.example.test',
}));

describe('AssistantWebwidgetDeploymentDialog', () => {
  const originalOpen = window.open;

  beforeEach(() => {
    window.open = jest.fn();
  });

  afterEach(() => {
    window.open = originalOpen;
  });

  it('renders deployment snippets with the assistant id', () => {
    render(
      <AssistantWebwidgetDeploymentDialog
        modalOpen
        setModalOpen={jest.fn()}
        assistantId="assistant-123"
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Deployment completed' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/app.min.js/)).toBeInTheDocument();
    expect(screen.getByText(/assistant-123/)).toBeInTheDocument();
  });

  it('opens documentation with the standard action icon', () => {
    render(
      <AssistantWebwidgetDeploymentDialog
        modalOpen
        setModalOpen={jest.fn()}
        assistantId="assistant-123"
      />,
    );

    const documentationButton = screen.getByRole('button', {
      name: 'View Documentation',
    });
    expect(screen.getByTestId('documentation-icon')).toBeInTheDocument();

    fireEvent.click(documentationButton);

    expect(window.open).toHaveBeenCalledWith(
      'https://docs.example.test',
      '_blank',
    );
  });
});
