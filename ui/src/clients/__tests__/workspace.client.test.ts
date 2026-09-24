import {
  AddUserToProjects,
  CreateOrganization,
  CreateProject,
  DeleteProject,
  DeleteUserFromOrganization,
  GetAllProject,
  GetOrganization,
  InviteUserToOrganization,
  UpdateOrganization,
  UpdateProject,
  UpdateUserOrganizationRole,
} from '@rapidaai/react';

import {
  addUserToProjectsByRole,
  createWorkspaceOrganization,
  createWorkspaceProject,
  deleteOrganizationUser,
  deleteWorkspaceProject,
  getWorkspaceOrganization,
  inviteOrganizationUser,
  listWorkspaceProjects,
  updateOrganizationUserRole,
  updateWorkspaceOrganization,
  updateWorkspaceProject,
} from '@/clients';

jest.mock('@/configs', () => ({
  connectionConfig: { endpoint: 'test-endpoint' },
}));

jest.mock('@rapidaai/react', () => {
  class ProjectRoleAssignment {
    private projectId = '';
    private projectRole = '';

    setProjectid(projectId: string) {
      this.projectId = projectId;
    }

    setProjectrole(projectRole: string) {
      this.projectRole = projectRole;
    }

    getProjectid() {
      return this.projectId;
    }

    getProjectrole() {
      return this.projectRole;
    }
  }

  class InviteUserToOrganizationRequest {
    private email = '';
    private organizationRole = '';
    private projectRoles: ProjectRoleAssignment[] = [];

    setEmail(email: string) {
      this.email = email;
    }

    setOrganizationrole(organizationRole: string) {
      this.organizationRole = organizationRole;
    }

    setProjectrolesList(projectRoles: ProjectRoleAssignment[]) {
      this.projectRoles = projectRoles;
    }

    getEmail() {
      return this.email;
    }

    getOrganizationrole() {
      return this.organizationRole;
    }

    getProjectrolesList() {
      return this.projectRoles;
    }
  }

  class AddUserToProjectsRequest {
    private userId = '';
    private projectRoles: ProjectRoleAssignment[] = [];

    setUserid(userId: string) {
      this.userId = userId;
    }

    setProjectrolesList(projectRoles: ProjectRoleAssignment[]) {
      this.projectRoles = projectRoles;
    }

    getUserid() {
      return this.userId;
    }

    getProjectrolesList() {
      return this.projectRoles;
    }
  }

  class UpdateUserOrganizationRoleRequest {
    private userId = '';
    private organizationRole = '';

    setUserid(userId: string) {
      this.userId = userId;
    }

    setOrganizationrole(organizationRole: string) {
      this.organizationRole = organizationRole;
    }

    getUserid() {
      return this.userId;
    }

    getOrganizationrole() {
      return this.organizationRole;
    }
  }

  return {
    AddUserToProjects: jest.fn(),
    AddUserToProjectsRequest,
    CreateOrganization: jest.fn(),
    CreateProject: jest.fn(),
    DeleteProject: jest.fn(),
    DeleteUserFromOrganization: jest.fn(),
    DeleteUserFromOrganizationRequest: class {
      private userId = '';

      setUserid(userId: string) {
        this.userId = userId;
      }

      getUserid() {
        return this.userId;
      }
    },
    DeleteUserFromProject: jest.fn(),
    GetAllProject: jest.fn(),
    GetOrganization: jest.fn(),
    GetProject: jest.fn(),
    InviteUserToOrganization: jest.fn(),
    InviteUserToOrganizationRequest,
    ProjectRoleAssignment,
    UpdateOrganization: jest.fn(),
    UpdateProject: jest.fn(),
    UpdateUserOrganizationRole: jest.fn(),
    UpdateUserOrganizationRoleRequest,
  };
});

const auth = {
  token: 'token-1',
  userId: 'auth-1',
};

const metadata = {
  authorization: 'token-1',
  'x-auth-id': 'auth-1',
};

