import { useCallback, useEffect, useState } from 'react';
import {
  ConnectionConfig,
  DeleteProviderKey,
  GetCredentialResponse,
  VaultCredential,
} from '@rapidaai/react';
import { useCurrentCredential } from '@/hooks/use-credential';
import { useRapidaStore } from '@/hooks';
import toast from 'react-hot-toast/headless';
import type { ModalProps } from '@/app/components/ui/primitives';
import { useAllProviderCredentials } from '@/hooks/use-model';
import { useProviderContext } from '@/context/provider-context';
import { toHumanReadableRelativeTime } from '@/utils/date';
import type { ServiceError } from '@rapidaai/react';
import { connectionConfig } from '@/configs';
import type { RapidaProvider } from '@/providers';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/app/components/ui/primitives';
import { PrimaryButton, DangerButton } from '@/app/components/ui/primitives';
import { Stack } from '@/app/components/ui/primitives';
import { Key, TrashCan } from '@carbon/icons-react';
import { CopyButton } from '@/app/components/ui/primitives';
import { EmptyState } from '@/app/components/ui/feedback';

interface ViewProviderCredentialDialogProps extends ModalProps {
  currentProvider: RapidaProvider;
  onSetupCredential: () => void;
}

export function ViewProviderCredentialDialog({
  currentProvider,
  modalOpen,
  onSetupCredential,
  setModalOpen,
}: ViewProviderCredentialDialogProps) {
  const { authId, projectId, token } = useCurrentCredential();
  const { showLoader, hideLoader } = useRapidaStore();
  const { providerCredentials } = useAllProviderCredentials();
  const providerCtx = useProviderContext();
  const [currentProviderCredentials, setCurrentProviderCredentials] = useState<
    Array<VaultCredential>
  >([]);

  useEffect(() => {
    setCurrentProviderCredentials(
      providerCredentials.filter(y => y.getProvider() === currentProvider.code),
    );
  }, [currentProvider.code, providerCredentials]);

  const afterCredentialDelete = useCallback(
    (err: ServiceError | null, gapcr: GetCredentialResponse | null) => {
      hideLoader();
      if (gapcr?.getSuccess()) {
        providerCtx.reloadProviderCredentials();
      } else {
        const errorMessage = gapcr?.getError();
        if (errorMessage) {
          toast.error(errorMessage.getHumanmessage());
        } else {
          toast.error(
            'Unable to process your request. please try again later.',
          );
        }
        return;
      }
    },
    [hideLoader, providerCtx],
  );

  const onDelete = (credId: string) => {
    showLoader();
    DeleteProviderKey(
      connectionConfig,
      credId,
      afterCredentialDelete,
      ConnectionConfig.WithDebugger({
        authorization: token,
        userId: authId,
        projectId: projectId,
      }),
    );
  };

  return (
    <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="sm">
      <ModalHeader
        label="Credentials"
        title="View provider credential"
        onClose={() => setModalOpen(false)}
      />
      <ModalBody>
        <ProviderCredentialList
          credentials={currentProviderCredentials}
          currentProvider={currentProvider}
          onDelete={onDelete}
          onSetupCredential={onSetupCredential}
        />
      </ModalBody>
      <ModalFooter>
        <PrimaryButton size="lg" onClick={() => setModalOpen(false)}>
          Got it
        </PrimaryButton>
      </ModalFooter>
    </Modal>
  );
}

interface ProviderCredentialListProps {
  credentials: VaultCredential[];
  currentProvider: RapidaProvider;
  onDelete: (credentialId: string) => void;
  onSetupCredential: () => void;
}

export function ProviderCredentialList({
  credentials,
  currentProvider,
  onDelete,
  onSetupCredential,
}: ProviderCredentialListProps) {
  if (credentials.length === 0) {
    return (
      <EmptyState
        icon={Key}
        title="No Credential"
        subtitle="No provider credential to display"
        action="Setup Credential"
        onAction={onSetupCredential}
      />
    );
  }

  return (
    <Stack gap={4}>
      {credentials.map(credential => (
        <div
          className="group border border-border-subtle bg-layer"
          key={credential.getId()}
        >
          <div className="flex items-center px-4 py-3">
            <div className="border border-border-subtle bg-surface flex items-center justify-center shrink-0 h-10 w-10 p-1 mr-3">
              {currentProvider.image ? (
                <img src={currentProvider.image} alt={currentProvider.name} />
              ) : (
                <Key size={20} className="text-muted" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold capitalize truncate">
                {credential.getName()}
              </p>
              <div className="flex gap-2 text-xs text-muted">
                <span>
                  Updated{' '}
                  {credential.getCreateddate()
                    ? toHumanReadableRelativeTime(credential.getCreateddate()!)
                    : 'Unknown'}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Last activity{' '}
                  {credential.getLastuseddate()
                    ? toHumanReadableRelativeTime(credential.getLastuseddate()!)
                    : 'No activity'}
                </span>
              </div>
            </div>
            <DangerButton
              size="sm"
              renderIcon={TrashCan}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDelete(credential.getId())}
            >
              Delete
            </DangerButton>
          </div>
          <div className="flex items-center gap-3 border-t border-border-subtle px-4 py-2">
            <span className="shrink-0 text-xs font-medium text-muted">
              Credential ID
            </span>
            <code
              className="min-w-0 flex-1 truncate text-xs text-foreground"
              title={credential.getId()}
            >
              {credential.getId()}
            </code>
            <CopyButton
              className="h-7 w-7 shrink-0"
              copyDescription="Copy credential ID"
              copiedDescription="Credential ID copied"
            >
              {credential.getId()}
            </CopyButton>
          </div>
        </div>
      ))}
    </Stack>
  );
}
