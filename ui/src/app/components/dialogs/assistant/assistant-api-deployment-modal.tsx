import {
  type AssistantApiDeployment,
  type DeploymentAudioProvider,
} from '@rapidaai/react';
import type { ModalProps } from '@/app/components/ui/primitives';
import { RightSideModal } from '@/app/components/dialogs/shared';
import { CopyButton } from '@/app/components/ui/primitives';
import { YellowNoticeBlock } from '@/app/components/layout/container/message/notice-block';
import { ProviderPill } from '@/app/components/domain/pills/provider-model-pill';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DeploymentRow,
  DeploymentSectionHeader,
} from '@/app/components/dialogs/shared';
import { Tabs } from '@/app/components/ui/primitives';

interface AssistantApiDeploymentDialogProps extends ModalProps {
  deployment: AssistantApiDeployment;
}

export function AssistantApiDeploymentDialog(
  props: AssistantApiDeploymentDialogProps,
) {
  const [selectedTab, setSelectedTab] = useState(0);
  const modalContent = (
    <RightSideModal
      modalOpen={props.modalOpen}
      setModalOpen={props.setModalOpen}
      className="w-[580px]"
      label="SDK / API Deployment"
      title={props.deployment.getId()}
    >
      <div className="relative flex flex-col flex-1 min-h-0">
        <Tabs
          tabs={['Audio']}
          selectedIndex={selectedTab}
          onChange={setSelectedTab}
          contained
          fill
          aria-label="SDK/API deployment tabs"
          panelClassName="overflow-auto p-0"
        >
          <div className="divide-y divide-gray-200 dark:divide-gray-800 w-full">
            <VoiceInput deployment={props.deployment?.getInputaudio()} />
            <VoiceOutput deployment={props.deployment?.getOutputaudio()} />
          </div>
        </Tabs>
      </div>
    </RightSideModal>
  );

  if (typeof document === 'undefined') return modalContent;

  return createPortal(modalContent, document.body);
}

const Row = DeploymentRow;
const SectionHeader = DeploymentSectionHeader;

interface DeploymentAudioProps {
  deployment?: DeploymentAudioProvider;
}

function VoiceInput({ deployment }: DeploymentAudioProps) {
  return (
    <>
      <SectionHeader label="Speech to text" />
      {deployment?.getAudiooptionsList() ? (
        deployment?.getAudiooptionsList().length > 0 && (
          <>
            <Row label="Provider">
              <ProviderPill provider={deployment?.getAudioprovider()} />
            </Row>
            {deployment
              ?.getAudiooptionsList()
              .filter(detail => detail.getValue())
              .filter(detail => detail.getKey().startsWith('listen.'))
              .map((detail, index) => (
                <Row key={index} label={detail.getKey()}>
                  <span className="text-sm font-mono text-gray-900 dark:text-gray-100 truncate max-w-[200px] text-right">
                    {detail.getValue()}
                  </span>
                  <CopyButton className="h-6 w-6 shrink-0">
                    {detail.getValue()}
                  </CopyButton>
                </Row>
              ))}
          </>
        )
      ) : (
        <div className="px-4 py-3">
          <YellowNoticeBlock>Voice input is not enabled</YellowNoticeBlock>
        </div>
      )}
    </>
  );
}

function VoiceOutput({ deployment }: DeploymentAudioProps) {
  return (
    <>
      <SectionHeader label="Text to speech" />
      {deployment?.getAudiooptionsList() ? (
        deployment?.getAudiooptionsList().length > 0 && (
          <>
            <Row label="Provider">
              <ProviderPill provider={deployment?.getAudioprovider()} />
            </Row>
            {deployment
              ?.getAudiooptionsList()
              .filter(detail => detail.getValue())
              .filter(detail => detail.getKey().startsWith('speak.'))
              .map((detail, index) => (
                <Row key={index} label={detail.getKey()}>
                  <span className="text-sm font-mono text-gray-900 dark:text-gray-100 truncate max-w-[200px] text-right">
                    {detail.getValue()}
                  </span>
                  <CopyButton className="h-6 w-6 shrink-0">
                    {detail.getValue()}
                  </CopyButton>
                </Row>
              ))}
          </>
        )
      ) : (
        <div className="px-4 py-3">
          <YellowNoticeBlock>Voice output is not enabled</YellowNoticeBlock>
        </div>
      )}
    </>
  );
}
