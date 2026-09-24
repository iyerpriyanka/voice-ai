import {
  ConnectionConfig,
  CreateProjectCredential,
  CreateProviderKey,
  DeleteProviderKey,
  GetAllOrganizationCredential,
  GetAllProjectCredential,
} from '@rapidaai/react';
import { Struct } from 'google-protobuf/google/protobuf/struct_pb';

import {
  createProjectPublishableCredential,
  createProviderCredential,
  deleteProviderCredential,
  listOrganizationCredentials,
  listProjectCredentials,
} from '@/clients';

jest.mock('@/configs', () => ({
  connectionConfig: { endpoint: 'test-endpoint' },
}));

jest.mock('@rapidaai/react', () => {
  class CreateProviderCredentialRequest {
    private credential: unknown;
    private name = '';
    private provider = '';

    setCredential(value: unknown) {
      this.credential = value;
    }

    setName(value: string) {
      this.name = value;
    }

    setProvider(value: string) {
      this.provider = value;
    }

    getCredential() {
      return this.credential;
    }

    getName() {
      return this.name;
    }

    getProvider() {
      return this.provider;
    }
  }

  return {
    ConnectionConfig: {
      WithDebugger: jest.fn(metadata => ({ debugger: metadata })),
    },
    CreateProjectCredential: jest.fn(),
    CreateProviderCredentialRequest,
    CreateProviderKey: jest.fn(),
    DeleteProviderKey: jest.fn(),
    GetAllOrganizationCredential: jest.fn(),
    GetAllProjectCredential: jest.fn(),
  };
});

jest.mock('google-protobuf/google/protobuf/struct_pb', () => ({
  Struct: {
    fromJavaScript: jest.fn(value => ({ value })),
  },
}));

const auth = {
  projectId: 'project-1',
  token: 'token-1',
  userId: 'user-1',
};

const headers = {
  authorization: 'token-1',
  'x-auth-id': 'user-1',
};

describe('credential client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists organization credentials with debugger metadata', () => {
    const callback = jest.fn();
    const criteria = [{ key: 'provider', value: 'openai', logic: 'eq' }];

    listOrganizationCredentials({
      page: 1,
      pageSize: 100,
      criteria,
      auth,
      callback,
    });

    const metadata = (ConnectionConfig.WithDebugger as jest.Mock).mock
      .results[0].value;
    expect(GetAllOrganizationCredential).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      1,
      100,
      criteria,
      callback,
      metadata,
    );
    expect(ConnectionConfig.WithDebugger).toHaveBeenCalledWith({
      authorization: 'token-1',
      userId: 'user-1',
      projectId: 'project-1',
    });
  });

  it('creates provider credentials with debugger metadata', () => {
    createProviderCredential({
      provider: 'openai',
      name: 'Production key',
      config: { api_key: 'secret' },
      auth,
    });

    const metadata = (ConnectionConfig.WithDebugger as jest.Mock).mock
      .results[0].value;
    const request = (CreateProviderKey as jest.Mock).mock.calls[0][1];

    expect(request.getProvider()).toBe('openai');
    expect(request.getName()).toBe('Production key');
    expect(Struct.fromJavaScript).toHaveBeenCalledWith({
      api_key: 'secret',
    });
    expect(CreateProviderKey).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      request,
      metadata,
    );
  });

  it('deletes provider credentials with debugger metadata', () => {
    const callback = jest.fn();

    deleteProviderCredential({
      credentialId: 'credential-1',
      auth,
      callback,
    });

    const metadata = (ConnectionConfig.WithDebugger as jest.Mock).mock
      .results[0].value;
    expect(DeleteProviderKey).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'credential-1',
      callback,
      metadata,
    );
  });

  it('creates and lists project publishable credentials with auth headers', () => {
    const callback = jest.fn();

    createProjectPublishableCredential({
      projectId: 'project-1',
      name: 'publishable key',
      auth,
      callback,
    });
    listProjectCredentials({
      projectId: 'project-1',
      auth,
      callback,
    });

    expect(CreateProjectCredential).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'project-1',
      'publishable key',
      callback,
      headers,
    );
    expect(GetAllProjectCredential).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'project-1',
      callback,
      headers,
    );
  });
});
