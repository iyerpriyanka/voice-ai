import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { EndpointOverviewPage } from '../overview-page';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const currentEndpoint = {
  getId: () => 'endpoint-1',
  getName: () => 'Customer support analysis',
  getDescription: () => 'Summarizes support conversations.',
  getStatus: () => 'Active',
  getVisibility: () => 'Private',
  getLanguage: () => 'English',
} as any;

const currentEndpointProviderModel = {
  getId: () => 'provider-model-1',
  getModelprovidername: () => 'OpenAI',
} as any;

describe('EndpointOverviewPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('uses Carbon overview patterns for endpoint metadata and use cases', () => {
    render(
      <EndpointOverviewPage
        currentEndpoint={currentEndpoint}
        currentEndpointProviderModel={currentEndpointProviderModel}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Endpoint details' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Private')).toBeInTheDocument();
    expect(screen.getByText('provider-model-1')).toBeInTheDocument();
    expect(screen.getAllByTestId('endpoint-use-case')).toHaveLength(2);
  });

  it('opens the endpoint playground from the primary action', () => {
    render(
      <EndpointOverviewPage
        currentEndpoint={currentEndpoint}
        currentEndpointProviderModel={currentEndpointProviderModel}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open playground' }));
    expect(mockNavigate).toHaveBeenCalledWith(
      '/deployment/endpoint/endpoint-1/playground',
    );
  });
});