describe('workspace client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('gets and updates organization details with workspace metadata', () => {
    const getCallback = jest.fn();
    const updateCallback = jest.fn();

    getWorkspaceOrganization({ auth, callback: getCallback });
    updateWorkspaceOrganization({
      organizationId: 'org-1',
      name: 'Rapida',
      industry: 'Support',
      contact: 'ops@example.com',
      auth,
      callback: updateCallback,
    });

    expect(GetOrganization).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      metadata,
      getCallback,
    );
    expect(UpdateOrganization).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'org-1',
      metadata,
      updateCallback,
      'Rapida',
      'Support',
      'ops@example.com',
    );
  });

  it('creates, lists, updates, and deletes projects with workspace metadata', () => {
    const callback = jest.fn();
    const criteria = [{ key: 'name', value: 'support' }];

    createWorkspaceProject({
      name: 'Support',
      description: 'Customer support',
      auth,
      callback,
    });
    listWorkspaceProjects({
      page: 2,
      pageSize: 25,
      criteria,
      auth,
      callback,
    });
    updateWorkspaceProject({
      projectId: 'project-1',
      name: 'Sales',
      description: 'Revenue',
      auth,
      callback,
    });
    deleteWorkspaceProject({ projectId: 'project-1', auth, callback });

    expect(CreateProject).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'Support',
      'Customer support',
      metadata,
      callback,
    );
    expect(GetAllProject).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      2,
      25,
      criteria,
      callback,
      metadata,
    );
    expect(UpdateProject).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'project-1',
      callback,
      metadata,
      'Sales',
      'Revenue',
    );
    expect(DeleteProject).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'project-1',
      callback,
      metadata,
    );
  });

  it('creates organization users and project role assignment requests', () => {
    createWorkspaceOrganization({
      name: 'Rapida',
      size: '50',
      industry: 'Support',
      auth,
      callback: jest.fn(),
    });
    inviteOrganizationUser({
      email: 'p_iyer@outlook.com',
      organizationRole: 'admin',
      projectRoles: [{ projectId: 'project-1', projectRole: 'editor' }],
      auth,
    });
    addUserToProjectsByRole({
      userId: 'user-1',
      projectRoles: [{ projectId: 'project-2', projectRole: 'reader' }],
      auth,
    });

    expect(CreateOrganization).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      'Rapida',
      '50',
      'Support',
      metadata,
      expect.any(Function),
    );

    const inviteRequest = (InviteUserToOrganization as jest.Mock).mock
      .calls[0][1];
    expect(inviteRequest.getEmail()).toBe('p_iyer@outlook.com');
    expect(inviteRequest.getOrganizationrole()).toBe('admin');
    expect(inviteRequest.getProjectrolesList()[0].getProjectid()).toBe(
      'project-1',
    );
    expect(inviteRequest.getProjectrolesList()[0].getProjectrole()).toBe(
      'editor',
    );

    const projectRequest = (AddUserToProjects as jest.Mock).mock.calls[0][1];
    expect(projectRequest.getUserid()).toBe('user-1');
    expect(projectRequest.getProjectrolesList()[0].getProjectid()).toBe(
      'project-2',
    );
    expect(projectRequest.getProjectrolesList()[0].getProjectrole()).toBe(
      'reader',
    );
  });

  it('creates organization user delete and role update requests', () => {
    deleteOrganizationUser({ userId: 'user-1', auth });
    updateOrganizationUserRole({
      userId: 'user-2',
      organizationRole: 'member',
      auth,
    });

    const deleteRequest = (DeleteUserFromOrganization as jest.Mock).mock
      .calls[0][1];
    expect(deleteRequest.getUserid()).toBe('user-1');
    expect(DeleteUserFromOrganization).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      deleteRequest,
      metadata,
    );

    const updateRequest = (UpdateUserOrganizationRole as jest.Mock).mock
      .calls[0][1];
    expect(updateRequest.getUserid()).toBe('user-2');
    expect(updateRequest.getOrganizationrole()).toBe('member');
    expect(UpdateUserOrganizationRole).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      updateRequest,
      metadata,
    );
  });
});
