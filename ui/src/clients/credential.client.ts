import {
  CreateProjectCredential,
  CreateProviderKey,
  DeleteProviderKey,
  GetAllOrganizationCredential,
  GetAllProjectCredential,
} from '@rapidaai/react';

import { withConnection } from './connection';

export const createProviderKey = withConnection(CreateProviderKey);
export const deleteProviderKey = withConnection(DeleteProviderKey);
export const getAllOrganizationCredential = withConnection(
  GetAllOrganizationCredential,
);
export const getAllProjectCredential = withConnection(GetAllProjectCredential);
export const createProjectCredential = withConnection(CreateProjectCredential);
