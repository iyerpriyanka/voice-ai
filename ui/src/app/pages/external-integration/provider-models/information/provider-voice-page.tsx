import { Helmet } from '@/app/components/app-shell/helmet';
import { CreateProviderCredentialDialog } from '@/app/components/dialogs/provider';
import { ViewProviderCredentialDialog } from '@/app/components/dialogs/provider';
import { PageHeaderBlock } from '@/app/components/layout/blocks/page-header-block';
import { PageTitleBlock } from '@/app/components/layout/blocks/page-title-block';
import { GhostButton, PrimaryButton } from '@/app/components/ui/primitives';
import {
  VoiceCatalog,
  VoiceCatalogItem,
} from '@/app/pages/external-integration/provider-models/information/voice-catalog';
import { useAllProviderCredentials } from '@/hooks/use-model';
import { RapidaProvider } from '@/providers';
import { Add } from '@carbon/icons-react';
import { Tag } from '@carbon/react';
import { useMemo, useState } from 'react';

export function ProviderVoicePage(props: {
  provider?: RapidaProvider;
  voices: VoiceCatalogItem[];
}) {
  const { provider, voices } = props;
  const { providerCredentials } = useAllProviderCredentials();
  const [createProviderModalOpen, setCreateProviderModalOpen] = useState(false);
  const [viewProviderModalOpen, setViewProviderModalOpen] = useState(false);
  const connected = useMemo(
    () =>
      providerCredentials.some(
        credential => credential.getProvider() === provider?.code,
      ),
    [provider?.code, providerCredentials],
  );

  if (!provider) return null;

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <CreateProviderCredentialDialog
        modalOpen={createProviderModalOpen}
        setModalOpen={setCreateProviderModalOpen}
        currentProvider={provider.code}
      />
      <ViewProviderCredentialDialog
        modalOpen={viewProviderModalOpen}
        setModalOpen={setViewProviderModalOpen}
        currentProvider={provider}
        onSetupCredential={() => {
          setViewProviderModalOpen(false);
          setCreateProviderModalOpen(true);
        }}
      />
      <Helmet title={`${provider.name} voices`} />
      <PageHeaderBlock className="min-h-20">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[2px] border border-[var(--cds-border-subtle-01)] bg-[var(--cds-layer-01)]">
            <img
              src={provider.image}
              alt=""
              className="max-h-14 max-w-14 rounded-[2px]"
            />
          </div>
          <PageTitleBlock>
            <div className="flex items-center gap-2">
              <span className="capitalize">{provider.name}</span>
              <Tag type={connected ? 'green' : 'gray'} size="sm">
                {connected ? 'Connected' : 'Not connected'}
              </Tag>
            </div>
            <p className="line-clamp-2 text-sm text-[var(--cds-text-secondary)]">
              {provider.description}
            </p>
          </PageTitleBlock>
        </div>
      </PageHeaderBlock>
      <VoiceCatalog
        voices={voices}
        actions={
          <div className="flex shrink-0 items-center">
            <GhostButton
              size="md"
              onClick={() => setViewProviderModalOpen(true)}
            >
              View credential
            </GhostButton>
            <PrimaryButton
              size="md"
              renderIcon={Add}
              onClick={() => setCreateProviderModalOpen(true)}
            >
              Add new credential
            </PrimaryButton>
          </div>
        }
      />
    </div>
  );
}
