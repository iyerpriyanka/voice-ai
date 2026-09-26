import {
  ConnectionConfig,
  CreateAssistantApiDeployment,
  CreateAssistantConfiguration,
  DeleteAssistant,
  DisableAssistantApiDeployment,
  GetAllAssistantApiDeployment,
  GetAllAssistantDebuggerDeployment,
  GetAssistant,
  GetAssistantApiDeployment,
  GetAssistantConfiguration,
  GetAssistantConversation,
  GetAssistantDashboard,
  UpdateAssistantConfiguration,
  UpdateAssistantDetail,
} from '@rapidaai/react';

import {
  createAssistantDeploymentByType,
  createAssistantConfigurationForAssistant,
  deleteAssistantById,
  disableAssistantDeploymentByType,
  getAssistantById,
  getAssistantByIdWithApi,
  getAssistantConfigurationById,
  getAssistantConversationDetail,
  getAssistantDeploymentByType,
  getAssistantDashboardRange,
  listAssistantDeploymentVersions,
  updateAssistantConfigurationById,
  updateAssistantDescription,
} from '@/clients/assistant.client';

jest.mock('@/configs', () => ({
  connectionConfig: { endpoint: 'test-endpoint' },
}));

jest.mock('@rapidaai/react', () => {
  class AssistantDefinition {
    private assistantId = '';
    private version = '';

    setAssistantid(assistantId: string) {
      this.assistantId = assistantId;
    }

    getAssistantid() {
      return this.assistantId;
    }

    setVersion(version: string) {
      this.version = version;
    }

    getVersion() {
      return this.version;
    }
  }

  class GetAssistantRequest {
    private assistantDefinition?: AssistantDefinition;

    setAssistantdefinition(assistantDefinition: AssistantDefinition) {
      this.assistantDefinition = assistantDefinition;
    }

    getAssistantdefinition() {
      return this.assistantDefinition;
    }
  }

  class GetAssistantDashboardRequest {
    private assistantId = '';
    private fromDate: unknown;
    private toDate: unknown;

    setAssistantid(assistantId: string) {
      this.assistantId = assistantId;
    }

    getAssistantid() {
      return this.assistantId;
    }

    setFromdate(fromDate: unknown) {
      this.fromDate = fromDate;
    }

    getFromdate() {
      return this.fromDate;
    }

    setTodate(toDate: unknown) {
      this.toDate = toDate;
    }

    getTodate() {
      return this.toDate;
    }
  }

  class FieldSelector {
    private field = '';

    setField(field: string) {
      this.field = field;
    }

    getField() {
      return this.field;
    }
  }

  class GetAssistantConversationRequest {
    private assistantId = '';
    private id = '';
    private selectors: FieldSelector[] = [];

    setAssistantid(assistantId: string) {
      this.assistantId = assistantId;
    }

    getAssistantid() {
      return this.assistantId;
    }

    setId(id: string) {
      this.id = id;
    }

    getId() {
      return this.id;
    }

    addSelectors(selector: FieldSelector) {
      this.selectors.push(selector);
    }

    getSelectorsList() {
      return this.selectors;
    }
  }

  class Paginate {
    private page = 0;
    private pageSize = 0;

    setPage(page: number) {
      this.page = page;
    }

    getPage() {
      return this.page;
    }

    setPagesize(pageSize: number) {
      this.pageSize = pageSize;
    }

    getPagesize() {
      return this.pageSize;
    }
  }

  class GetAllAssistantDeploymentRequest {
    private assistantId = '';
    private paginate?: Paginate;

    setAssistantid(assistantId: string) {
      this.assistantId = assistantId;
    }

    getAssistantid() {
      return this.assistantId;
    }

    setPaginate(paginate: Paginate) {
      this.paginate = paginate;
    }

    getPaginate() {
      return this.paginate;
    }
  }

  class GetAssistantDeploymentRequest {
    private assistantId = '';

    setAssistantid(assistantId: string) {
      this.assistantId = assistantId;
    }

    getAssistantid() {
      return this.assistantId;
    }
  }

  class CreateAssistantDeploymentRequest {
    private api: unknown;
    private debuggerDeployment: unknown;
    private phone: unknown;
    private plugin: unknown;

    setApi(deployment: unknown) {
      this.api = deployment;
    }

    getApi() {
      return this.api;
    }

    setDebugger(deployment: unknown) {
      this.debuggerDeployment = deployment;
    }

    getDebugger() {
      return this.debuggerDeployment;
    }

    setPhone(deployment: unknown) {
      this.phone = deployment;
    }

    getPhone() {
      return this.phone;
    }

    setPlugin(deployment: unknown) {
      this.plugin = deployment;
    }

    getPlugin() {
      return this.plugin;
    }
  }

  class AssistantConfigurationRequest {
    private id = '';
    private assistantId = '';
    private configurationType = '';
    private provider = '';
    private enabled = false;
    private options: unknown[] = [];

    setId(id: string) {
      this.id = id;
    }

    getId() {
      return this.id;
    }

    setAssistantid(assistantId: string) {
      this.assistantId = assistantId;
    }

    getAssistantid() {
      return this.assistantId;
    }

    setConfigurationtype(configurationType: string) {
      this.configurationType = configurationType;
    }

    getConfigurationtype() {
      return this.configurationType;
    }

    setProvider(provider: string) {
      this.provider = provider;
    }

    getProvider() {
      return this.provider;
    }

    setEnabled(enabled: boolean) {
      this.enabled = enabled;
    }

    getEnabled() {
      return this.enabled;
    }

    setOptionsList(options: unknown[]) {
      this.options = options;
    }

    getOptionsList() {
      return this.options;
    }
  }

  return {
    ConnectionConfig: {
      WithDebugger: jest.fn(metadata => ({ debugger: metadata })),
    },
    AssistantConfiguration: class {},
    AssistantDefinition,
    Criteria: class {},
    CreateAssistant: jest.fn(),
    CreateAssistantApiDeployment: jest.fn(),
    CreateAssistantDeploymentRequest,
    CreateAssistantConfiguration: jest.fn(),
    CreateAssistantConfigurationRequest: AssistantConfigurationRequest,
    CreateAssistantDebuggerDeployment: jest.fn(),
    CreateAssistantKnowledge: jest.fn(),
    CreateAssistantPhoneDeployment: jest.fn(),
    CreateAssistantProvider: jest.fn(),
    CreateAssistantTag: jest.fn(),
    CreateAssistantTool: jest.fn(),
    CreateAssistantWebpluginDeployment: jest.fn(),
    CreateAssistantWhatsappDeployment: jest.fn(),
    DeleteAssistant: jest.fn(),
    DeleteAssistantConfiguration: jest.fn(),
    DeleteAssistantKnowledge: jest.fn(),
    DeleteAssistantTool: jest.fn(),
    DeleteAssistantConfigurationRequest: AssistantConfigurationRequest,
    DisableAssistantApiDeployment: jest.fn(),
    DisableAssistantDebuggerDeployment: jest.fn(),
    DisableAssistantPhoneDeployment: jest.fn(),
    DisableAssistantWebpluginDeployment: jest.fn(),
    DisableAssistantWhatsappDeployment: jest.fn(),
    FieldSelector,
    GetAllAssistant: jest.fn(),
    GetAllAssistantApiDeployment: jest.fn(),
    GetAllAssistantConfiguration: jest.fn(),
    GetAllAssistantConfigurationRequest: class {},
    GetAllAssistantConversation: jest.fn(),
    GetAllAssistantConversationMessage: jest.fn(),
    GetAllAssistantDebuggerDeployment: jest.fn(),
    GetAllAssistantDeploymentRequest,
    GetAllAssistantKnowledge: jest.fn(),
    GetAllAssistantPhoneDeployment: jest.fn(),
    GetAllAssistantProvider: jest.fn(),
    GetAllAssistantRequest: class {},
    GetAllAssistantTool: jest.fn(),
    GetAllAssistantWebpluginDeployment: jest.fn(),
    GetAllAssistantWhatsappDeployment: jest.fn(),
    GetAssistant: jest.fn(),
    GetAssistantApiDeployment: jest.fn(),
    GetAssistantConfiguration: jest.fn(),
    GetAssistantConfigurationRequest: AssistantConfigurationRequest,
    GetAssistantConversation: jest.fn(),
    GetAssistantConversationRequest,
    GetAssistantDashboard: jest.fn(),
    GetAssistantDashboardRequest,
    GetAssistantDebuggerDeployment: jest.fn(),
    GetAssistantKnowledge: jest.fn(),
    GetAssistantMessages: jest.fn(),
    GetAssistantPhoneDeployment: jest.fn(),
    GetAssistantDeploymentRequest,
    GetAssistantRequest,
    GetAssistantTool: jest.fn(),
    GetAssistantWebpluginDeployment: jest.fn(),
    GetAssistantWhatsappDeployment: jest.fn(),
    Paginate,
    UpdateAssistantConfiguration: jest.fn(),
    UpdateAssistantConfigurationRequest: AssistantConfigurationRequest,
    UpdateAssistantDetail: jest.fn(),
    UpdateAssistantKnowledge: jest.fn(),
    UpdateAssistantTool: jest.fn(),
    UpdateAssistantVersion: jest.fn(),
    UpdateAssistantVersionRequest: class {},
  };
});

