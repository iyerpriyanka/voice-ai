import type { AssistantConversationMessage, Metadata } from '@rapidaai/react';
import type { ModalProps } from '@/app/components/ui/primitives';
import { RightSideModal } from '@/app/components/dialogs/shared';
import { MarkdownViewer } from '@/app/components/ui/editor/markdown-viewer';
import { EmptyState } from '@/app/components/ui/feedback';
import { Chat } from '@carbon/icons-react';
import { useState } from 'react';
import { LogCodePanel, LogTabs } from './log-modal-primitives';

interface ConversationLogDialogProps extends ModalProps {
  currentAssistantMessage: AssistantConversationMessage;
}

export function ConversationLogDialog({
  modalOpen,
  setModalOpen,
  currentAssistantMessage,
}: ConversationLogDialogProps) {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <RightSideModal
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      className="w-145"
      label="Conversation Log"
      title={currentAssistantMessage.getAssistantconversationid()}
    >
      <ConversationLogContent
        currentAssistantMessage={currentAssistantMessage}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
    </RightSideModal>
  );
}

interface ConversationLogContentProps {
  currentAssistantMessage: AssistantConversationMessage;
  selectedTab: number;
  onTabChange: (index: number) => void;
}

export function ConversationLogContent({
  currentAssistantMessage,
  selectedTab,
  onTabChange,
}: ConversationLogContentProps) {
  return (
    <div className="relative flex flex-col flex-1 min-h-0">
      <LogTabs
        tabs={['Message', 'Metrics', 'Metadata']}
        selectedIndex={selectedTab}
        onChange={onTabChange}
        label="Conversation log tabs"
      >
        <div className="h-full overflow-auto">
          {currentAssistantMessage.getBody() ? (
            <div className="border border-border-subtle">
              <MarkdownViewer text={currentAssistantMessage.getBody()} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center py-8">
              <EmptyState
                icon={Chat}
                title="No Message"
                subtitle="Message will be available here after execution completes."
              />
            </div>
          )}
        </div>
        <LogCodePanel
          value={currentAssistantMessage
            .getMetricsList()
            .map(metric => metric.toObject())}
        />
        <MessageMetadatas
          metadata={currentAssistantMessage.getMetadataList()}
        />
      </LogTabs>
    </div>
  );
}

export function MessageMetadatas({ metadata }: { metadata: Metadata[] }) {
  if (metadata.length === 0) {
    return (
      <div className="h-full flex items-center justify-center py-8">
        <EmptyState
          icon={Chat}
          title="No Metadata"
          subtitle="There is no metadata for this message."
        />
      </div>
    );
  }

  return (
    <div className="divide-y divide-border-subtle w-full">
      {metadata.map((x, idx) => (
        <div
          key={`metadata-idx-${idx}`}
          className="flex items-center justify-between h-12 px-4 gap-4"
        >
          <span className="text-xs font-medium uppercase tracking-[0.08em] text-muted shrink-0">
            {x.getKey()}
          </span>
          <div className="flex items-center text-sm text-foreground">
            {x.getValue()}
          </div>
        </div>
      ))}
    </div>
  );
}
