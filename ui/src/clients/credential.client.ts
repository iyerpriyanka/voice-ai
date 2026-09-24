import {
  ConnectionConfig,
  CreateProjectCredential,
  CreateProjectCredentialResponse,
  CreateProviderCredentialRequest,
  CreateProviderKey,
  DeleteProviderKey,
  GetAllProjectCredentialResponse,
  GetAllOrganizationCredential,
  GetAllOrganizationCredentialResponse,
  GetAllProjectCredential,
  GetCredentialResponse,
  ServiceError,
} from '@rapidaai/react';
import { Struct } from 'google-protobuf/google/protobuf/struct_pb';

import { ApiAuth, withConnection } from './connection';

type CredentialCriteria = {
  key: string;
  value: string;
  logic: string;
};

type CredentialClientCallback<TResponse> = (
  error: ServiceError | null,
  response: TResponse | null,
) => void;

export type ListOrganizationCredentialsParams = {
  page: number;
  pageSize: number;
  criteria: CredentialCriteria[];
  auth: ApiAuth;
  callback: CredentialClientCallback<GetAllOrganizationCredentialResponse>;
};

export type CreateProviderCredentialParams = {
  provider: string;
  name: string;
  config: Record<string, string>;
  auth: ApiAuth;
};

export type DeleteProviderCredentialParams = {
  credentialId: string;
  auth: ApiAuth;
  callback: CredentialClientCallback<GetCredentialResponse>;
};

export type CreateProjectPublishableCredentialParams = {
  projectId: string;
  name: string;
  auth: Pick<ApiAuth, 'token' | 'userId'>;
  callback: CredentialClientCallback<CreateProjectCredentialResponse>;
};

export type ListProjectCredentialsParams = {
  projectId: string;
  auth: Pick<ApiAuth, 'token' | 'userId'>;
  callback: CredentialClientCallback<GetAllProjectCredentialResponse>;
};

const createCredentialHeaders = ({
  token,
  userId,
}: Pick<ApiAuth, 'token' | 'userId'>) => ({
  authorization: token,
  'x-auth-id': userId,
});

const createCredentialDebuggerMetadata = ({
  projectId,
  token,
  userId,
}: ApiAuth) =>
  ConnectionConfig.WithDebugger({
    authorization: token,
    userId,
    projectId,
  });

export const createProviderKey = withConnection(CreateProviderKey);
export const deleteProviderKey = withConnection(DeleteProviderKey);
export const getAllOrganizationCredential = withConnection(
  GetAllOrganizationCredential,
);
export const getAllProjectCredential = withConnection(GetAllProjectCredential);
export const createProjectCredential = withConnection(CreateProjectCredential);

export const listOrganizationCredentials = ({
  page,
  pageSize,
  criteria,
  auth,
  callback,
}: ListOrganizationCredentialsParams): void => {
  getAllOrganizationCredential(
    page,
    pageSize,
    criteria,
    callback,
    createCredentialDebuggerMetadata(auth),
  );
};

export const createProviderCredential = ({
  provider,
  name,
  config,
  auth,
}: CreateProviderCredentialParams) => {
  const request = new CreateProviderCredentialRequest();
  request.setProvider(provider);
  request.setCredential(Struct.fromJavaScript(config));
  request.setName(name);

  return createProviderKey(request, createCredentialDebuggerMetadata(auth));
};

export const deleteProviderCredential = ({
  credentialId,
  auth,
  callback,
}: DeleteProviderCredentialParams) =>
  deleteProviderKey(
    credentialId,
    callback,
    createCredentialDebuggerMetadata(auth),
  );

export const createProjectPublishableCredential = ({
  projectId,
  name,
  auth,
  callback,
}: CreateProjectPublishableCredentialParams) =>
  createProjectCredential(
    projectId,
    name,
    callback,
    createCredentialHeaders(auth),
  );

export const listProjectCredentials = ({
  projectId,
  auth,
  callback,
}: ListProjectCredentialsParams) =>
  getAllProjectCredential(projectId, callback, createCredentialHeaders(auth));
