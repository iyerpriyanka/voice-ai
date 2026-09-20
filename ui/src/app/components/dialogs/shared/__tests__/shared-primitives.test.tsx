import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  DeploymentRow,
  DeploymentSectionHeader,
} from '../deployment-modal-primitives';
import { ModalBody } from '../modal-body';
import { OverviewRow } from '../overview-row';

describe('shared dialog primitives', () => {
  it('renders modal body with forwarded attributes and spacing classes', () => {
    render(
      <ModalBody className="custom-body" data-testid="modal-body">
        Body content
      </ModalBody>,
    );

    expect(screen.getByTestId('modal-body')).toHaveClass(
      'custom-body',
      'flex',
      'gap-6',
    );
    expect(screen.getByTestId('modal-body')).toHaveTextContent('Body content');
  });

  it('renders overview rows with token text styles', () => {
    render(
      <OverviewRow label="Status" className="custom-row" data-testid="row">
        Connected
      </OverviewRow>,
    );

    expect(screen.getByTestId('row')).toHaveClass('custom-row', 'h-12');
    expect(screen.getByText('Status')).toHaveClass('text-muted');
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('renders deployment detail rows and section headers with theme tokens', () => {
    render(
      <>
        <DeploymentSectionHeader
          label="Deployment"
          className="custom-header"
          data-testid="section-header"
        />
        <DeploymentRow
          label="Endpoint"
          className="custom-deployment-row"
          data-testid="deployment-row"
        >
          Production
        </DeploymentRow>
      </>,
    );

    expect(screen.getByTestId('section-header')).toHaveClass(
      'custom-header',
      'bg-layer',
    );
    expect(screen.getByText('Deployment')).toHaveClass('text-muted');
    expect(screen.getByTestId('deployment-row')).toHaveClass(
      'custom-deployment-row',
      'h-12',
    );
    expect(screen.getByText('Endpoint')).toHaveClass('text-muted');
    expect(screen.getByText('Production')).toBeInTheDocument();
  });
});
