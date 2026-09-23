import {
  ConnectionConfig,
  GetActivities,
  GetAllAssistantToolLog,
  GetAllHTTPLog,
  GetMessages,
} from '@rapidaai/react';

import {
  listActivities,
  listConversationMessages,
  listToolActivityLogs,
  listWebhookLogs,
} from '@/clients';

jest.mock('@/configs', () => ({
  connectionConfig: { endpoint: 'test-endpoint' },
}));

jest.mock('@rapidaai/react', () => {
  class Paginate {
    private page = 0;
    private pageSize = 0;

    setPage(page: number) {
      this.page = page;
    }

    setPagesize(pageSize: number) {
      this.pageSize = pageSize;
    }

    getPage() {
      return this.page;
    }

    getPagesize() {
      return this.pageSize;
    }
  }

  class Criteria {
    private key = '';
    private value = '';
    private logic = '';

    setKey(key: string) {
      this.key = key;
    }

    setValue(value: string) {
      this.value = value;
    }

    setLogic(logic: string) {
      this.logic = logic;
    }

    getKey() {
      return this.key;
    }

    getValue() {
      return this.value;
    }

    getLogic() {
      return this.logic;
    }
  }

  class RequestWithProject {
    private projectId = '';
    private paginate?: Paginate;
    private criterias: Criteria[] = [];

    setProjectid(projectId: string) {
      this.projectId = projectId;
    }

    getProjectid() {
      return this.projectId;
    }

    setPaginate(paginate: Paginate) {
      this.paginate = paginate;
    }

    getPaginate() {
      return this.paginate;
    }

    addCriterias(criteria: Criteria) {
      this.criterias.push(criteria);
    }

    getCriteriasList() {
      return this.criterias;
    }
  }

  return {
    ConnectionConfig: {
      WithDebugger: jest.fn(metadata => ({ debugger: metadata })),
    },
    Criteria,
    CreateConversationMetric: jest.fn(),
    CreateMessageMetric: jest.fn(),
    GetActivities: jest.fn(),
    GetActivity: jest.fn(),
    GetAllAssistantHTTPLogRequest: RequestWithProject,
    GetAllAssistantToolLog: jest.fn(),
    GetAllAssistantToolLogRequest: RequestWithProject,
    GetAllHTTPLog: jest.fn(),
    GetAllTelemetry: jest.fn(),
    GetAssistantToolLog: jest.fn(),
    GetHTTPLog: jest.fn(),
    GetMessages: jest.fn(),
    Paginate,
    RetryHTTPLog: jest.fn(),
  };
});

const auth = {
  projectId: 'project-1',
  token: 'token-1',
  userId: 'user-1',
};

const criteria = [{ key: 'status', value: 'success', logic: 'eq' }];

describe('activity client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists activity logs with debugger metadata', () => {
    const callback = jest.fn();

    listActivities({
      projectId: 'project-1',
      page: 2,
      pageSize: 50,
      criteria,
      auth,
      callback,
    });

    const debuggerMetadata = (ConnectionConfig.WithDebugger as jest.Mock).mock
      .results[0].value;
    expect(GetActivities).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'project-1',
      2,
      50,
      criteria,
      callback,
      debuggerMetadata,
    );
    expect(ConnectionConfig.WithDebugger).toHaveBeenCalledWith({
      authorization: 'token-1',
      projectId: 'project-1',
      userId: 'user-1',
    });
  });

  it('lists webhook logs with request pagination, criteria, and metadata', () => {
    listWebhookLogs({
      projectId: 'project-1',
      page: 3,
      pageSize: 25,
      criteria,
      auth,
    });

    const request = (GetAllHTTPLog as jest.Mock).mock.calls[0][1];
    expect(GetAllHTTPLog).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      request,
      {
        authorization: 'token-1',
        'x-project-id': 'project-1',
        'x-auth-id': 'user-1',
      },
    );
    expect(request.getProjectid()).toBe('project-1');
    expect(request.getPaginate().getPage()).toBe(3);
    expect(request.getPaginate().getPagesize()).toBe(25);
    expect(request.getCriteriasList()[0].getKey()).toBe('status');
    expect(request.getCriteriasList()[0].getValue()).toBe('success');
    expect(request.getCriteriasList()[0].getLogic()).toBe('eq');
  });

  it('lists tool activity logs with debugger metadata', () => {
    listToolActivityLogs({
      projectId: 'project-1',
      page: 4,
      pageSize: 10,
      criteria,
      auth,
    });

    const request = (GetAllAssistantToolLog as jest.Mock).mock.calls[0][1];
    const debuggerMetadata = (ConnectionConfig.WithDebugger as jest.Mock).mock
      .results[0].value;
    expect(GetAllAssistantToolLog).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      request,
      debuggerMetadata,
    );
    expect(request.getProjectid()).toBe('project-1');
    expect(request.getPaginate().getPage()).toBe(4);
    expect(request.getPaginate().getPagesize()).toBe(10);
  });

  it('lists conversation messages with metadata', () => {
    const callback = jest.fn();

    listConversationMessages({
      page: 1,
      pageSize: 20,
      criteria,
      fields: ['metadata', 'metric'],
      auth,
      callback,
    });

    expect(GetMessages).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      1,
      20,
      criteria,
      ['metadata', 'metric'],
      callback,
      {
        authorization: 'token-1',
        'x-project-id': 'project-1',
        'x-auth-id': 'user-1',
      },
    );
  });
});
