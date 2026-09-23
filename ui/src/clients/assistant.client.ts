import {
  AssistantConfiguration,
  AssistantDefinition,
  ConnectionConfig,
  CreateAssistant,
  CreateAssistantApiDeployment,
  CreateAssistantConfiguration,
  CreateAssistantDebuggerDeployment,
  CreateAssistantKnowledge,
  CreateAssistantPhoneDeployment,
  CreateAssistantProvider,
  CreateAssistantTag,
  CreateAssistantTool,
  CreateAssistantWebpluginDeployment,
  CreateAssistantWhatsappDeployment,
  DeleteAssistant,
  DeleteAssistantConfiguration,
  DeleteAssistantKnowledge,
  DeleteAssistantTool,
  DisableAssistantApiDeployment,
  DisableAssistantDebuggerDeployment,
  DisableAssistantPhoneDeployment,
  DisableAssistantWebpluginDeployment,
  DisableAssistantWhatsappDeployment,
  GetAllAssistant,
  GetAllAssistantApiDeployment,
  GetAllAssistantConfiguration,
  GetAllAssistantConfigurationRequest,
  GetAllAssistantConversation,
  GetAllAssistantConversationMessage,
  GetAllAssistantDebuggerDeployment,
  GetAllAssistantKnowledge,
  GetAllAssistantPhoneDeployment,
  GetAllAssistantProvider,
  GetAllAssistantTool,
  GetAllAssistantWebpluginDeployment,
  GetAllAssistantWhatsappDeployment,
  GetAssistant,
  GetAssistantApiDeployment,
  GetAssistantConfiguration,
  GetAssistantConversation,
  GetAssistantDashboard,
  GetAssistantDebuggerDeployment,
  GetAssistantKnowledge,
  GetAssistantMessages,
  GetAssistantPhoneDeployment,
  GetAssistantTool,
  GetAssistantWebpluginDeployment,
  GetAssistantWhatsappDeployment,
  GetAllAssistantRequest,
  GetAssistantRequest,
  Paginate,
  Criteria,
  DeleteAssistantConfigurationRequest,
  UpdateAssistantConfigurationRequest,
  UpdateAssistantVersionRequest,
  ServiceError,
  UpdateAssistantConfiguration,
  UpdateAssistantDetail,
  UpdateAssistantKnowledge,
  UpdateAssistantTool,
  UpdateAssistantVersion,
} from '@rapidaai/react';
import type {
  Assistant,
  GetAllAssistantConversationResponse,
  GetAllAssistantProviderResponse,
  GetAllConversationMessageResponse,
  GetAllAssistantKnowledgeResponse,
  GetAllAssistantToolResponse,
  GetAssistantKnowledgeResponse,
  GetAssistantResponse,
  GetAssistantToolResponse,
} from '@rapidaai/react';

import { connectionConfig } from '@/configs';
import { ApiAuth, createApiMetadata, withConnection } from './connection';

type ClientCriteria = {
  key: string;
  value: string;
  logic: string;
};

type AssistantClientCallback<TResponse> = (
  error: ServiceError | null,
  response: TResponse | null,
) => void;

export type ListAssistantsParams = {
  page: number;
  pageSize: number;
  criteria: ClientCriteria[];
  auth: ApiAuth;
};

export type GetAssistantByIdParams = {
  assistantId: string;
  assistantProviderModelId?: string | null;
  auth: ApiAuth;
};

export type UpdateAssistantDescriptionParams = {
  assistantId: string;
  name: string;
  description: string;
  auth: ApiAuth;
  callback: AssistantClientCallback<GetAssistantResponse>;
};

export type CreateAssistantTagParams = {
  assistantId: string;
  tags: string[];
  auth: ApiAuth;
  callback: AssistantClientCallback<GetAssistantResponse>;
};

export type ListAssistantProvidersParams = {
  assistantId: string;
  page: number;
  pageSize: number;
  criteria: ClientCriteria[];
  auth: ApiAuth;
  callback: AssistantClientCallback<GetAllAssistantProviderResponse>;
};

export type ReleaseAssistantVersionParams = {
  assistant: Assistant;
  assistantProvider: string;
  assistantProviderId: string;
  auth: ApiAuth;
};

export type ListAssistantConversationsParams = {
  assistantId: string;
  page: number;
  pageSize: number;
  criteria: ClientCriteria[];
  auth: ApiAuth;
  callback: AssistantClientCallback<GetAllAssistantConversationResponse>;
};

