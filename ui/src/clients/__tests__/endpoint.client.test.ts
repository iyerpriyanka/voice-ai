import {
  ConnectionConfig,
  CreateEndpoint,
  CreateEndpointCacheConfiguration,
  CreateEndpointProviderModel,
  CreateEndpointRetryConfiguration,
  CreateEndpointTag,
  GetAllEndpoint,
  GetAllEndpointLog,
  GetAllEndpointProviderModel,
  GetEndpoint,
  GetEndpointLog,
  Invoke,
  StringToAny,
  UpdateEndpointVersion,
  UpdateEndpointDetail,
} from '@rapidaai/react';

import {
  createEndpoint,
  createEndpointCacheConfiguration,
  createEndpointProviderModel,
  createEndpointRetryConfiguration,
  createEndpointTag,
  getEndpoint,
  getEndpointLogById,
  invokeEndpoint,
  listEndpointLogs,
  listEndpointProviderModels,
  listEndpoints,
  releaseEndpointVersion,
  updateEndpointDetail,
} from '@/clients';

jest.mock('@/configs', () => ({
  connectionConfig: { endpoint: 'test-endpoint' },
}));

jest.mock('@rapidaai/react', () => ({
  ConnectionConfig: {
    WithDebugger: jest.fn(auth => ({ debuggerAuth: auth })),
  },
  CreateEndpoint: jest.fn(),
  CreateEndpointCacheConfiguration: jest.fn(),
  CreateEndpointProviderModel: jest.fn(),
  CreateEndpointRetryConfiguration: jest.fn(),
  CreateEndpointTag: jest.fn(),
  GetAllEndpoint: jest.fn(),
  GetAllEndpointLog: jest.fn(),
  GetAllEndpointProviderModel: jest.fn(),
  GetEndpoint: jest.fn(),
  GetEndpointLog: jest.fn(),
  Invoke: jest.fn(),
  InvokeRequest: class {
    endpoint = null;
    metadataMap = new Map();
    argsMap = new Map();

    setEndpoint(endpoint) {
      this.endpoint = endpoint;
    }

    getMetadataMap() {
      return this.metadataMap;
    }

    getArgsMap() {
      return this.argsMap;
    }
  },
  EndpointDefinition: class {
    endpointId = '';
    version = '';

    setEndpointid(endpointId) {
      this.endpointId = endpointId;
    }

    setVersion(version) {
      this.version = version;
    }
  },
  StringToAny: jest.fn(value => ({ stringValue: value })),
  UpdateEndpointVersion: jest.fn(),
  UpdateEndpointDetail: jest.fn(),
}));

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

