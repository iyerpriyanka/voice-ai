import {
  AssistantDefinition,
  ConnectionConfig,
  CreatePhoneCall,
  CreatePhoneCallRequest,
  Invoke,
  StringToAny,
} from '@rapidaai/react';
import type { CreatePhoneCallResponse } from '@rapidaai/react';

import { withConnection } from './connection';
import type { ApiAuth } from './connection';
import { CONFIG } from '@/configs';

export const invoke = withConnection(Invoke);

export type VoiceAgentSDKConnectionParams = {
  apiKey: string;
  userId: string;
};

export type PreviewPhoneCallParams = {
  assistantId: string;
  toNumber: string;
  args: Map<string, string>;
  auth: ApiAuth;
};

export const createVoiceAgentSDKConnection = ({
  apiKey,
  userId,
}: VoiceAgentSDKConnectionParams) =>
  ConnectionConfig.DefaultConnectionConfig(
    ConnectionConfig.WithSDK({
      ApiKey: apiKey,
      UserId: userId,
    }),
  ).withCustomEndpoint(CONFIG.connection);

export const createVoiceAgentDebuggerConnection = (auth: ApiAuth) =>
  ConnectionConfig.DefaultConnectionConfig(
    ConnectionConfig.WithDebugger({
      authorization: auth.token,
      userId: auth.userId,
      projectId: auth.projectId,
    }),
  ).withCustomEndpoint(CONFIG.connection);

const createPersonalTokenConnection = (auth: ApiAuth) =>
  ConnectionConfig.DefaultConnectionConfig(
    ConnectionConfig.WithPersonalToken({
      Authorization: auth.token,
      AuthId: auth.userId,
      ProjectId: auth.projectId,
    }),
  ).withCustomEndpoint(CONFIG.connection);

export const createPreviewPhoneCall = ({
  assistantId,
  toNumber,
  args,
  auth,
}: PreviewPhoneCallParams): Promise<CreatePhoneCallResponse> => {
  const request = new CreatePhoneCallRequest();
  const assistant = new AssistantDefinition();
  assistant.setAssistantid(assistantId);
  assistant.setVersion('latest');
  request.setAssistant(assistant);
  request.setTonumber(toNumber);
  args.forEach((value, key) => {
    request.getArgsMap().set(key, StringToAny(value));
  });

  return CreatePhoneCall(createPersonalTokenConnection(auth), request);
};