export type ListAssistantConversationMessagesParams = {
  assistantId: string;
  conversationId: string;
  page: number;
  pageSize: number;
  criteria: ClientCriteria[];
  auth: ApiAuth;
  callback: AssistantClientCallback<GetAllConversationMessageResponse>;
};

export type ListAssistantConfigurationsParams = {
  assistantId: string;
  configurationType: string;
  page: number;
  pageSize: number;
  criteria: ClientCriteria[];
  auth: ApiAuth;
};

export type DeleteAssistantConfigurationParams = {
  assistantId: string;
  configurationId: string;
  auth: ApiAuth;
};

export type UpdateAssistantConfigurationEnabledParams = {
  assistantId: string;
  configurationType: string;
  configuration: AssistantConfiguration;
  enabled: boolean;
  auth: ApiAuth;
};

export type ListAssistantKnowledgeParams = {
  assistantId: string;
  page: number;
  pageSize: number;
  criteria: ClientCriteria[];
  auth: ApiAuth;
  callback: AssistantClientCallback<GetAllAssistantKnowledgeResponse>;
};

export type DeleteAssistantKnowledgeParams = {
  assistantId: string;
  knowledgeId: string;
  auth: ApiAuth;
  callback: AssistantClientCallback<GetAssistantKnowledgeResponse>;
};

export type ListAssistantToolsParams = {
  assistantId: string;
  page: number;
  pageSize: number;
  criteria: ClientCriteria[];
  auth: ApiAuth;
  callback: AssistantClientCallback<GetAllAssistantToolResponse>;
};

export type DeleteAssistantToolParams = {
  assistantId: string;
  toolId: string;
  auth: ApiAuth;
  callback: AssistantClientCallback<GetAssistantToolResponse>;
};

const createPaginate = (page: number, pageSize: number): Paginate => {
  const paginate = new Paginate();
  paginate.setPage(page);
  paginate.setPagesize(pageSize);
  return paginate;
};

const createCriteria = ({ key, value, logic }: ClientCriteria): Criteria => {
  const criteria = new Criteria();
  criteria.setKey(key);
  criteria.setLogic(logic);
  criteria.setValue(value);
  return criteria;
};

const createDebuggerMetadata = ({ token, projectId, userId }: ApiAuth) =>
  ConnectionConfig.WithDebugger({
    authorization: token,
    projectId,
    userId,
  });

export const listAssistants = ({
  page,
  pageSize,
  criteria,
  auth,
}: ListAssistantsParams) => {
  const request = new GetAllAssistantRequest();
  request.setPaginate(createPaginate(page, pageSize));
  criteria.forEach(criterion =>
    request.addCriterias(createCriteria(criterion)),
  );

  return GetAllAssistant(
    connectionConfig,
    request,
    createDebuggerMetadata(auth),
  );
};

export const getAssistantById = ({
  assistantId,
  assistantProviderModelId,
  auth,
}: GetAssistantByIdParams) => {
  const request = new GetAssistantRequest();
  const assistantDefinition = new AssistantDefinition();
  assistantDefinition.setAssistantid(assistantId);
  if (assistantProviderModelId) {
    assistantDefinition.setVersion(assistantProviderModelId);
  }
  request.setAssistantdefinition(assistantDefinition);

  return GetAssistant(connectionConfig, request, createDebuggerMetadata(auth));
};

export const updateAssistantDescription = ({
  assistantId,
  name,
  description,
  auth,
  callback,
}: UpdateAssistantDescriptionParams) =>
  UpdateAssistantDetail(
    connectionConfig,
    assistantId,
    name,
    description,
    callback,
    createApiMetadata(auth),
  );

export const createAssistantTags = ({
  assistantId,
  tags,
  auth,
  callback,
}: CreateAssistantTagParams) =>
  CreateAssistantTag(
    connectionConfig,
    assistantId,
    tags,
    callback,
    createApiMetadata(auth),
  );

export const listAssistantProviders = ({
  assistantId,
  page,
  pageSize,
  criteria,
  auth,
  callback,
}: ListAssistantProvidersParams) =>
  GetAllAssistantProvider(
    connectionConfig,
    assistantId,
    page,
    pageSize,
    criteria,
    callback,
    createDebuggerMetadata(auth),
  );

