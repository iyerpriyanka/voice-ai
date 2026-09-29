import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { EndpointSettingsPage } from '../settings-page';

const mockHideLoader = jest.fn();
const mockOnShowEditTagVisible = jest.fn();
const mockOnShowInstruction = jest.fn();
const mockOnUpdateEndpointDetail = jest.fn();
const mockShowLoader = jest.fn();
const mockToastSuccess = jest.fn();

jest.mock('@/hooks/use-credential', () => ({
  useCredential: () => ['user-1', 'token-1', 'project-1'],
}));

jest.mock('@/stores/app', () => ({
  useRapidaStore: () => ({
    loading: false,
    showLoader: mockShowLoader,
    hideLoader: mockHideLoader,
  }),
}));

jest.mock('@/stores/endpoint', () => ({
  useEndpointPageStore: () => ({
    onShowEditTagVisible: mockOnShowEditTagVisible,
    onShowInstruction: mockOnShowInstruction,
    onUpdateEndpointDetail: mockOnUpdateEndpointDetail,
  }),
}));

jest.mock('react-hot-toast/headless', () => ({
  success: (...args: unknown[]) => mockToastSuccess(...args),
}));

const currentEndpoint = {
  getId: () => 'endpoint-1',
  getName: () => 'Customer support analysis',
  getDescription: () => 'Summarizes support conversations.',
  getEndpointtag: () => ({ getTagList: () => ['support', 'production'] }),
} as any;

describe('EndpointSettingsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnUpdateEndpointDetail.mockImplementation(
      (
        _endpointId,
        _name,
        _description,
        _projectId,
        _token,
        _userId,
        _onError,
        onSuccess,
      ) => onSuccess(currentEndpoint),
    );
  });

  it('matches the Assistant general settings hierarchy and saves details', () => {
    render(<EndpointSettingsPage currentEndpoint={currentEndpoint} />);

    expect(
      screen.getByRole('heading', { name: 'General Settings' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Identity')).toBeInTheDocument();
    expect(screen.getByText('General Information')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Endpoint ID information' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Name information' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Description information' }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue('Customer support analysis'), {
      target: { value: 'Updated endpoint' },
    });
    fireEvent.change(
      screen.getByDisplayValue('Summarizes support conversations.'),
      {
        target: { value: 'Updated description' },
      },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(mockShowLoader).toHaveBeenCalledWith('block');
    expect(mockOnUpdateEndpointDetail).toHaveBeenCalledWith(
      'endpoint-1',
      'Updated endpoint',
      'Updated description',
      'project-1',
      'token-1',
      'user-1',
      expect.any(Function),
      expect.any(Function),
    );
    expect(mockHideLoader).toHaveBeenCalledTimes(1);
    expect(mockToastSuccess).toHaveBeenCalledWith(
      'The endpoint has been successfully updated.',
    );
  });

  it('keeps endpoint actions in settings and rejects an empty name', () => {
    render(<EndpointSettingsPage currentEndpoint={currentEndpoint} />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit tags' }));
    fireEvent.click(screen.getByRole('button', { name: 'View instructions' }));
    expect(mockOnShowEditTagVisible).toHaveBeenCalledWith(currentEndpoint);
    expect(mockOnShowInstruction).toHaveBeenCalledTimes(1);

    fireEvent.change(screen.getByDisplayValue('Customer support analysis'), {
      target: { value: '   ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(
      screen.getByText('Please provide an endpoint name.'),
    ).toBeInTheDocument();
    expect(mockOnUpdateEndpointDetail).not.toHaveBeenCalled();
  });
});
