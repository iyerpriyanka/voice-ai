import { useState, useEffect } from 'react';
import toast from 'react-hot-toast/headless';
import { useCredential } from '@/hooks/use-credential';

import { AssistantToolLog } from '@rapidaai/react';
import { useRapidaStore } from '@/stores/app';
import type { ModalProps } from '@/app/components/ui/primitives';
import { RightSideModal } from '@/app/components/dialogs/shared';
import { LogCodePanel, LogTabs } from './log-modal-primitives';
import { getToolActivityLog } from '@/clients';

interface ToolLogModalProps extends ModalProps {
  currentActivityId: string;
}

export function ToolLogDialog({
  modalOpen,
  setModalOpen,
  currentActivityId,
}: ToolLogModalProps) {
  const [userId, token, projectId] = useCredential();
  const { showLoader, hideLoader } = useRapidaStore();
  const [activity, setActivity] = useState<AssistantToolLog | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    showLoader('overlay');

    getToolActivityLog({
      projectId,
      activityId: currentActivityId,
      auth: { projectId, token, userId },
    })
      .then(at => {
        hideLoader();
        if (at?.getSuccess()) {
          const data = at.getData();
          if (data) {
            setActivity(data);
          }
        } else {
          const err = at?.getError();
          if (err) toast.error(err?.getHumanmessage());
          toast.error('Unable to resolve the request, please try again later.');
        }
      })
      .catch(() => {
        hideLoader();
        toast.error('Unable to resolve the request, please try again later.');
      });
  }, [currentActivityId, hideLoader, projectId, showLoader, token, userId]);

  return (
    <RightSideModal
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      className="w-[580px]"
      label="Tool Log"
      title={currentActivityId}
    >
      <ToolLogContent
        activity={activity}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
    </RightSideModal>
  );
}

interface ToolLogContentProps {
  activity: AssistantToolLog | null;
  selectedTab: number;
  onTabChange: (index: number) => void;
}

export function ToolLogContent({
  activity,
  selectedTab,
  onTabChange,
}: ToolLogContentProps) {
  return (
    <div className="relative flex-1 flex flex-col min-h-0">
      <LogTabs
        tabs={['Request', 'Response']}
        selectedIndex={selectedTab}
        onChange={onTabChange}
        label="Tool log tabs"
      >
        <LogCodePanel value={activity?.getRequest()?.toJavaScript()} />
        <LogCodePanel value={activity?.getResponse()?.toJavaScript()} />
      </LogTabs>
    </div>
  );
}
