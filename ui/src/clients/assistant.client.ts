import {
  AssistantConfiguration,
  AssistantDefinition,
  AssistantApiDeployment,
  AssistantDebuggerDeployment,
  AssistantPhoneDeployment,
  AssistantWebpluginDeployment,
  ConnectionConfig,
  CreateAssistant,
  CreateAssistantApiDeployment,
  CreateAssistantDeploymentRequest,
  CreateAssistantConfiguration,
  CreateAssistantConfigurationRequest,
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
  FieldSelector,
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
  GetAllAssistantDeploymentRequest,
  GetAssistantDeploymentRequest,
  GetAssistant,
  GetAssistantApiDeployment,
  GetAssistantConfiguration,
  GetAssistantConfigurationRequest,
  GetAssistantConversation,
  GetAssistantConversationRequest,
  GetAssistantDashboard,
  GetAssistantDashboardRequest,
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
  CreateAssistantProviderRequest,
  CreateAssistantRequest,
  GetAllAssistantApiDeploymentResponse,
  GetAllAssistantConversationResponse,
  GetAllAssistantDebuggerDeploymentResponse,
  GetAllAssistantPhoneDeploymentResponse,
  GetAllAssistantProviderResponse,
  GetAllAssistantWebpluginDeploymentResponse,
  GetAllConversationMessageResponse,
  GetAllAssistantKnowledgeResponse,
  GetAllAssistantToolResponse,
  GetAssistantKnowledgeResponse,
  GetAssistantResponse,
  GetAssistantToolResponse,
  Metadata,
} from '@rapidaai/react';
import type { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';

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

export type CreateAssistantFromRequestParams = {
  request: CreateAssistantRequest;
  auth: ApiAuth;
};

export type CreateAssistantProviderFromRequestParams = {
  request: CreateAssistantProviderRequest;
  auth: ApiAuth;
};

export type UpdateAssistantVersionFromRequestParams = {
  request: UpdateAssistantVersionRequest;
  auth: ApiAuth;
};

export type UpdateAssistantDescriptionParams = {
  assistantId: string;
  name: string;
  description: string;
  auth: ApiAuth;
  callback: AssistantClientCallback<GetAssistantResponse>;
};

export type DeleteAssistantByIdParams = {
  assistantId: string;
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

export type GetAssistantConversationDetailParams = {
  assistantId: string;
  conversationId: string;
  fields: string[];
  auth: ApiAuth;
};

export type GetAssistantDashboardRangeParams = {
  assistantId: string;
  fromDate: Timestamp;
  toDate: Timestamp;
  auth: ApiAuth;
};

export type AssistantDeploymentType = 'debugger' | 'api' | 'web' | 'phone';

type AssistantDeploymentPayloadByType = {
  api: AssistantApiDeployment;
  debugger: AssistantDebuggerDeployment;
  phone: AssistantPhoneDeployment;
  web: AssistantWebpluginDeployment;
};

export type ListAssistantDeploymentVersionsParams = {
  assistantId: string;
  deploymentType: AssistantDeploymentType;
  page: number;
  pageSize: number;
  auth: ApiAuth;
};

export type GetAssistantDeploymentByTypeParams = {
  assistantId: string;
  deploymentType: AssistantDeploymentType;
  auth: ApiAuth;
};

export type CreateAssistantDeploymentByTypeParams<
  TDeploymentType extends AssistantDeploymentType = AssistantDeploymentType,
> = {
  deploymentType: TDeploymentType;
  deployment: AssistantDeploymentPayloadByType[TDeploymentType];
  auth: ApiAuth;
};

export type DisableAssistantDeploymentByTypeParams =
  GetAssistantDeploymentByTypeParams;

export type ListAssistantConfigurationsParams = {
  assistantId: string;
  configurationType: string;
  page: number;
  pageSize: number;
  criteria: ClientCriteria[];
  auth: ApiAuth;
};

export type AssistantConfigurationPayload = {
  assistantId: string;
  configurationType: string;
  provider: string;
  enabled: boolean;
  options: Metadata[];
  auth: ApiAuth;
};

export type GetAssistantConfigurationByIdParams = {
  assistantId: string;
  configurationId: string;
  auth: ApiAuth;
};

export type UpdateAssistantConfigurationByIdParams =
  AssistantConfigurationPayload & {
    configurationId: string;
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

export type AssistantKnowledgeRetrievalOptions = {
  searchMethod: 'semantic' | 'fullText' | 'hybrid' | 'invertedIndex';
  topK: number;
  scoreThreshold: number;
  rerankingEnable: boolean;
};

export type GetAssistantKnowledgeByIdParams = {
  assistantId: string;
  assistantKnowledgeId: string;
  auth: ApiAuth;
  callback: AssistantClientCallback<GetAssistantKnowledgeResponse>;
};

export type CreateAssistantKnowledgeLinkParams = {
  assistantId: string;
  knowledgeId: string;
  retrievalOptions: AssistantKnowledgeRetrievalOptions;
  auth: ApiAuth;
  callback: AssistantClientCallback<GetAssistantKnowledgeResponse>;
};

export type UpdateAssistantKnowledgeLinkParams =
  CreateAssistantKnowledgeLinkParams & {
    assistantKnowledgeId: string;
  };

export type ListAssistantToolsParams = {
  assistantId: string;
  page: number;
  pageSize: number;
  criteria: ClientCriteria[];
  auth: ApiAuth;
  callback: AssistantClientCallback<GetAllAssistantToolResponse>;
};

export type GetAssistantToolByIdParams = {
  assistantId: string;
  toolId: string;
  auth: ApiAuth;
  callback: AssistantClientCallback<GetAssistantToolResponse>;
};

export type CreateAssistantToolParams = {
  assistantId: string;
  name: string;
  description: string;
  fields: Record<string, unknown>;
  executionMethod: string;
  executionOptions: Metadata[];
  auth: ApiAuth;
  callback: AssistantClientCallback<GetAssistantToolResponse>;
};

export type UpdateAssistantToolByIdParams = CreateAssistantToolParams & {
  toolId: string;
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

export const getAssistantByIdWithApi = ({
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

  return GetAssistant(connectionConfig, request, createApiMetadata(auth));
};

export const createAssistantFromRequest = ({
  request,
  auth,
}: CreateAssistantFromRequestParams) =>
  CreateAssistant(connectionConfig, request, createApiMetadata(auth));

export const createAssistantWithDebuggerFromRequest = ({
  request,
  auth,
}: CreateAssistantFromRequestParams) =>
  CreateAssistant(connectionConfig, request, createDebuggerMetadata(auth));

export const createAssistantProviderFromRequest = ({
  request,
  auth,
}: CreateAssistantProviderFromRequestParams) =>
  CreateAssistantProvider(connectionConfig, request, createApiMetadata(auth));

export const createAssistantProviderWithDebuggerFromRequest = ({
  request,
  auth,
}: CreateAssistantProviderFromRequestParams) =>
  CreateAssistantProvider(
    connectionConfig,
    request,
    createDebuggerMetadata(auth),
  );

export const updateAssistantVersionFromRequest = ({
  request,
  auth,
}: UpdateAssistantVersionFromRequestParams) =>
  UpdateAssistantVersion(
    connectionConfig,
    request,
    createDebuggerMetadata(auth),
  );

export const getAssistantDashboardRange = ({
  assistantId,
  fromDate,
  toDate,
  auth,
}: GetAssistantDashboardRangeParams) => {
  const request = new GetAssistantDashboardRequest();
  request.setAssistantid(assistantId);
  request.setFromdate(fromDate);
  request.setTodate(toDate);

  return GetAssistantDashboard(
    connectionConfig,
    request,
    createApiMetadata(auth),
  );
};

export const getAssistantConversationDetail = ({
  assistantId,
  conversationId,
  fields,
  auth,
}: GetAssistantConversationDetailParams) => {
  const request = new GetAssistantConversationRequest();
  request.setAssistantid(assistantId);
  request.setId(conversationId);
  fields.forEach(field => {
    const selector = new FieldSelector();
    selector.setField(field);
    request.addSelectors(selector);
  });

  return GetAssistantConversation(
    connectionConfig,
    request,
    createDebuggerMetadata(auth),
  );
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

export const deleteAssistantById = ({
  assistantId,
  auth,
  callback,
}: DeleteAssistantByIdParams) =>
  DeleteAssistant(
    connectionConfig,
    assistantId,
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

export const listAssistantDeploymentVersions = ({
  assistantId,
  deploymentType,
  page,
  pageSize,
  auth,
}: ListAssistantDeploymentVersionsParams) => {
  const request = new GetAllAssistantDeploymentRequest();
  request.setAssistantid(assistantId);
  request.setPaginate(createPaginate(page, pageSize));

  const fetchByType = {
    api: GetAllAssistantApiDeployment,
    debugger: GetAllAssistantDebuggerDeployment,
    phone: GetAllAssistantPhoneDeployment,
    web: GetAllAssistantWebpluginDeployment,
  } satisfies Record<
    AssistantDeploymentType,
    typeof GetAllAssistantApiDeployment
  >;

  return fetchByType[deploymentType](
    connectionConfig,
    request,
    createDebuggerMetadata(auth),
  ) as Promise<
    | GetAllAssistantApiDeploymentResponse
    | GetAllAssistantDebuggerDeploymentResponse
    | GetAllAssistantPhoneDeploymentResponse
    | GetAllAssistantWebpluginDeploymentResponse
  >;
};

export const getAssistantDeploymentByType = ({
  assistantId,
  deploymentType,
  auth,
}: GetAssistantDeploymentByTypeParams) => {
  const request = new GetAssistantDeploymentRequest();
  request.setAssistantid(assistantId);

  const fetchByType = {
    api: GetAssistantApiDeployment,
    debugger: GetAssistantDebuggerDeployment,
    phone: GetAssistantPhoneDeployment,
    web: GetAssistantWebpluginDeployment,
  } satisfies Record<AssistantDeploymentType, typeof GetAssistantApiDeployment>;

  return fetchByType[deploymentType](
    connectionConfig,
    request,
    createDebuggerMetadata(auth),
  ) as Promise<any>;
};

export const createAssistantDeploymentByType = ({
  deployment,
  deploymentType,
  auth,
}: CreateAssistantDeploymentByTypeParams) => {
  const request = new CreateAssistantDeploymentRequest();
  if (deploymentType === 'api') {
    request.setApi(deployment as AssistantApiDeployment);
  } else if (deploymentType === 'debugger') {
    request.setDebugger(deployment as AssistantDebuggerDeployment);
  } else if (deploymentType === 'phone') {
    request.setPhone(deployment as AssistantPhoneDeployment);
  } else {
    request.setPlugin(deployment as AssistantWebpluginDeployment);
  }

  const createByType = {
    api: CreateAssistantApiDeployment,
    debugger: CreateAssistantDebuggerDeployment,
    phone: CreateAssistantPhoneDeployment,
    web: CreateAssistantWebpluginDeployment,
  } satisfies Record<
    AssistantDeploymentType,
    typeof CreateAssistantApiDeployment
  >;

  return createByType[deploymentType](
    connectionConfig,
    request,
    createDebuggerMetadata(auth),
  ) as Promise<any>;
};

export const disableAssistantDeploymentByType = ({
  assistantId,
  deploymentType,
  auth,
}: DisableAssistantDeploymentByTypeParams) => {
  const request = new GetAssistantDeploymentRequest();
  request.setAssistantid(assistantId);

  const disableByType = {
    api: DisableAssistantApiDeployment,
    debugger: DisableAssistantDebuggerDeployment,
    phone: DisableAssistantPhoneDeployment,
    web: DisableAssistantWebpluginDeployment,
  } satisfies Record<
    AssistantDeploymentType,
    typeof DisableAssistantApiDeployment
  >;

  return disableByType[deploymentType](
    connectionConfig,
    request,
    createDebuggerMetadata(auth),
  ) as Promise<any>;
};

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

export const createAssistantConfigurationForAssistant = ({
  assistantId,
  configurationType,
  provider,
  enabled,
  options,
  auth,
}: AssistantConfigurationPayload) => {
  const request = new CreateAssistantConfigurationRequest();
  request.setAssistantid(assistantId);
  request.setConfigurationtype(configurationType);
  request.setProvider(provider);
  request.setEnabled(enabled);
  request.setOptionsList(options);

  return CreateAssistantConfiguration(
    connectionConfig,
    request,
    createApiMetadata(auth),
  );
};

export const getAssistantConfigurationById = ({
  assistantId,
  configurationId,
  auth,
}: GetAssistantConfigurationByIdParams) => {
  const request = new GetAssistantConfigurationRequest();
  request.setAssistantid(assistantId);
  request.setId(configurationId);

  return GetAssistantConfiguration(
    connectionConfig,
    request,
    createApiMetadata(auth),
  );
};

export const updateAssistantConfigurationById = ({
  assistantId,
  configurationId,
  configurationType,
  provider,
  enabled,
  options,
  auth,
}: UpdateAssistantConfigurationByIdParams) => {
  const request = new UpdateAssistantConfigurationRequest();
  request.setId(configurationId);
  request.setAssistantid(assistantId);
  request.setConfigurationtype(configurationType);
  request.setProvider(provider);
  request.setEnabled(enabled);
  request.setOptionsList(options);

  return UpdateAssistantConfiguration(
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
}: UpdateAssistantConfigurationEnabledParams) =>
  updateAssistantConfigurationById({
    assistantId,
    configurationId: configuration.getId(),
    configurationType,
    provider: configuration.getProvider(),
    enabled,
    options: configuration.getOptionsList(),
    auth,
  });

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

export const getAssistantKnowledgeLinkById = ({
  assistantId,
  assistantKnowledgeId,
  auth,
  callback,
}: GetAssistantKnowledgeByIdParams) =>
  GetAssistantKnowledge(
    connectionConfig,
    assistantId,
    assistantKnowledgeId,
    callback,
    createApiMetadata(auth),
  );

export const createAssistantKnowledgeLink = ({
  assistantId,
  knowledgeId,
  retrievalOptions,
  auth,
  callback,
}: CreateAssistantKnowledgeLinkParams) =>
  CreateAssistantKnowledge(
    connectionConfig,
    assistantId,
    knowledgeId,
    retrievalOptions,
    callback,
    createApiMetadata(auth),
  );

export const updateAssistantKnowledgeLink = ({
  assistantKnowledgeId,
  assistantId,
  knowledgeId,
  retrievalOptions,
  auth,
  callback,
}: UpdateAssistantKnowledgeLinkParams) =>
  UpdateAssistantKnowledge(
    connectionConfig,
    assistantKnowledgeId,
    assistantId,
    knowledgeId,
    retrievalOptions,
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

export const getAssistantToolById = ({
  assistantId,
  toolId,
  auth,
  callback,
}: GetAssistantToolByIdParams) =>
  GetAssistantTool(
    connectionConfig,
    assistantId,
    toolId,
    callback,
    createApiMetadata(auth),
  );

export const createAssistantToolForAssistant = ({
  assistantId,
  name,
  description,
  fields,
  executionMethod,
  executionOptions,
  auth,
  callback,
}: CreateAssistantToolParams) =>
  CreateAssistantTool(
    connectionConfig,
    assistantId,
    name,
    description,
    fields,
    executionMethod,
    executionOptions,
    callback,
    createApiMetadata(auth),
  );

export const updateAssistantToolById = ({
  assistantId,
  toolId,
  name,
  description,
  fields,
  executionMethod,
  executionOptions,
  auth,
  callback,
}: UpdateAssistantToolByIdParams) =>
  UpdateAssistantTool(
    connectionConfig,
    assistantId,
    toolId,
    name,
    description,
    fields,
    executionMethod,
    executionOptions,
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
