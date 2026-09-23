import * as RapidaReact from '@rapidaai/react';
import {
  ConnectionConfig,
  GeneralConnect,
  ServiceError,
} from '@rapidaai/react';

import { connectionConfig } from '@/configs';
import { ApiAuth, createApiMetadata } from './connection';

export type ConnectResponse = {
  getSuccess(): boolean;
  getRedirectto(): string;
};

type ConnectCallback = (
  error: ServiceError | null,
  response: ConnectResponse | null,
) => void;

export type ConnectProviderParams = {
  providerSlug: string;
  code: string;
  state: string;
  scope: string;
  auth: ApiAuth;
  callback: ConnectCallback;
};

type ConnectRequest = (
  config: typeof connectionConfig,
  providerSlug: string,
  code: string,
  state: string,
  scope: string,
  authHeader: unknown,
  callback: ConnectCallback,
) => void;

const actionConnectRequest = (
  RapidaReact as unknown as { ActionConnect: ConnectRequest }
).ActionConnect;

const knowledgeConnectRequest = (
  RapidaReact as unknown as { KnowledgeConnect: ConnectRequest }
).KnowledgeConnect;

export const connectActionProvider = ({
  providerSlug,
  code,
  state,
  scope,
  auth,
  callback,
}: ConnectProviderParams): void => {
  actionConnectRequest(
    connectionConfig,
    providerSlug,
    code,
    state,
    scope,
    createApiMetadata(auth),
    callback,
  );
};

export const connectKnowledgeProvider = ({
  providerSlug,
  code,
  state,
  scope,
  auth,
  callback,
}: ConnectProviderParams): void => {
  knowledgeConnectRequest(
    connectionConfig,
    providerSlug,
    code,
    state,
    scope,
    createApiMetadata(auth),
    callback,
  );
};

export const connectGeneralProvider = ({
  providerSlug,
  code,
  state,
  scope,
  auth,
  callback,
}: ConnectProviderParams): void => {
  GeneralConnect(
    connectionConfig,
    providerSlug,
    code,
    state,
    scope,
    ConnectionConfig.WithDebugger({
      authorization: auth.token,
      projectId: auth.projectId,
      userId: auth.userId,
    }),
    callback,
  );
};
