import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  AddUserToProjects,
  AddUserToProjectsRequest,
  ProjectRoleAssignment,
} from '@rapidaai/react';
import type { User } from '@rapidaai/react';
import { ComboBox } from '@carbon/react';
import toast from 'react-hot-toast/headless';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  type ModalProps,
  PrimaryButton,
  SecondaryButton,
  Stack,
  TextInput,
} from '@/app/components/ui/primitives';
import { ErrorMessage } from '@/app/components/ui/feedback';
import { AuthContext } from '@/context/auth-context';
import { useCurrentCredential } from '@/hooks/use-credential';
import { useRapidaStore } from '@/stores/app';
import { useUserPageStore } from '@/stores/user';
import { connectionConfig } from '@/configs';
import {
  ProjectRoleRow,
  ProjectRoleTable,
} from '@/app/components/domain/project-role-table';

const PROJECT_ACTION_ERROR =
  'Unable to process your request. please try again later.';

const projectRoles = [
  { name: 'Super Admin', value: 'super admin' },
  { name: 'Admin', value: 'admin' },
  { name: 'Writer', value: 'writer' },
  { name: 'Reader', value: 'reader' },
];

interface InviteProjectUserDialogProps extends ModalProps {
  user?: User | null;
  projectId?: string;
  onSuccess?: () => void;
}

export function InviteProjectUserDialog({
  modalOpen,
  setModalOpen,
  user,
  projectId,
  onSuccess,
}: InviteProjectUserDialogProps) {
  const { authId, token, projectId: currentProjectId } = useCurrentCredential();
  const { projectRoles: availableProjects } = useContext(AuthContext);
  const { loading, showLoader, hideLoader } = useRapidaStore();
  const { users, getAllUser } = useUserPageStore();
  const [selectedUser, setSelectedUser] = useState<User | null>(user || null);
  const [projectRoleRows, setProjectRoleRows] = useState<ProjectRoleRow[]>(
    projectId ? [{ projectId, projectRole: '' }] : [],
  );
  const [error, setError] = useState('');

  const closeDialog = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  useEffect(() => {
    if (modalOpen) {
      setSelectedUser(user || null);
      setProjectRoleRows(projectId ? [{ projectId, projectRole: '' }] : []);
      setError('');

      if (!user && users.length === 0) {
        getAllUser(
          token,
          authId,
          currentProjectId,
          err => setError(err),
          () => {},
        );
      }
    }
  }, [
    authId,
    currentProjectId,
    modalOpen,
    projectId,
    token,
    user,
    users.length,
    getAllUser,
  ]);

  const submitInvite = async () => {
    if (!selectedUser) {
      setError('Please select a user.');
      return;
    }
    if (projectRoleRows.length === 0) {
      setError('Please add at least one project role.');
      return;
    }
    if (projectRoleRows.some(row => !row.projectId || !row.projectRole)) {
      setError('Please select project and role.');
      return;
    }
    const projectIds = projectRoleRows.map(row => row.projectId);
    if (new Set(projectIds).size !== projectIds.length) {
      setError('A project can only be assigned once.');
      return;
    }

    setError('');
    showLoader('overlay');

    const req = new AddUserToProjectsRequest();
    req.setUserid(selectedUser.getId());
    req.setProjectrolesList(
      projectRoleRows.map(row => {
        const assignment = new ProjectRoleAssignment();
        assignment.setProjectid(row.projectId);
        assignment.setProjectrole(row.projectRole);
        return assignment;
      }),
    );

    try {
      const response = await AddUserToProjects(connectionConfig, req, {
        authorization: token,
        'x-auth-id': authId,
      });
      hideLoader();

      const responseError = response.getError();
      const message = responseError?.getHumanmessage() || PROJECT_ACTION_ERROR;

      if (response.getSuccess()) {
        setSelectedUser(null);
        setProjectRoleRows(
          projectId
            ? [
                {
                  projectId,
                  projectRole: '',
                },
              ]
            : [],
        );
        closeDialog();
        toast.success('The user was added to the project successfully.');
        onSuccess?.();
        return;
      }

      toast.error(message);
      setError(message);
    } catch (err: unknown) {
      hideLoader();
      const message = err instanceof Error ? err.message : PROJECT_ACTION_ERROR;
      toast.error(message);
      setError(message);
    }
  };

  const projectOptions = useMemo(
    () =>
      projectId
        ? [
            {
              name:
                (availableProjects || []).find(
                  project => project.projectid === projectId,
                )?.projectname || projectId,
              value: projectId,
            },
          ]
        : (availableProjects || []).map(project => ({
            name: project.projectname,
            value: project.projectid,
          })),
    [availableProjects, projectId],
  );

  return (
    <Modal
      open={modalOpen}
      onClose={closeDialog}
      size="md"
      preventCloseOnClickOutside
    >
      <ModalHeader
        label="Project Access"
        title="Invite user to project"
        onClose={closeDialog}
      />
      <ModalBody hasForm hasScrollingContent>
        <Stack gap={6}>
          {user ? (
            <TextInput
              id="project-invite-selected-user"
              labelText="User"
              value={`${user.getName()} (${user.getEmail()})`}
              readOnly
            />
          ) : (
            <ComboBox
              id="project-invite-user"
              titleText="User"
              placeholder="Select user"
              items={users}
              selectedItem={selectedUser}
              itemToString={(item: User | null) =>
                item ? `${item.getName()} (${item.getEmail()})` : ''
              }
              onChange={({ selectedItem }) => {
                setError('');
                setSelectedUser(selectedItem || null);
              }}
            />
          )}
          <ProjectRoleTable
            rows={projectRoleRows}
            onChange={next => {
              setError('');
              setProjectRoleRows(next);
            }}
            projectOptions={projectOptions}
            roleOptions={projectRoles}
            defaultProjectId={projectId || projectOptions[0]?.value || ''}
            title="Project roles"
            addButtonLabel="Add project role"
            showAddButton={!projectId}
            showRemoveColumn={!projectId}
          />
          <ErrorMessage message={error} />
        </Stack>
      </ModalBody>
      <ModalFooter>
        <SecondaryButton size="lg" onClick={closeDialog}>
          Cancel
        </SecondaryButton>
        <PrimaryButton size="lg" onClick={submitInvite} isLoading={loading}>
          Invite user
        </PrimaryButton>
      </ModalFooter>
    </Modal>
  );
}