describe('endpoint client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (ConnectionConfig.WithDebugger as jest.Mock).mockImplementation(auth => ({
      debuggerAuth: auth,
    }));
    (StringToAny as jest.Mock).mockImplementation(value => ({
      stringValue: value,
    }));
  });

  it('lists endpoints with pagination, criteria, and metadata', () => {
    const callback = jest.fn();
    const criteria = [{ key: 'status', value: 'active', logic: 'match' }];

    listEndpoints({
      page: 2,
      pageSize: 50,
      criteria,
      auth,
      callback,
    });

    expect(GetAllEndpoint).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      2,
      50,
      criteria,
      callback,
      metadata,
    );
  });

  it('gets one endpoint with optional provider model id', () => {
    const callback = jest.fn();

    getEndpoint({
      endpointId: 'endpoint-1',
      endpointProviderModelId: 'model-1',
      auth,
      callback,
    });

    expect(GetEndpoint).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'endpoint-1',
      'model-1',
      metadata,
      callback,
    );
  });

  it('creates an endpoint with debugger metadata', () => {
    const callback = jest.fn();
    const endpointProviderModel = { model: 'provider' } as any;
    const endpoint = { name: 'endpoint' } as any;
    const retryConfig = { retry: 'fixed' } as any;
    const cacheConfig = { cache: 'semantic' } as any;

    createEndpoint({
      endpointProviderModel,
      endpoint,
      tags: ['production'],
      auth,
      callback,
      retryConfig,
      cacheConfig,
    });

    expect(ConnectionConfig.WithDebugger).toHaveBeenCalledWith({
      authorization: 'token-1',
      projectId: 'project-1',
      userId: 'user-1',
    });
    expect(CreateEndpoint).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      endpointProviderModel,
      endpoint,
      ['production'],
      {
        debuggerAuth: {
          authorization: 'token-1',
          projectId: 'project-1',
          userId: 'user-1',
        },
      },
      callback,
      retryConfig,
      cacheConfig,
    );
  });

  it('creates an endpoint provider model with debugger metadata', () => {
    const callback = jest.fn();
    const endpointProviderModel = { model: 'provider' } as any;

    createEndpointProviderModel({
      endpointId: 'endpoint-1',
      endpointProviderModel,
      auth,
      callback,
    });

    expect(ConnectionConfig.WithDebugger).toHaveBeenCalledWith({
      authorization: 'token-1',
      projectId: 'project-1',
      userId: 'user-1',
    });
    expect(CreateEndpointProviderModel).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'endpoint-1',
      endpointProviderModel,
      {
        debuggerAuth: {
          authorization: 'token-1',
          projectId: 'project-1',
          userId: 'user-1',
        },
      },
      callback,
    );
  });

  it('creates endpoint tags through the API client', () => {
    const callback = jest.fn();

    createEndpointTag({
      endpointId: 'endpoint-1',
      tags: ['production'],
      auth,
      callback,
    });

    expect(CreateEndpointTag).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'endpoint-1',
      ['production'],
      metadata,
      callback,
    );
  });

  it('creates retry configuration through the API client', () => {
    const callback = jest.fn();

    createEndpointRetryConfiguration({
      endpointId: 'endpoint-1',
      retryType: 'fixed',
      maxAttempts: '3',
      delaySeconds: '10',
      exponentialBackoff: true,
      retryables: ['timeout'],
      auth,
      callback,
    });

    expect(CreateEndpointRetryConfiguration).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'endpoint-1',
      'fixed',
      '3',
      '10',
      true,
      ['timeout'],
      metadata,
      callback,
    );
  });

  it('creates cache configuration through the API client', () => {
    const callback = jest.fn();

    createEndpointCacheConfiguration({
      endpointId: 'endpoint-1',
      cacheType: 'semantic',
      expiryInterval: '60',
      matchThreshold: 0.8,
      auth,
      callback,
    });

    expect(CreateEndpointCacheConfiguration).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'endpoint-1',
      'semantic',
      '60',
      0.8,
      metadata,
      callback,
    );
  });

  it('updates endpoint details through the API client', () => {
    const callback = jest.fn();

    updateEndpointDetail({
      endpointId: 'endpoint-1',
      name: 'Production endpoint',
      description: 'Handles production traffic',
      auth,
      callback,
    });

    expect(UpdateEndpointDetail).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'endpoint-1',
      'Production endpoint',
      'Handles production traffic',
      metadata,
      callback,
    );
  });

  it('lists endpoint provider models with metadata', () => {
    const callback = jest.fn();
    const criteria = [{ key: 'status', value: 'active' }];

    listEndpointProviderModels({
      endpointId: 'endpoint-1',
      page: 1,
      pageSize: 20,
      criteria,
      auth,
      callback,
    });

    expect(GetAllEndpointProviderModel).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'endpoint-1',
      1,
      20,
      criteria,
      callback,
      metadata,
    );
  });

  it('releases an endpoint version with metadata', () => {
    const callback = jest.fn();

    releaseEndpointVersion({
      endpointId: 'endpoint-1',
      endpointProviderModelId: 'model-1',
      auth,
      callback,
    });

    expect(UpdateEndpointVersion).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'endpoint-1',
      'model-1',
      metadata,
      callback,
    );
  });

  it('invokes an endpoint with request metadata and arguments', async () => {
    const invokeResponse = { success: true };
    const arg = StringToAny('Ada');
    (Invoke as jest.Mock).mockResolvedValue(invokeResponse);

    await expect(
      invokeEndpoint({
        endpointId: 'endpoint-1',
        endpointProviderModelId: 'model-1',
        args: new Map([['name', arg]]),
        auth,
      }),
    ).resolves.toBe(invokeResponse);

    expect(ConnectionConfig.WithDebugger).toHaveBeenCalledWith({
      authorization: 'token-1',
      projectId: 'project-1',
      userId: 'user-1',
    });
    expect(Invoke).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      expect.objectContaining({
        endpoint: expect.objectContaining({
          endpointId: 'endpoint-1',
          version: 'model-1',
        }),
      }),
      {
        debuggerAuth: {
          authorization: 'token-1',
          projectId: 'project-1',
          userId: 'user-1',
        },
      },
    );

    const request = (Invoke as jest.Mock).mock.calls[0][1];
    expect(request.metadataMap.get('source')).toEqual({
      stringValue: 'web-app',
    });
    expect(request.metadataMap.get('experiemental')).toEqual({
      stringValue: 'true',
    });
    expect(request.argsMap.get('name')).toBe(arg);
  });

  it('lists endpoint logs with metadata', () => {
    const callback = jest.fn();
    const criteria = [{ key: 'status', value: 'success', logic: 'match' }];

    listEndpointLogs({
      endpointId: 'endpoint-1',
      page: 1,
      pageSize: 10,
      criteria,
      auth,
      callback,
    });

    expect(GetAllEndpointLog).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'endpoint-1',
      1,
      10,
      criteria,
      callback,
      metadata,
    );
  });

  it('gets one endpoint log with metadata', () => {
    const callback = jest.fn();

    getEndpointLogById({
      endpointId: 'endpoint-1',
      logId: 'log-1',
      auth,
      callback,
    });

    expect(GetEndpointLog).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'endpoint-1',
      'log-1',
      callback,
      metadata,
    );
  });
});
