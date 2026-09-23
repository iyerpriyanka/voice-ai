import { useState, useEffect } from 'react';
import toast from 'react-hot-toast/headless';
import { useCredential } from '@/hooks/use-credential';
import { OverviewRow } from '@/app/components/dialogs/shared';

import {
  AuditLog,
  GetAuditLogResponse,
  GetActivity,
  ConnectionConfig,
  Metadata,
  ServiceError,
} from '@rapidaai/react';
import { useRapidaStore } from '@/stores/app';
import { CarbonStatusIndicator } from '@/app/components/ui/feedback';
import type { ModalProps } from '@/app/components/ui/primitives';
import { RightSideModal } from '@/app/components/dialogs/shared';
import { HttpStatusSpanIndicator } from '@/app/components/domain/indicators/http-status';
import { connectionConfig } from '@/configs';
import { toHumanReadableDateTime } from '@/utils/date';
import { LogCodePanel, LogTabs } from './log-modal-primitives';

interface LLMLogModalProps extends ModalProps {
  currentActivityId: string;
}

const getHumanMessage = (
  error: ServiceError | { getHumanmessage: () => string } | null | undefined,
) => {
  if (error && 'getHumanmessage' in error) {
    return error.getHumanmessage();
  }
  return undefined;
};

export function LLMLogDialog({
  modalOpen,
  setModalOpen,
  currentActivityId,
}: LLMLogModalProps) {
  const [userId, token, projectId] = useCredential();
  const { showLoader, hideLoader } = useRapidaStore();
  const [additionalData, setAdditionalData] = useState<Metadata[]>([]);
  const [activity, setActivity] = useState<AuditLog | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    showLoader('overlay');

    GetActivity(
      connectionConfig,
      projectId,
      currentActivityId,
      (err: ServiceError | null, at: GetAuditLogResponse | null) => {
        hideLoader();

        if (at?.getSuccess()) {
          const data = at.getData();
          if (data) {
            setActivity(data);
            setAdditionalData(data.getExternalauditmetadatasList());
          }
          return;
        }

        const error = at?.getError() || err;
        const message = getHumanMessage(error);
        if (message) toast.error(message);
        toast.error('Unable to resolve the request, please try again later.');
      },
      ConnectionConfig.WithDebugger({
        authorization: token,
        projectId: projectId,
        userId: userId,
      }),
    );
  }, [currentActivityId, hideLoader, projectId, showLoader, token, userId]);

  return (
    <RightSideModal
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      className="w-[580px]"
      label="LLM Log"
      title={currentActivityId}
    >
      <LLMLogContent
        activity={activity}
        additionalData={additionalData}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
    </RightSideModal>
  );
}

interface LLMLogContentProps {
  activity: AuditLog | null;
  additionalData: Metadata[];
  selectedTab: number;
  onTabChange: (index: number) => void;
}

export function LLMLogContent({
  activity,
  additionalData,
  selectedTab,
  onTabChange,
}: LLMLogContentProps) {
  return (
    <div className="relative flex flex-col flex-1 min-h-0">
      <LogTabs
        tabs={['Overview', 'Request', 'Response', 'Metrics']}
        selectedIndex={selectedTab}
        onChange={onTabChange}
        label="LLM log tabs"
      >
        <div className="divide-y divide-border-subtle w-full">
          {activity && (
            <>
              <OverviewRow label="Status">
                <CarbonStatusIndicator state={activity.getStatus()} />
              </OverviewRow>
              <OverviewRow label="Time Taken">
                <span className="text-sm tabular-nums text-foreground">
                  {`${activity.getTimetaken() / 1000000}ms`}
                </span>
              </OverviewRow>
              <OverviewRow label="Created">
                <span className="text-sm text-foreground">
                  {toHumanReadableDateTime(activity.getCreateddate()!)}
                </span>
              </OverviewRow>
              {activity.getResponsestatus() ? (
                <OverviewRow label="Response Status">
                  <HttpStatusSpanIndicator
                    status={activity.getResponsestatus()}
                  />
                </OverviewRow>
              ) : null}
              {additionalData.map((ad, idx) => (
                <OverviewRow key={idx} label={ad.getKey().replaceAll('_', ' ')}>
                  <span className="text-sm text-foreground truncate max-w-[20rem]">
                    {ad.getValue()}
                  </span>
                </OverviewRow>
              ))}
            </>
          )}
        </div>
        <LogCodePanel value={activity?.getRequest()?.toJavaScript()} />
        <LogCodePanel value={activity?.getResponse()?.toJavaScript()} />
        <LogCodePanel
          value={activity?.getMetricsList().map(metric => metric.toObject())}
        />
      </LogTabs>
    </div>
  );
}
