import {
  CreateConversationMetric,
  CreateMessageMetric,
  GetActivities,
  GetActivity,
  GetAllAssistantToolLog,
  GetAllHTTPLog,
  GetAllTelemetry,
  GetAssistantToolLog,
  GetHTTPLog,
  GetMessages,
  RetryHTTPLog,
} from '@rapidaai/react';

import { withConnection } from './connection';

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
