import {
  CreateEndpointCacheConfiguration,
  CreateEndpointRetryConfiguration,
  CreateEndpointTag,
  GetAllEndpoint,
  GetAllEndpointLog,
  GetAllEndpointProviderModel,
  GetEndpoint,
  GetEndpointLog,
  UpdateEndpointVersion,
  UpdateEndpointDetail,
} from '@rapidaai/react';

import {
  createEndpointCacheConfiguration,
  createEndpointRetryConfiguration,
  createEndpointTag,
  getEndpoint,
  getEndpointLogById,
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
  CreateEndpointCacheConfiguration: jest.fn(),
  CreateEndpointRetryConfiguration: jest.fn(),
  CreateEndpointTag: jest.fn(),
  GetAllEndpoint: jest.fn(),
  GetAllEndpointLog: jest.fn(),
  GetAllEndpointProviderModel: jest.fn(),
  GetEndpoint: jest.fn(),
  GetEndpointLog: jest.fn(),
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
