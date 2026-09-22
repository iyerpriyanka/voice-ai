import {
  AddUserToProjects,
  CreateOrganization,
  CreateProject,
  DeleteProject,
  DeleteUserFromOrganization,
  DeleteUserFromProject,
  GetAllProject,
  GetOrganization,
  GetProject,
  InviteUserToOrganization,
  UpdateOrganization,
  UpdateProject,
  UpdateUserOrganizationRole,
} from '@rapidaai/react';

import { withConnection } from './connection';

export const createOrganization = withConnection(CreateOrganization);
export const getOrganization = withConnection(GetOrganization);
export const updateOrganization = withConnection(UpdateOrganization);

export const createProject = withConnection(CreateProject);
export const getAllProject = withConnection(GetAllProject);
export const getProject = withConnection(GetProject);
export const updateProject = withConnection(UpdateProject);
export const deleteProject = withConnection(DeleteProject);

export const inviteUserToOrganization = withConnection(
  InviteUserToOrganization,
);
export const addUserToProjects = withConnection(AddUserToProjects);
export const updateUserOrganizationRole = withConnection(
  UpdateUserOrganizationRole,
);
export const deleteUserFromOrganization = withConnection(
  DeleteUserFromOrganization,
);
export const deleteUserFromProject = withConnection(DeleteUserFromProject);
