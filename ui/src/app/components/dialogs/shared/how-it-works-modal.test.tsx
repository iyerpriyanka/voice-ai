import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HowItWorksDialog } from '@/app/components/dialogs/shared/how-it-works-modal';

jest.mock('@/app/components/ui/primitives/modal', () => ({
  Modal: ({ open, children }: any) =>
    open ? <div data-testid="modal">{children}</div> : null,
  ModalHeader: ({ title }: any) => <h2>{title}</h2>,
  ModalBody: ({ children }: any) => <div>{children}</div>,
  ModalFooter: ({ children }: any) => <footer>{children}</footer>,
}));

jest.mock('@carbon/icons-react', () => ({
  Checkmark: () => <svg data-testid="checkmark-icon" />,
}));

jest.mock('@carbon/react', () => ({
  Button: ({ children, kind, renderIcon: Icon, ...props }: any) => (
    <button data-carbon-button-kind={kind} {...props}>
      {children}
      {Icon ? <Icon /> : null}
    </button>
  ),
}));

describe('HowItWorksDialog', () => {
  const steps = [
    {
      title: 'Connect source',
      icon: <span data-testid="step-icon" />,
      description: 'Pick the source data.',
    },
  ];

  it('renders the configured title and steps', () => {
    render(
      <HowItWorksDialog
        modalOpen
        setModalOpen={jest.fn()}
        title="Knowledge flow"
        steps={steps}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Knowledge flow' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Connect source')).toBeInTheDocument();
    expect(screen.getByText('Pick the source data.')).toBeInTheDocument();
  });

  it('uses a Carbon primary button for the close action', () => {
    const setModalOpen = jest.fn();
    render(
      <HowItWorksDialog modalOpen setModalOpen={setModalOpen} steps={steps} />,
    );

    const closeButton = screen.getByRole('button', { name: 'Got it' });
    expect(closeButton).toHaveAttribute('data-carbon-button-kind', 'primary');
    expect(screen.getByTestId('checkmark-icon')).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(setModalOpen).toHaveBeenCalledWith(false);
  });
});
