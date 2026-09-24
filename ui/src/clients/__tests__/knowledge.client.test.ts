import {
  ConnectionConfig,
  DeleteKnowledgeDocumentSegment,
  GetKnowledgeBase,
  GetKnowledgeLog,
  UpdateKnowledgeDocumentSegment,
} from '@rapidaai/react';

import {
  deleteKnowledgeDocumentSegmentByReason,
  getKnowledgeBaseDetail,
  getKnowledgeActivityLog,
  updateKnowledgeDocumentSegmentEntities,
} from '@/clients/knowledge.client';

jest.mock('@/configs', () => ({
  connectionConfig: { endpoint: 'test-endpoint' },
}));

jest.mock('@rapidaai/react', () => {
  class GetKnowledgeLogRequest {
    private id = '';
    private projectId = '';

    setId(id: string) {
      this.id = id;
    }

    getId() {
      return this.id;
    }

    setProjectid(projectId: string) {
      this.projectId = projectId;
    }

    getProjectid() {
      return this.projectId;
    }
  }

  return {
    ConnectionConfig: {
      WithDebugger: jest.fn(metadata => ({ debugger: metadata })),
    },
    Criteria: class {},
    CreateKnowledge: jest.fn(),
    CreateKnowledgeDocument: jest.fn(),
    CreateKnowledgeRequest: class {},
    CreateKnowledgeTag: jest.fn(),
    DeleteKnowledgeDocumentSegment: jest.fn(),
    GetAllKnowledgeBases: jest.fn(),
    GetAllKnowledgeDocument: jest.fn(),
    GetAllKnowledgeDocumentSegment: jest.fn(),
    GetAllKnowledgeLog: jest.fn(),
    GetAllKnowledgeLogRequest: class {},
    GetKnowledgeBase: jest.fn(),
    GetKnowledgeLog: jest.fn(),
    GetKnowledgeLogRequest,
    IndexKnowledgeDocument: jest.fn(),
    Paginate: class {},
    UpdateKnowledgeDetail: jest.fn(),
    UpdateKnowledgeDocumentSegment: jest.fn(),
  };
});

const auth = {
  projectId: 'project-1',
  token: 'token-1',
  userId: 'user-1',
};

const metadata = {
  authorization: 'token-1',
  'x-project-id': 'project-1',
  'x-auth-id': 'user-1',
};

describe('knowledge client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('gets a knowledge activity log with debugger metadata', () => {
    getKnowledgeActivityLog({
      projectId: 'project-1',
      activityId: 'knowledge-log-1',
      auth,
    });

    const request = (GetKnowledgeLog as jest.Mock).mock.calls[0][1];
    const debuggerMetadata = (ConnectionConfig.WithDebugger as jest.Mock).mock
      .results[0].value;

    expect(request.getId()).toBe('knowledge-log-1');
    expect(request.getProjectid()).toBe('project-1');
    expect(GetKnowledgeLog).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      request,
      debuggerMetadata,
    );
    expect(ConnectionConfig.WithDebugger).toHaveBeenCalledWith({
      authorization: 'token-1',
      userId: 'user-1',
      projectId: 'project-1',
    });
  });

  it('gets a knowledge base detail with debugger metadata', () => {
    const callback = jest.fn();

    getKnowledgeBaseDetail({
      knowledgeId: 'knowledge-1',
      auth,
      callback,
    });

    const debuggerMetadata = (ConnectionConfig.WithDebugger as jest.Mock).mock
      .results[0].value;
    expect(GetKnowledgeBase).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'knowledge-1',
      callback,
      debuggerMetadata,
    );
  });

  it('deletes a document segment with API metadata', () => {
    const callback = jest.fn();

    deleteKnowledgeDocumentSegmentByReason({
      documentId: 'document-1',
      segmentIndex: '2',
      reason: 'outdated',
      auth,
      callback,
    });

    expect(DeleteKnowledgeDocumentSegment).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'document-1',
      '2',
      'outdated',
      callback,
      metadata,
    );
  });

  it('updates document segment entities with API metadata', () => {
    const callback = jest.fn();

    updateKnowledgeDocumentSegmentEntities({
      documentId: 'document-1',
      segmentIndex: '7',
      organizations: ['Org A'],
      dates: ['2026-09-19'],
      products: [],
      events: [],
      people: [],
      times: [],
      quantities: [],
      locations: [],
      industries: [],
      documentName: 'Original document',
      auth,
      callback,
    });

    expect(UpdateKnowledgeDocumentSegment).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'document-1',
      '7',
      ['Org A'],
      ['2026-09-19'],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      'Original document',
      callback,
      metadata,
    );
  });
});
