import {
  ConnectionConfig,
  CreateEndpoint,
  CreateEndpointCacheConfiguration,
  CreateEndpointProviderModel,
  CreateEndpointRetryConfiguration,
  CreateEndpointTag,
  EndpointAttribute,
  EndpointCacheConfiguration,
  EndpointDefinition,
  EndpointProviderModelAttribute,
  EndpointRetryConfiguration,
  GetAllEndpoint,
  GetAllEndpointLog,
  GetAllEndpointProviderModel,
  GetEndpoint,
  GetEndpointLog,
  Invoke,
  InvokeRequest,
  ServiceError,
  StringToAny,
  UpdateEndpointDetail,
  UpdateEndpointVersion,
} from '@rapidaai/react';
import {
  CreateEndpointProviderModelResponse,
  CreateEndpointResponse,
  CreateEndpointCacheConfigurationResponse,
  GetAllEndpointLogResponse,
  GetAllEndpointProviderModelResponse,
  CreateEndpointRetryConfigurationResponse,
  GetAllEndpointResponse,
  GetEndpointLogResponse,
  GetEndpointResponse,
  InvokeResponse,
  UpdateEndpointVersionResponse,
} from '@rapidaai/react';

import { connectionConfig } from '@/configs';
import { ApiAuth, createApiMetadata } from './connection';

type Criteria = {
  key: string;
  value: string;
  logic: string;
};

type EndpointClientCallback<TResponse> = (
  error: ServiceError | null,
  response: TResponse | null,
) => void;

type EndpointInvokeArgumentMap = Map<string, ReturnType<typeof StringToAny>>;

export type ListEndpointsParams = {
  page: number;
  pageSize: number;
  criteria: Criteria[];
  auth: ApiAuth;
  callback: EndpointClientCallback<GetAllEndpointResponse>;
};

export type GetEndpointParams = {
  endpointId: string;
  endpointProviderModelId: string | null;
  auth: ApiAuth;
  callback: EndpointClientCallback<GetEndpointResponse>;
};

export type CreateEndpointParams = {
  endpointProviderModel: EndpointProviderModelAttribute;
  endpoint: EndpointAttribute;
  tags: string[];
  auth: ApiAuth;
  callback: EndpointClientCallback<CreateEndpointResponse>;
  retryConfig?: EndpointRetryConfiguration;
  cacheConfig?: EndpointCacheConfiguration;
};

export type CreateEndpointProviderModelParams = {
  endpointId: string;
  endpointProviderModel: EndpointProviderModelAttribute;
  auth: ApiAuth;
  callback: EndpointClientCallback<CreateEndpointProviderModelResponse>;
};

export type CreateEndpointTagParams = {
  endpointId: string;
  tags: string[];
  auth: ApiAuth;
  callback: EndpointClientCallback<GetEndpointResponse>;
};

export type CreateEndpointRetryConfigurationParams = {
  endpointId: string;
  retryType: string;
  maxAttempts: string;
  delaySeconds: string;
  exponentialBackoff: boolean;
  retryables: string[];
  auth: ApiAuth;
  callback: EndpointClientCallback<CreateEndpointRetryConfigurationResponse>;
};

export type CreateEndpointCacheConfigurationParams = {
  endpointId: string;
  cacheType: string;
  expiryInterval: string;
  matchThreshold: number;
  auth: ApiAuth;
  callback: EndpointClientCallback<CreateEndpointCacheConfigurationResponse>;
};

export type UpdateEndpointDetailParams = {
  endpointId: string;
  name: string;
  description: string;
  auth: ApiAuth;
  callback: EndpointClientCallback<GetEndpointResponse>;
};

export type ListEndpointProviderModelsParams = {
  endpointId: string;
  page: number;
  pageSize: number;
  criteria: Array<{ key: string; value: string }>;
  auth: ApiAuth;
  callback: EndpointClientCallback<GetAllEndpointProviderModelResponse>;
};

export type ReleaseEndpointVersionParams = {
  endpointId: string;
  endpointProviderModelId: string;
  auth: ApiAuth;
  callback: EndpointClientCallback<UpdateEndpointVersionResponse>;
};

export type ListEndpointLogsParams = {
  endpointId: string;
  page: number;
  pageSize: number;
  criteria: Criteria[];
  auth: ApiAuth;
  callback: EndpointClientCallback<GetAllEndpointLogResponse>;
};

export type GetEndpointLogParams = {
  endpointId: string;
  logId: string;
  auth: ApiAuth;
  callback: EndpointClientCallback<GetEndpointLogResponse>;
};

export type InvokeEndpointParams = {
  endpointId: string;
  endpointProviderModelId: string;
  args: EndpointInvokeArgumentMap;
  auth: ApiAuth;
};

const createDebuggerMetadata = ({ projectId, token, userId }: ApiAuth) =>
  ConnectionConfig.WithDebugger({
    authorization: token,
    projectId,
    userId,
  });