export const releaseAssistantVersion = ({
  assistant,
  assistantProvider,
  assistantProviderId,
  auth,
}: ReleaseAssistantVersionParams) => {
  const request = new UpdateAssistantVersionRequest();
  request.setAssistantid(assistant.getId());
  request.setAssistantprovider(assistantProvider);
  request.setAssistantproviderid(assistantProviderId);

  return UpdateAssistantVersion(
    connectionConfig,
    request,
    createDebuggerMetadata(auth),
  );
};

export const listAssistantConversations = ({
  assistantId,
  page,
  pageSize,
  criteria,
  auth,
  callback,
}: ListAssistantConversationsParams) =>
  GetAllAssistantConversation(
    connectionConfig,
    assistantId,
    page,
    pageSize,
    criteria,
    callback,
    createApiMetadata(auth),
  );

export const listAssistantConversationMessages = ({
  assistantId,
  conversationId,
  page,
  pageSize,
  criteria,
  auth,
  callback,
}: ListAssistantConversationMessagesParams) =>
  GetAllAssistantConversationMessage(
    connectionConfig,
    assistantId,
    conversationId,
    page,
    pageSize,
    criteria,
    createDebuggerMetadata(auth),
    callback,
  );

export const listAssistantConfigurations = ({
  assistantId,
  configurationType,
  page,
  pageSize,
  criteria,
  auth,
}: ListAssistantConfigurationsParams) => {
  const request = new GetAllAssistantConfigurationRequest();
  request.setAssistantid(assistantId);
  request.setConfigurationtype(configurationType);
  request.setPaginate(createPaginate(page, pageSize));
  criteria.forEach(criterion =>
    request.addCriterias(createCriteria(criterion)),
  );

  return GetAllAssistantConfiguration(
    connectionConfig,
    request,
    createApiMetadata(auth),
  );
};

export const deleteAssistantConfigurationById = ({
  assistantId,
  configurationId,
  auth,
}: DeleteAssistantConfigurationParams) => {
  const request = new DeleteAssistantConfigurationRequest();
  request.setAssistantid(assistantId);
  request.setId(configurationId);

  return DeleteAssistantConfiguration(
    connectionConfig,
    request,
    createApiMetadata(auth),
  );
};

export const updateAssistantConfigurationEnabled = ({
  assistantId,
  configurationType,
  configuration,
  enabled,
  auth,
}: UpdateAssistantConfigurationEnabledParams) => {
  const request = new UpdateAssistantConfigurationRequest();
  request.setId(configuration.getId());
  request.setAssistantid(assistantId);
  request.setConfigurationtype(configurationType);
  request.setProvider(configuration.getProvider());
  request.setEnabled(enabled);
  request.setOptionsList(configuration.getOptionsList());

  return UpdateAssistantConfiguration(
    connectionConfig,
    request,
    createApiMetadata(auth),
  );
};

export const listAssistantKnowledgeLinks = ({
  assistantId,
  page,
  pageSize,
  criteria,
  auth,
  callback,
}: ListAssistantKnowledgeParams) =>
  GetAllAssistantKnowledge(
    connectionConfig,
    assistantId,
    page,
    pageSize,
    criteria,
    callback,
    createApiMetadata(auth),
  );

export const deleteAssistantKnowledgeLink = ({
  assistantId,
  knowledgeId,
  auth,
  callback,
}: DeleteAssistantKnowledgeParams) =>
  DeleteAssistantKnowledge(
    connectionConfig,
    assistantId,
    knowledgeId,
    callback,
    createApiMetadata(auth),
  );

export const listAssistantTools = ({
  assistantId,
  page,
  pageSize,
  criteria,
  auth,
  callback,
}: ListAssistantToolsParams) =>
  GetAllAssistantTool(
    connectionConfig,
    assistantId,
    page,
    pageSize,
    criteria,
    callback,
    createApiMetadata(auth),
  );

export const deleteAssistantToolById = ({
  assistantId,
  toolId,
  auth,
  callback,
}: DeleteAssistantToolParams) =>
  DeleteAssistantTool(
    connectionConfig,
    assistantId,
    toolId,
    callback,
    createApiMetadata(auth),
  );

