import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { UpdateKnowledgeDocumentSegment } from '@rapidaai/react';
import { EditKnowledgeDocumentSegmentDialog } from './edit-knowledge-document-segment-modal';

jest.mock('@rapidaai/react', () => ({
  UpdateKnowledgeDocumentSegment: jest.fn(),
}));

jest.mock('@/configs', () => ({
  connectionConfig: { endpoint: 'test-endpoint' },
}));

jest.mock('@/hooks/use-credential', () => ({
  useCurrentCredential: () => ({
    authId: 'auth-1',
    projectId: 'project-1',
    token: 'token-1',
  }),
}));

jest.mock('@/app/components/ui/modal', () => ({
  Modal: ({ open, children }: any) => (open ? <div>{children}</div> : null),
  ModalHeader: ({ title }: any) => <h2>{title}</h2>,
  ModalBody: ({ children }: any) => <main>{children}</main>,
  ModalFooter: ({ children }: any) => <footer>{children}</footer>,
}));

jest.mock('@/app/components/ui/button', () => ({
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
  Checkmark: () => <svg data-testid="update-icon" />,
}));

jest.mock('@/app/components/ui/form-label', () => ({
  FormLabel: ({ children }: any) => <label>{children}</label>,
}));

jest.mock('@/app/components/ui/fieldset', () => ({
  FieldSet: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/app/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

const mockUpdateKnowledgeDocumentSegment =
  UpdateKnowledgeDocumentSegment as jest.Mock;

const makeSegment = () => ({
  getDocumentId: () => 'document-1',
  getIndex: () => 7,
  getMetadata: () => ({
    getDocumentName: () => 'Original document',
  }),
  getEntities: () => ({
    getOrganizationsList: () => ['Org A'],
    getDatesList: () => ['2026-09-19'],
    getProductsList: () => [],
    getEventsList: () => [],
    getIndustriesList: () => [],
    getLocationsList: () => [],
    getPeopleList: () => [],
    getTimesList: () => [],
    getQuantitiesList: () => [],
  }),
});

describe('EditKnowledgeDocumentSegmentDialog', () => {
  beforeEach(() => {
    mockUpdateKnowledgeDocumentSegment.mockReset();
  });

  it('renders the segment fields with the standard update icon', () => {
    render(
      <EditKnowledgeDocumentSegmentDialog
        segment={makeSegment() as any}
        onClose={jest.fn()}
        onUpdate={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Edit Document Segment' }),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('document-1')).toBeDisabled();
    expect(screen.getByDisplayValue('Original document')).toBeInTheDocument();
    expect(screen.getByTestId('update-icon')).toBeInTheDocument();
  });

  it('submits trimmed entity values and closes after a successful update', () => {
    const onClose = jest.fn();
    const onUpdate = jest.fn();
    mockUpdateKnowledgeDocumentSegment.mockImplementation(
      (...args: unknown[]) => {
        const callback = args[13] as Function;
        callback(null, {});
      },
    );

    render(
      <EditKnowledgeDocumentSegmentDialog
        segment={makeSegment() as any}
        onClose={onClose}
        onUpdate={onUpdate}
      />,
    );

    fireEvent.change(
      screen.getByPlaceholderText('Enter organizations separated by commas'),
      { target: { value: 'Org A, Org B, ' } },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Update document' }));

    expect(mockUpdateKnowledgeDocumentSegment).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'document-1',
      '7',
      ['Org A', 'Org B'],
      ['2026-09-19'],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      'Original document',
      expect.any(Function),
      {
        authorization: 'token-1',
        'x-project-id': 'project-1',
        'x-auth-id': 'auth-1',
      },
    );
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
