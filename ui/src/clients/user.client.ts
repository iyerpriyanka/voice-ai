import {
  GetAllUser,
  GetNotificationSetting,
  GetUser,
  UpdateNotificationSetting,
  UpdateUser,
} from '@rapidaai/react';

import { withConnection } from './connection';

export const getAllUser = withConnection(GetAllUser);
export const getUser = withConnection(GetUser);
export const updateUser = withConnection(UpdateUser);
export const getNotificationSetting = withConnection(GetNotificationSetting);
export const updateNotificationSetting = withConnection(
  UpdateNotificationSetting,
);