export const listEndpoints = ({
  page,
  pageSize,
  criteria,
  auth,
  callback,
}: ListEndpointsParams): void => {
  GetAllEndpoint(
    connectionConfig,
    page,
    pageSize,
    criteria,
    callback,
    createApiMetadata(auth),
  );
};

export const getEndpoint = ({
  endpointId,
  endpointProviderModelId,
  auth,
  callback,
}: GetEndpointParams): void => {
  GetEndpoint(
    connectionConfig,
    endpointId,
    endpointProviderModelId,
    createApiMetadata(auth),
    callback,
  );
};

export const createEndpoint = ({
  endpointProviderModel,
  endpoint,
  tags,
  auth,
  callback,
  retryConfig,
  cacheConfig,
}: CreateEndpointParams): void => {
  CreateEndpoint(
    connectionConfig,
    endpointProviderModel,
    endpoint,
    tags,
    createDebuggerMetadata(auth),
    callback,
    retryConfig,
    cacheConfig,
  );
};

export const createEndpointProviderModel = ({
  endpointId,
  endpointProviderModel,
  auth,
  callback,
}: CreateEndpointProviderModelParams): void => {
  CreateEndpointProviderModel(
    connectionConfig,
    endpointId,
    endpointProviderModel,
    createDebuggerMetadata(auth),
    callback,
  );
};

export const createEndpointTag = ({
  endpointId,
  tags,
  auth,
  callback,
}: CreateEndpointTagParams): void => {
  CreateEndpointTag(
    connectionConfig,
    endpointId,
    tags,
    createApiMetadata(auth),
    callback,
  );
};

export const createEndpointRetryConfiguration = ({
  endpointId,
  retryType,
  maxAttempts,
  delaySeconds,
  exponentialBackoff,
  retryables,
  auth,
  callback,
}: CreateEndpointRetryConfigurationParams): void => {
  CreateEndpointRetryConfiguration(
    connectionConfig,
    endpointId,
    retryType,
    maxAttempts,
    delaySeconds,
    exponentialBackoff,
    retryables,
    createApiMetadata(auth),
    callback,
  );
};

export const createEndpointCacheConfiguration = ({
  endpointId,
  cacheType,
  expiryInterval,
  matchThreshold,
  auth,
  callback,
}: CreateEndpointCacheConfigurationParams): void => {
  CreateEndpointCacheConfiguration(
    connectionConfig,
    endpointId,
    cacheType,
    expiryInterval,
    matchThreshold,
    createApiMetadata(auth),
    callback,
  );
};

export const updateEndpointDetail = ({
  endpointId,
  name,
  description,
  auth,
  callback,
}: UpdateEndpointDetailParams): void => {
  UpdateEndpointDetail(
    connectionConfig,
    endpointId,
    name,
    description,
    createApiMetadata(auth),
    callback,
  );
};

export const listEndpointProviderModels = ({
  endpointId,
  page,
  pageSize,
  criteria,
  auth,
  callback,
}: ListEndpointProviderModelsParams): void => {
  GetAllEndpointProviderModel(
    connectionConfig,
    endpointId,
    page,
    pageSize,
    criteria,
    callback,
    createApiMetadata(auth),
  );
};

export const invokeEndpoint = ({
  endpointId,
  endpointProviderModelId,
  args,
  auth,
}: InvokeEndpointParams): Promise<InvokeResponse> => {
  const request = new InvokeRequest();
  const endpoint = new EndpointDefinition();

  endpoint.setEndpointid(endpointId);
  endpoint.setVersion(endpointProviderModelId);
  request.setEndpoint(endpoint);
  request.getMetadataMap().set('source', StringToAny('web-app'));
  request.getMetadataMap().set('experiemental', StringToAny('true'));
  args.forEach((value, key) => {
    request.getArgsMap().set(key, value);
  });

  return Invoke(connectionConfig, request, createDebuggerMetadata(auth));
};

export const releaseEndpointVersion = ({
  endpointId,
  endpointProviderModelId,
  auth,
  callback,
}: ReleaseEndpointVersionParams): void => {
  UpdateEndpointVersion(
    connectionConfig,
    endpointId,
    endpointProviderModelId,
    createApiMetadata(auth),
    callback,
  );
};

export const listEndpointLogs = ({
  endpointId,
  page,
  pageSize,
  criteria,
  auth,
  callback,
}: ListEndpointLogsParams): void => {
  GetAllEndpointLog(
    connectionConfig,
    endpointId,
    page,
    pageSize,
    criteria,
    callback,
    createApiMetadata(auth),
  );
};

export const getEndpointLogById = ({
  endpointId,
  logId,
  auth,
  callback,
}: GetEndpointLogParams): void => {
  GetEndpointLog(
    connectionConfig,
    endpointId,
    logId,
    callback,
    createApiMetadata(auth),
  );
};