const auth = {
  projectId: 'project-1',
  token: 'token-1',
  userId: 'user-1',
};

const apiMetadata = {
  authorization: 'token-1',
  'x-project-id': 'project-1',
  'x-auth-id': 'user-1',
};

describe('assistant client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('gets an assistant by id with optional provider version', () => {
    getAssistantById({
      assistantId: 'assistant-1',
      assistantProviderModelId: 'version-1',
      auth,
    });

    const request = (GetAssistant as jest.Mock).mock.calls[0][1];
    const assistantDefinition = request.getAssistantdefinition();
    const debuggerMetadata = (ConnectionConfig.WithDebugger as jest.Mock).mock
      .results[0].value;

    expect(assistantDefinition.getAssistantid()).toBe('assistant-1');
    expect(assistantDefinition.getVersion()).toBe('version-1');
    expect(GetAssistant).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      request,
      debuggerMetadata,
    );
    expect(ConnectionConfig.WithDebugger).toHaveBeenCalledWith({
      authorization: 'token-1',
      projectId: 'project-1',
      userId: 'user-1',
    });
  });

  it('gets an assistant by id with API metadata', () => {
    getAssistantByIdWithApi({
      assistantId: 'assistant-1',
      auth,
    });

    const request = (GetAssistant as jest.Mock).mock.calls[0][1];

    expect(request.getAssistantdefinition().getAssistantid()).toBe(
      'assistant-1',
    );
    expect(GetAssistant).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      request,
      apiMetadata,
    );
  });

  it('updates assistant description with API metadata', () => {
    const callback = jest.fn();

    updateAssistantDescription({
      assistantId: 'assistant-1',
      name: 'Support',
      description: 'Handles support conversations',
      auth,
      callback,
    });

    expect(UpdateAssistantDetail).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'assistant-1',
      'Support',
      'Handles support conversations',
      callback,
      apiMetadata,
    );
  });

  it('deletes an assistant with API metadata', () => {
    const callback = jest.fn();

    deleteAssistantById({
      assistantId: 'assistant-1',
      auth,
      callback,
    });

    expect(DeleteAssistant).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'assistant-1',
      callback,
      apiMetadata,
    );
  });

  it('creates assistant configuration with API metadata', () => {
    const options = [{ key: 'endpoint' }];

    createAssistantConfigurationForAssistant({
      assistantId: 'assistant-1',
      configurationType: 'webhook',
      provider: 'http',
      enabled: true,
      options: options as any,
      auth,
    });

    const request = (CreateAssistantConfiguration as jest.Mock).mock
      .calls[0][1];
    expect(request.getAssistantid()).toBe('assistant-1');
    expect(request.getConfigurationtype()).toBe('webhook');
    expect(request.getProvider()).toBe('http');
    expect(request.getEnabled()).toBe(true);
    expect(request.getOptionsList()).toBe(options);
    expect(CreateAssistantConfiguration).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      request,
      apiMetadata,
    );
  });

  it('gets assistant configuration by id with API metadata', () => {
    getAssistantConfigurationById({
      assistantId: 'assistant-1',
      configurationId: 'config-1',
      auth,
    });

    const request = (GetAssistantConfiguration as jest.Mock).mock.calls[0][1];
    expect(request.getAssistantid()).toBe('assistant-1');
    expect(request.getId()).toBe('config-1');
    expect(GetAssistantConfiguration).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      request,
      apiMetadata,
    );
  });

  it('updates assistant configuration with API metadata', () => {
    const options = [{ key: 'enabled' }];

    updateAssistantConfigurationById({
      assistantId: 'assistant-1',
      configurationId: 'config-1',
      configurationType: 'authentication',
      provider: 'http',
      enabled: false,
      options: options as any,
      auth,
    });

    const request = (UpdateAssistantConfiguration as jest.Mock).mock
      .calls[0][1];
    expect(request.getAssistantid()).toBe('assistant-1');
    expect(request.getId()).toBe('config-1');
    expect(request.getConfigurationtype()).toBe('authentication');
    expect(request.getProvider()).toBe('http');
    expect(request.getEnabled()).toBe(false);
    expect(request.getOptionsList()).toBe(options);
    expect(UpdateAssistantConfiguration).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      request,
      apiMetadata,
    );
  });

  it('gets dashboard data with a request-scoped date range', () => {
    const fromDate = { seconds: 1 };
    const toDate = { seconds: 2 };

    getAssistantDashboardRange({
      assistantId: 'assistant-1',
      fromDate: fromDate as any,
      toDate: toDate as any,
      auth,
    });

    const request = (GetAssistantDashboard as jest.Mock).mock.calls[0][1];
    expect(request.getAssistantid()).toBe('assistant-1');
    expect(request.getFromdate()).toBe(fromDate);
    expect(request.getTodate()).toBe(toDate);
    expect(GetAssistantDashboard).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      request,
      apiMetadata,
    );
  });

  it('gets conversation detail with selected fields', () => {
    getAssistantConversationDetail({
      assistantId: 'assistant-1',
      conversationId: 'conversation-1',
      fields: ['recording', 'metrics'],
      auth,
    });

    const request = (GetAssistantConversation as jest.Mock).mock.calls[0][1];
    const selectors = request.getSelectorsList();
    const debuggerMetadata = (ConnectionConfig.WithDebugger as jest.Mock).mock
      .results[0].value;

    expect(request.getAssistantid()).toBe('assistant-1');
    expect(request.getId()).toBe('conversation-1');
    expect(selectors.map((selector: any) => selector.getField())).toEqual([
      'recording',
      'metrics',
    ]);
    expect(GetAssistantConversation).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      request,
      debuggerMetadata,
    );
  });

  it('lists deployment versions using the selected deployment API', () => {
    listAssistantDeploymentVersions({
      assistantId: 'assistant-1',
      deploymentType: 'debugger',
      page: 2,
      pageSize: 25,
      auth,
    });

    const request = (GetAllAssistantDebuggerDeployment as jest.Mock).mock
      .calls[0][1];
    const debuggerMetadata = (ConnectionConfig.WithDebugger as jest.Mock).mock
      .results[0].value;

    expect(GetAllAssistantApiDeployment).not.toHaveBeenCalled();
    expect(request.getAssistantid()).toBe('assistant-1');
    expect(request.getPaginate().getPage()).toBe(2);
    expect(request.getPaginate().getPagesize()).toBe(25);
    expect(GetAllAssistantDebuggerDeployment).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      request,
      debuggerMetadata,
    );
  });

  it('gets deployment by type with assistant id', () => {
    getAssistantDeploymentByType({
      assistantId: 'assistant-1',
      deploymentType: 'api',
      auth,
    });

    const request = (GetAssistantApiDeployment as jest.Mock).mock.calls[0][1];
    const debuggerMetadata = (ConnectionConfig.WithDebugger as jest.Mock).mock
      .results[0].value;

    expect(request.getAssistantid()).toBe('assistant-1');
    expect(GetAssistantApiDeployment).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      request,
      debuggerMetadata,
    );
  });

  it('creates deployment by type with concrete deployment payload', () => {
    const deployment = { assistantId: 'assistant-1' };

    createAssistantDeploymentByType({
      deploymentType: 'api',
      deployment: deployment as any,
      auth,
    });

    const request = (CreateAssistantApiDeployment as jest.Mock).mock
      .calls[0][1];
    const debuggerMetadata = (ConnectionConfig.WithDebugger as jest.Mock).mock
      .results[0].value;

    expect(request.getApi()).toBe(deployment);
    expect(CreateAssistantApiDeployment).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      request,
      debuggerMetadata,
    );
  });

  it('disables deployment by type with assistant id', () => {
    disableAssistantDeploymentByType({
      assistantId: 'assistant-1',
      deploymentType: 'api',
      auth,
    });

    const request = (DisableAssistantApiDeployment as jest.Mock).mock
      .calls[0][1];
    const debuggerMetadata = (ConnectionConfig.WithDebugger as jest.Mock).mock
      .results[0].value;

    expect(request.getAssistantid()).toBe('assistant-1');
    expect(DisableAssistantApiDeployment).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      request,
      debuggerMetadata,
    );
  });
});
