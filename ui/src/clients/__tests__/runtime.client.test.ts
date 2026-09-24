import {
  ConnectionConfig,
  CreatePhoneCall,
  StringToAny,
} from '@rapidaai/react';

import {
  createPreviewPhoneCall,
  createVoiceAgentDebuggerConnection,
  createVoiceAgentSDKConnection,
} from '@/clients';

jest.mock('@/configs', () => ({
  CONFIG: { connection: 'https://runtime.example.test' },
}));

jest.mock('@rapidaai/react', () => {
  class RuntimeConnection {
    auth: unknown;
    customEndpoint = '';

    constructor(auth: unknown) {
      this.auth = auth;
    }

    withCustomEndpoint(endpoint: string) {
      this.customEndpoint = endpoint;
      return this;
    }
  }

  class AssistantDefinition {
    assistantId = '';
    version = '';

    setAssistantid(assistantId: string) {
      this.assistantId = assistantId;
    }

    setVersion(version: string) {
      this.version = version;
    }
  }

  class CreatePhoneCallRequest {
    assistant: AssistantDefinition | null = null;
    argsMap = new Map();
    toNumber = '';

    setAssistant(assistant: AssistantDefinition) {
      this.assistant = assistant;
    }

    getArgsMap() {
      return this.argsMap;
    }

    setTonumber(toNumber: string) {
      this.toNumber = toNumber;
    }
  }

  return {
    AssistantDefinition,
    ConnectionConfig: {
      DefaultConnectionConfig: jest.fn(auth => new RuntimeConnection(auth)),
      WithDebugger: jest.fn(auth => ({ debuggerAuth: auth })),
      WithPersonalToken: jest.fn(auth => ({ personalTokenAuth: auth })),
      WithSDK: jest.fn(auth => ({ sdkAuth: auth })),
    },
    CreatePhoneCall: jest.fn(),
    CreatePhoneCallRequest,
    Invoke: jest.fn(),
    StringToAny: jest.fn(value => ({ stringValue: value })),
  };
});

const auth = {
  projectId: 'project-1',
  token: 'token-1',
  userId: 'user-1',
};

describe('runtime client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (ConnectionConfig.DefaultConnectionConfig as jest.Mock).mockImplementation(
      auth => ({
        auth,
        customEndpoint: '',
        withCustomEndpoint(endpoint: string) {
          this.customEndpoint = endpoint;
          return this;
        },
      }),
    );
    (ConnectionConfig.WithDebugger as jest.Mock).mockImplementation(auth => ({
      debuggerAuth: auth,
    }));
    (ConnectionConfig.WithPersonalToken as jest.Mock).mockImplementation(
      auth => ({
        personalTokenAuth: auth,
      }),
    );
    (ConnectionConfig.WithSDK as jest.Mock).mockImplementation(auth => ({
      sdkAuth: auth,
    }));
    (StringToAny as jest.Mock).mockImplementation(value => ({
      stringValue: value,
    }));
  });

  it('creates SDK voice-agent connections with the configured endpoint', () => {
    const connection = createVoiceAgentSDKConnection({
      apiKey: 'api-key-1',
      userId: 'public-user',
    }) as any;

    expect(ConnectionConfig.WithSDK).toHaveBeenCalledWith({
      ApiKey: 'api-key-1',
      UserId: 'public-user',
    });
    expect(connection.auth).toEqual({
      sdkAuth: {
        ApiKey: 'api-key-1',
        UserId: 'public-user',
      },
    });
    expect(connection.customEndpoint).toBe('https://runtime.example.test');
  });

  it('creates debugger voice-agent connections with the configured endpoint', () => {
    const connection = createVoiceAgentDebuggerConnection(auth) as any;

    expect(ConnectionConfig.WithDebugger).toHaveBeenCalledWith({
      authorization: 'token-1',
      projectId: 'project-1',
      userId: 'user-1',
    });
    expect(connection.auth).toEqual({
      debuggerAuth: {
        authorization: 'token-1',
        projectId: 'project-1',
        userId: 'user-1',
      },
    });
    expect(connection.customEndpoint).toBe('https://runtime.example.test');
  });

  it('creates preview phone calls through the runtime client boundary', async () => {
    const response = { getSuccess: () => true };
    (CreatePhoneCall as jest.Mock).mockResolvedValue(response);

    await expect(
      createPreviewPhoneCall({
        assistantId: 'assistant-1',
        toNumber: '+15551234567',
        args: new Map([['name', 'Priyanka']]),
        auth,
      }),
    ).resolves.toBe(response);

    expect(ConnectionConfig.WithPersonalToken).toHaveBeenCalledWith({
      Authorization: 'token-1',
      AuthId: 'user-1',
      ProjectId: 'project-1',
    });
    expect(CreatePhoneCall).toHaveBeenCalledWith(
      expect.objectContaining({
        auth: {
          personalTokenAuth: {
            Authorization: 'token-1',
            AuthId: 'user-1',
            ProjectId: 'project-1',
          },
        },
        customEndpoint: 'https://runtime.example.test',
      }),
      expect.objectContaining({
        assistant: expect.objectContaining({
          assistantId: 'assistant-1',
          version: 'latest',
        }),
        toNumber: '+15551234567',
      }),
    );

    const request = (CreatePhoneCall as jest.Mock).mock.calls[0][1];
    expect(request.argsMap.get('name')).toEqual({ stringValue: 'Priyanka' });
  });
});
