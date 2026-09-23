import { useState, useEffect } from 'react';
import toast from 'react-hot-toast/headless';
import { useCredential } from '@/hooks/use-credential';
import { OverviewRow } from '@/app/components/dialogs/shared';
import {
  ConnectionConfig,
  GetKnowledgeLog,
  GetKnowledgeLogRequest,
  KnowledgeLog,
} from '@rapidaai/react';
import { useRapidaStore } from '@/stores/app';
import { StatusIndicator } from '@/app/components/domain/indicators/status';
import type { ModalProps } from '@/app/components/ui/primitives';
import { RightSideModal } from '@/app/components/dialogs/shared';
import { connectionConfig } from '@/configs';
import { toHumanReadableDateTime } from '@/utils/date';
import { LogCodePanel, LogTabs } from './log-modal-primitives';

interface KnowledgeLogModalProps extends ModalProps {
  currentActivityId: string;
}

export function KnowledgeLogDialog({
  modalOpen,
  setModalOpen,
  currentActivityId,
}: KnowledgeLogModalProps) {
  const [userId, token, projectId] = useCredential();
  const { showLoader, hideLoader } = useRapidaStore();
  const [activity, setActivity] = useState<KnowledgeLog | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    showLoader('overlay');

    const request = new GetKnowledgeLogRequest();
    request.setId(currentActivityId);
    request.setProjectid(projectId);

    GetKnowledgeLog(
      connectionConfig,
      request,
      ConnectionConfig.WithDebugger({
        authorization: token,
        projectId: projectId,
        userId: userId,
      }),
    )
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
      label="Knowledge Log"
      title={currentActivityId}
    >
      <KnowledgeLogContent
        activity={activity}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
    </RightSideModal>
  );
}

interface KnowledgeLogContentProps {
  activity: KnowledgeLog | null;
  selectedTab: number;
  onTabChange: (index: number) => void;
}

export function KnowledgeLogContent({
  activity,
  selectedTab,
  onTabChange,
}: KnowledgeLogContentProps) {
  return (
    <div className="relative flex-1 flex flex-col min-h-0">
      <LogTabs
        tabs={['Overview', 'Request', 'Response']}
        selectedIndex={selectedTab}
        onChange={onTabChange}
        label="Knowledge log tabs"
      >
        <div className="divide-y divide-border-subtle w-full">
          {activity && (
            <>
              <OverviewRow label="Status">
                <StatusIndicator state={activity.getStatus()} size="small" />
              </OverviewRow>
              <OverviewRow label="Time Taken">
                <span className="text-sm tabular-nums text-foreground">
                  {`${Number(activity.getTimetaken()) / 1000000}ms`}
                </span>
              </OverviewRow>
              <OverviewRow label="Created">
                <span className="text-sm text-foreground">
                  {toHumanReadableDateTime(activity.getCreateddate()!)}
                </span>
              </OverviewRow>
            </>
          )}
        </div>
        <LogCodePanel value={activity?.getRequest()?.toJavaScript()} />
        <LogCodePanel value={activity?.getResponse()?.toJavaScript()} />
      </LogTabs>
    </div>
  );
}