export const createAssistant = withConnection(CreateAssistant);
export const getAllAssistant = withConnection(GetAllAssistant);
export const getAssistant = withConnection(GetAssistant);
export const updateAssistantDetail = withConnection(UpdateAssistantDetail);
export const deleteAssistant = withConnection(DeleteAssistant);
export const createAssistantTag = withConnection(CreateAssistantTag);
export const updateAssistantVersion = withConnection(UpdateAssistantVersion);

export const createAssistantProvider = withConnection(CreateAssistantProvider);
export const getAllAssistantProvider = withConnection(GetAllAssistantProvider);

export const createAssistantConfiguration = withConnection(
  CreateAssistantConfiguration,
);
export const getAssistantConfiguration = withConnection(
  GetAssistantConfiguration,
);
export const getAllAssistantConfiguration = withConnection(
  GetAllAssistantConfiguration,
);
export const updateAssistantConfiguration = withConnection(
  UpdateAssistantConfiguration,
);
export const deleteAssistantConfiguration = withConnection(
  DeleteAssistantConfiguration,
);

export const createAssistantKnowledge = withConnection(
  CreateAssistantKnowledge,
);
export const getAssistantKnowledge = withConnection(GetAssistantKnowledge);
export const getAllAssistantKnowledge = withConnection(
  GetAllAssistantKnowledge,
);
export const updateAssistantKnowledge = withConnection(
  UpdateAssistantKnowledge,
);
export const deleteAssistantKnowledge = withConnection(
  DeleteAssistantKnowledge,
);

export const createAssistantTool = withConnection(CreateAssistantTool);
export const getAssistantTool = withConnection(GetAssistantTool);
export const getAllAssistantTool = withConnection(GetAllAssistantTool);
export const updateAssistantTool = withConnection(UpdateAssistantTool);
export const deleteAssistantTool = withConnection(DeleteAssistantTool);

export const getAssistantDashboard = withConnection(GetAssistantDashboard);
export const getAssistantMessages = withConnection(GetAssistantMessages);
export const getAssistantConversation = withConnection(
  GetAssistantConversation,
);
export const getAllAssistantConversation = withConnection(
  GetAllAssistantConversation,
);
export const getAllAssistantConversationMessage = withConnection(
  GetAllAssistantConversationMessage,
);

export const createAssistantApiDeployment = withConnection(
  CreateAssistantApiDeployment,
);
export const getAssistantApiDeployment = withConnection(
  GetAssistantApiDeployment,
);
export const getAllAssistantApiDeployment = withConnection(
  GetAllAssistantApiDeployment,
);
export const disableAssistantApiDeployment = withConnection(
  DisableAssistantApiDeployment,
);

export const createAssistantDebuggerDeployment = withConnection(
  CreateAssistantDebuggerDeployment,
);
export const getAssistantDebuggerDeployment = withConnection(
  GetAssistantDebuggerDeployment,
);
export const getAllAssistantDebuggerDeployment = withConnection(
  GetAllAssistantDebuggerDeployment,
);
export const disableAssistantDebuggerDeployment = withConnection(
  DisableAssistantDebuggerDeployment,
);

export const createAssistantPhoneDeployment = withConnection(
  CreateAssistantPhoneDeployment,
);
export const getAssistantPhoneDeployment = withConnection(
  GetAssistantPhoneDeployment,
);
export const getAllAssistantPhoneDeployment = withConnection(
  GetAllAssistantPhoneDeployment,
);
export const disableAssistantPhoneDeployment = withConnection(
  DisableAssistantPhoneDeployment,
);

export const createAssistantWebpluginDeployment = withConnection(
  CreateAssistantWebpluginDeployment,
);
export const getAssistantWebpluginDeployment = withConnection(
  GetAssistantWebpluginDeployment,
);
export const getAllAssistantWebpluginDeployment = withConnection(
  GetAllAssistantWebpluginDeployment,
);
export const disableAssistantWebpluginDeployment = withConnection(
  DisableAssistantWebpluginDeployment,
);

export const createAssistantWhatsappDeployment = withConnection(
  CreateAssistantWhatsappDeployment,
);
export const getAssistantWhatsappDeployment = withConnection(
  GetAssistantWhatsappDeployment,
);
export const getAllAssistantWhatsappDeployment = withConnection(
  GetAllAssistantWhatsappDeployment,
);
export const disableAssistantWhatsappDeployment = withConnection(
  DisableAssistantWhatsappDeployment,
);
