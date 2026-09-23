import { useState, useEffect } from 'react';
import toast from 'react-hot-toast/headless';
import { useCredential } from '@/hooks/use-credential';
import { useRapidaStore } from '@/stores/app';
import type { ModalProps } from '@/app/components/ui/primitives';
import { RightSideModal } from '@/app/components/dialogs/shared';
import {
  AssistantHTTPLog,
  GetAssistantHTTPLogRequest,
  GetHTTPLog,
} from '@rapidaai/react';
import { connectionConfig } from '@/configs';
import { LogCodePanel, LogTabs } from './log-modal-primitives';

interface RequestLogModalProps extends ModalProps {
  currentRequestLogId: string;
}

export function RequestLogDialog({
  modalOpen,
  setModalOpen,
  currentRequestLogId,
}: RequestLogModalProps) {
  const [userId, token, projectId] = useCredential();
  const { showLoader, hideLoader } = useRapidaStore();
  const [activity, setActivity] = useState<AssistantHTTPLog | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    showLoader('overlay');

    const req = new GetAssistantHTTPLogRequest();
    req.setProjectid(projectId);
    req.setId(currentRequestLogId);

    GetHTTPLog(connectionConfig, req, {
      authorization: token,
      'x-auth-id': userId,
      'x-project-id': projectId,
    })
      .then(at => {
        hideLoader();
        if (at?.getSuccess()) {
          const data = at.getData();
          if (data) {
            setActivity(data);
          }
        } else {
          const error = at?.getError();
          if (error) toast.error(error.getHumanmessage());
          toast.error('Unable to resolve the request, please try again later.');
        }
      })
      .catch(() => {
        hideLoader();
        toast.error('Unable to resolve the request, please try again later.');
      });
  }, [currentRequestLogId, hideLoader, projectId, showLoader, token, userId]);

  return (
    <RightSideModal
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      className="w-[580px]"
      label="Request Log"
      title={currentRequestLogId}
    >
      <RequestLogContent
        activity={activity}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
    </RightSideModal>
  );
}

interface RequestLogContentProps {
  activity: AssistantHTTPLog | null;
  selectedTab: number;
  onTabChange: (index: number) => void;
}

export function RequestLogContent({
  activity,
  selectedTab,
  onTabChange,
}: RequestLogContentProps) {
  return (
    <div className="relative flex-1 flex flex-col min-h-0">
      <LogTabs
        tabs={['Request', 'Response']}
        selectedIndex={selectedTab}
        onChange={onTabChange}
        label="Request log tabs"
      >
        <LogCodePanel value={activity?.getRequest()?.toJavaScript()} />
        <LogCodePanel value={activity?.getResponse()?.toJavaScript()} />
      </LogTabs>
    </div>
  );
}
