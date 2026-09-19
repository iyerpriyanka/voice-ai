import React, { FC, useState } from 'react';
import { EndpointLog } from '@rapidaai/react';
import { RightSideModal } from '@/app/components/dialogs/right-side-modal';
import { ModalProps } from '@/app/components/ui/primitives/modal';
import { SourceIndicator } from '@/app/components/domain/indicators/source';
import { EndpointMetrics } from '@/app/components/dialogs/endpoint-trace-metrics';
import { EndpointMetadatas } from '@/app/components/dialogs/endpoint-trace-metadatas';
import { EndpointOptions } from '@/app/components/dialogs/endpoint-trace-options';
import { EndpointArguments } from '@/app/components/dialogs/endpoint-trace-arguments';
import { toHumanReadableDateTime } from '@/utils/date';
import { getTotalTokenMetric } from '@/utils/metadata';
import { OverviewRow } from '@/app/components/dialogs/overview-row';
import { Tabs } from '@/app/components/ui/primitives/tabs';
import { CarbonStatusIndicator } from '@/app/components/ui/feedback/status-indicator';

interface EndpointTraceModalProps extends ModalProps {
  currentTrace: EndpointLog | null;
}

export const EndpointTraceModal: FC<EndpointTraceModalProps> = ({
  modalOpen,
  setModalOpen,
  currentTrace,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  if (!currentTrace) return null;

  return (
    <RightSideModal
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      className="w-[580px]"
      label="Trace"
      title={currentTrace.getId()}
    >
      <div className="relative flex flex-col flex-1 min-h-0">
        <Tabs
          tabs={['Overview', 'Metrics', 'Metadata', 'Options', 'Arguments']}
          selectedIndex={selectedTab}
          onChange={setSelectedTab}
          contained
          aria-label="Endpoint trace tabs"
          className="!h-full !min-h-0 !flex !flex-col [&_.cds--tabs__nav]:border-b [&_.cds--tabs__nav]:border-gray-200 dark:[&_.cds--tabs__nav]:border-gray-800 [&_.cds--tab-content]:!h-full [&_.cds--tab-content]:!min-h-0 [&_.cds--tab-content]:!p-0"
          panelClassName="!h-full !min-h-0 !overflow-auto !p-0"
        >
          <div className="divide-y divide-gray-200 dark:divide-gray-800 w-full">
            <OverviewRow label="Status">
              <CarbonStatusIndicator state={currentTrace.getStatus()} />
            </OverviewRow>
            <OverviewRow label="Source">
              <SourceIndicator source={currentTrace.getSource()} />
            </OverviewRow>
            <OverviewRow label="Version">
              <span className="text-sm font-mono text-gray-900 dark:text-gray-100">
                vrsn_{currentTrace.getEndpointprovidermodelid()}
              </span>
            </OverviewRow>
            <OverviewRow label="Time Taken">
              <span className="text-sm tabular-nums text-gray-900 dark:text-gray-100">
                {Number(currentTrace.getTimetaken()) / 1000000}ms
              </span>
            </OverviewRow>
            <OverviewRow label="Total Tokens">
              <span className="text-sm tabular-nums text-gray-900 dark:text-gray-100">
                {getTotalTokenMetric(currentTrace.getMetricsList())}
              </span>
            </OverviewRow>
            {currentTrace.getCreateddate() && (
              <OverviewRow label="Created">
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {toHumanReadableDateTime(currentTrace.getCreateddate()!)}
                </span>
              </OverviewRow>
            )}
          </div>
          <EndpointMetrics metrics={currentTrace.getMetricsList()} />
          <EndpointMetadatas metadata={currentTrace.getMetadataList()} />
          <EndpointOptions options={currentTrace.getOptionsList()} />
          <EndpointArguments args={currentTrace.getArgumentsList()} />
        </Tabs>
      </div>
    </RightSideModal>
  );
};
