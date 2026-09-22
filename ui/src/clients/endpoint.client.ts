import {
  CreateEndpointCacheConfiguration,
  CreateEndpointProviderModel,
  CreateEndpointRetryConfiguration,
  CreateEndpointTag,
  GetAllEndpoint,
  GetAllEndpointLog,
  GetAllEndpointProviderModel,
  GetEndpoint,
  GetEndpointLog,
  ServiceError,
  UpdateEndpointDetail,
  UpdateEndpointVersion,
} from '@rapidaai/react';
import {
  CreateEndpointCacheConfigurationResponse,
  CreateEndpointRetryConfigurationResponse,
  GetAllEndpointResponse,
  GetEndpointResponse,
} from '@rapidaai/react';

import { connectionConfig } from '@/configs';
import { ApiAuth, createApiMetadata, withConnection } from './connection';

type Criteria = {
  key: string;
  value: string;
  logic: string;
};

type EndpointClientCallback<TResponse> = (
  error: ServiceError | null,
  response: TResponse | null,
) => void;

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

export const createEndpointProviderModel = withConnection(
  CreateEndpointProviderModel,
);
export const getAllEndpointProviderModel = withConnection(
  GetAllEndpointProviderModel,
);
export const updateEndpointVersion = withConnection(UpdateEndpointVersion);

export const getAllEndpointLog = withConnection(GetAllEndpointLog);
export const getEndpointLog = withConnection(GetEndpointLog);
