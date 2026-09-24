import {
  ConnectionConfig,
  Criteria,
  CreateConversationMetric,
  CreateMessageMetric,
  GetActivities,
  GetActivity,
  GetAllAssistantToolLog,
  GetAllAssistantToolLogRequest,
  GetAllHTTPLog,
  GetAllAssistantHTTPLogRequest,
  GetAllTelemetry,
  GetAssistantHTTPLogRequest,
  GetAssistantToolLog,
  GetAssistantToolLogRequest,
  GetAuditLogResponse,
  GetHTTPLog,
  GetMessages,
  Paginate,
  RetryAssistantHTTPLogRequest,
  RetryHTTPLog,
  ServiceError,
} from '@rapidaai/react';
import type {
  GetAllAuditLogResponse,
  GetAllMessageResponse,
} from '@rapidaai/react';

import { connectionConfig } from '@/configs';
import { ApiAuth, createApiMetadata, withConnection } from './connection';

type ClientCriteria = {
  key: string;
  value: string;
  logic: string;
};

type ConversationMessageField =
  | 'metadata'
  | 'metric'
  | 'stage'
  | 'request'
  | 'response';

type ActivityClientCallback<TResponse> = (
  error: ServiceError | null,
  response: TResponse | null,
) => void;

export type ListActivitiesParams = {
  projectId: string;
  page: number;
  pageSize: number;
  criteria: ClientCriteria[];
  auth: ApiAuth;
  callback: ActivityClientCallback<GetAllAuditLogResponse>;
};

export type ListWebhookLogsParams = {
  projectId: string;
  page: number;
  pageSize: number;
  criteria: ClientCriteria[];
  auth: ApiAuth;
};

export type ListToolActivityLogsParams = {
  projectId: string;
  page: number;
  pageSize: number;
  criteria: ClientCriteria[];
  auth: ApiAuth;
};

export type ListConversationMessagesParams = {
  page: number;
  pageSize: number;
  criteria: ClientCriteria[];
  fields: ConversationMessageField[];
  auth: ApiAuth;
  callback: ActivityClientCallback<GetAllMessageResponse>;
};

export type GetActivityLogParams = {
  projectId: string;
  activityId: string;
  auth: ApiAuth;
  callback: ActivityClientCallback<GetAuditLogResponse>;
};

export type GetToolActivityLogParams = {
  projectId: string;
  activityId: string;
  auth: ApiAuth;
};

export type GetWebhookActivityLogParams = {
  projectId: string;
  requestLogId: string;
  auth: ApiAuth;
};

export type RetryWebhookActivityLogParams = {
  projectId: string;
  requestLogId: string;
  auth: ApiAuth;
};

const createDebuggerMetadata = ({ projectId, token, userId }: ApiAuth) =>
  ConnectionConfig.WithDebugger({
    authorization: token,
    projectId,
    userId,
  });

const createPaginate = (page: number, pageSize: number): Paginate => {
  const paginate = new Paginate();
  paginate.setPage(page);
  paginate.setPagesize(pageSize);
  return paginate;
};

const createCriteria = ({ key, value, logic }: ClientCriteria): Criteria => {
  const criteria = new Criteria();
  criteria.setKey(key);
  criteria.setValue(value);
  criteria.setLogic(logic);
  return criteria;
};

export const listActivities = ({
  projectId,
  page,
  pageSize,
  criteria,
  auth,
  callback,
}: ListActivitiesParams): void => {
  GetActivities(
    connectionConfig,
    projectId,
    page,
    pageSize,
    criteria,
    callback,
    createDebuggerMetadata(auth),
  );
};

export const listWebhookLogs = ({
  projectId,
  page,
  pageSize,
  criteria,
  auth,
}: ListWebhookLogsParams) => {
  const request = new GetAllAssistantHTTPLogRequest();
  request.setProjectid(projectId);
  request.setPaginate(createPaginate(page, pageSize));
  criteria.forEach(item => request.addCriterias(createCriteria(item)));

  return GetAllHTTPLog(connectionConfig, request, createApiMetadata(auth));
};

export const listToolActivityLogs = ({
  projectId,
  page,
  pageSize,
  criteria,
  auth,
}: ListToolActivityLogsParams) => {
  const request = new GetAllAssistantToolLogRequest();
  request.setProjectid(projectId);
  request.setPaginate(createPaginate(page, pageSize));
  criteria.forEach(item => request.addCriterias(createCriteria(item)));

  return GetAllAssistantToolLog(
    connectionConfig,
    request,
    createDebuggerMetadata(auth),
  );
};

export const listConversationMessages = ({
  page,
  pageSize,
  criteria,
  fields,
  auth,
  callback,
}: ListConversationMessagesParams): void => {
  GetMessages(
    connectionConfig,
    page,
    pageSize,
    criteria,
    fields,
    callback,
    createApiMetadata(auth),
  );
};

export const getActivityLog = ({
  projectId,
  activityId,
  auth,
  callback,
}: GetActivityLogParams): void => {
  GetActivity(
    connectionConfig,
    projectId,
    activityId,
    callback,
    createDebuggerMetadata(auth),
  );
};

export const getToolActivityLog = ({
  projectId,
  activityId,
  auth,
}: GetToolActivityLogParams) => {
  const request = new GetAssistantToolLogRequest();
  request.setProjectid(projectId);
  request.setId(activityId);

  return GetAssistantToolLog(
    connectionConfig,
    request,
    createDebuggerMetadata(auth),
  );
};

export const getWebhookActivityLog = ({
  projectId,
  requestLogId,
  auth,
}: GetWebhookActivityLogParams) => {
  const request = new GetAssistantHTTPLogRequest();
  request.setProjectid(projectId);
  request.setId(requestLogId);

  return GetHTTPLog(connectionConfig, request, createApiMetadata(auth));
};

export const retryWebhookActivityLog = ({
  projectId,
  requestLogId,
  auth,
}: RetryWebhookActivityLogParams) => {
  const request = new RetryAssistantHTTPLogRequest();
  request.setProjectid(projectId);
  request.setId(requestLogId);

  return RetryHTTPLog(connectionConfig, request, createApiMetadata(auth));
};

export const getActivities = withConnection(GetActivities);
export const getActivity = withConnection(GetActivity);

export const getAllHTTPLog = withConnection(GetAllHTTPLog);
export const getHTTPLog = withConnection(GetHTTPLog);
export const retryHTTPLog = withConnection(RetryHTTPLog);

export const getAllAssistantToolLog = withConnection(GetAllAssistantToolLog);
export const getAssistantToolLog = withConnection(GetAssistantToolLog);

export const getMessages = withConnection(GetMessages);
export const getAllTelemetry = withConnection(GetAllTelemetry);
export const createMessageMetric = withConnection(CreateMessageMetric);
export const createConversationMetric = withConnection(
  CreateConversationMetric,
);
