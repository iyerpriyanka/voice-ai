import {
  ConnectionConfig,
  Criteria,
  GetActivities,
  GetActivity,
  GetAllAssistantToolLog,
  GetAllAssistantToolLogRequest,
  GetAllHTTPLog,
  GetAllAssistantHTTPLogRequest,
  GetAllTelemetry,
  GetAllTelemetryRequest,
  GetAssistantHTTPLogRequest,
  GetAssistantToolLog,
  GetAssistantToolLogRequest,
  GetAuditLogResponse,
  GetHTTPLog,
  GetMessages,
  Ordering,
  Paginate,
  RetryAssistantHTTPLogRequest,
  RetryHTTPLog,
  ServiceError,
} from '@rapidaai/react';
import type {
  GetAllAuditLogResponse,
  GetAllMessageResponse,
  GetAllTelemetryResponse,
} from '@rapidaai/react';

import { connectionConfig } from '@/configs';
import { ApiAuth, createApiMetadata } from './connection';

type ClientCriteria = {
  key: string;
  value: string;
  logic: string;
};

export type TelemetryCriteriaInput = {
  key: string;
  value: string;
  logic?: string;
};

export type TelemetryOrderInput = {
  column: string;
  order: string;
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

export type ListTelemetryParams = {
  page: number;
  pageSize: number;
  criteria: TelemetryCriteriaInput[];
  order?: TelemetryOrderInput;
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

const createCriteria = ({
  key,
  value,
  logic = 'match',
}: TelemetryCriteriaInput): Criteria => {
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

export const listTelemetry = ({
  page,
  pageSize,
  criteria,
  order,
  auth,
}: ListTelemetryParams): Promise<GetAllTelemetryResponse> => {
  const request = new GetAllTelemetryRequest();
  request.setPaginate(createPaginate(page, pageSize));
  request.setCriteriasList(criteria.map(createCriteria));

  if (order) {
    const ordering = new Ordering();
    ordering.setColumn(order.column);
    ordering.setOrder(order.order);
    request.setOrder(ordering);
  }

  return GetAllTelemetry(
    connectionConfig,
    request,
    createDebuggerMetadata(auth),
  );
};
