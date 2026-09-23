import {
  ConnectionConfig,
  GetAllUser,
  GetAllUserResponse,
  GetNotificationSetting,
  GetUser,
  ServiceError,
  UpdateNotificationSetting,
  UpdateUser,
} from '@rapidaai/react';

import { ApiAuth, withConnection } from './connection';

type Criteria = {
  key: string;
  value: string;
  logic: string;
};

type UserClientCallback<TResponse> = (
  error: ServiceError | null,
  response: TResponse | null,
) => void;

export type ListUsersParams = {
  page: number;
  pageSize: number;
  criteria: Criteria[];
  auth: ApiAuth;
  callback: UserClientCallback<GetAllUserResponse>;
};

export const getAllUser = withConnection(GetAllUser);
export const getUser = withConnection(GetUser);
export const updateUser = withConnection(UpdateUser);
export const getNotificationSetting = withConnection(GetNotificationSetting);
export const updateNotificationSetting = withConnection(
  UpdateNotificationSetting,
);

export const listUsers = ({
  page,
  pageSize,
  criteria,
  auth,
  callback,
}: ListUsersParams): void => {
  getAllUser(
    page,
    pageSize,
    criteria,
    callback,
    ConnectionConfig.WithDebugger({
      authorization: auth.token,
      userId: auth.userId,
      projectId: auth.projectId,
    }),
  );
};
