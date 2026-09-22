import type { HTMLAttributes } from 'react';
import { memo, useState } from 'react';
import type { AssistantConversationTelephonyEvent } from '@rapidaai/react';
import { ChevronDown, ChevronRight } from '@carbon/icons-react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import { RightSideModal } from '@/app/components/dialogs/shared';
import { ModalBody } from '@/app/components/dialogs/shared';
import type { ModalProps } from '@/app/components/ui/primitives';
import { EmptyState } from '@/app/components/ui/feedback';
import { toHumanReadableDateTime } from '@/utils/date';
import { CodeHighlighting } from '@/app/components/ui/editor/code-highlighting';

interface AssistantConversationTelephonyEventDialogProps
  extends ModalProps,
    HTMLAttributes<HTMLDivElement> {
  events: AssistantConversationTelephonyEvent[];
}

type TelephonyEventSummaryCardProps = {
  label: string;
  value?: string | number;
};

function TelephonyEventSummaryCard({
  label,
  value,
}: TelephonyEventSummaryCardProps) {
  return (
    <div className="border border-border-subtle bg-layer p-3">
      <p className="mb-1 text-xs/6 font-medium uppercase text-muted">{label}</p>
      <p className="text-lg font-medium capitalize text-foreground">
        {value ?? 'N/A'}
      </p>
    </div>
  );
}

interface AssistantConversationTelephonyEventPanelProps {
  events: AssistantConversationTelephonyEvent[];
}

export function AssistantConversationTelephonyEventPanel({
  events,
}: AssistantConversationTelephonyEventPanelProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const latestEvent = events.at(events.length - 1);

  return (
    <>
      <div className="flex items-center border-b border-border-subtle p-4 text-base/6 text-foreground">
        <div className="font-medium">Assistant</div>
        <ChevronRight size={18} className="mx-2 text-muted" />
        <div className="font-medium">Session</div>
        <ChevronRight size={18} className="mx-2 text-muted" />
        <div className="font-medium text-base">Telephony</div>
      </div>
      <div className="relative flex flex-1 flex-col justify-between overflow-auto">
        <ModalBody>
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <TelephonyEventSummaryCard
              label="Total Events"
              value={events.length}
            />
            <TelephonyEventSummaryCard
              label="Provider"
              value={latestEvent?.getProvider()}
            />
            <TelephonyEventSummaryCard
              label="Current Status"
              value={latestEvent?.getEventtype()}
            />
          </div>

          {events.length === 0 ? (
            <EmptyState
              title="No telephony events"
              subtitle="This session does not include telephony event records."
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Event ID</TableHeader>
                  <TableHeader>Event Type</TableHeader>
                  <TableHeader>Created</TableHeader>
                  <TableHeader className="!text-right">Action</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map(event => {
                  const eventId = event.getId();
                  const isExpanded = expandedRow === eventId;
                  const createdDate = event.getCreateddate();

                  return (
                    <TableRow key={eventId}>
                      <TableCell className="!p-0" colSpan={4}>
                        <Button
                          type="button"
                          kind="ghost"
                          size="sm"
                          onClick={() =>
                            setExpandedRow(isExpanded ? null : eventId)
                          }
                          className="!h-auto !min-h-0 !w-full !max-w-none !p-0 !text-left !text-sm"
                        >
                          <div className="grid w-full grid-cols-7 gap-2 border-b border-border-subtle px-4 py-3 text-foreground hover:bg-layer-hover">
                            <div className="col-span-2 truncate font-mono text-xs">
                              {eventId}
                            </div>
                            <div className="col-span-2 font-medium capitalize">
                              {event.getEventtype()}
                            </div>
                            <div className="col-span-2 text-xs text-muted">
                              {createdDate
                                ? toHumanReadableDateTime(createdDate)
                                : 'N/A'}
                            </div>
                            <div className="col-span-1 flex justify-end">
                              <ChevronDown
                                size={16}
                                className={`text-muted transition-transform ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                          </div>
                        </Button>

                        {isExpanded && (
                          <div className="border-b border-border-subtle bg-layer">
                            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted">
                              Payload (Raw)
                            </p>
                            <CodeHighlighting
                              language="json"
                              className="h-[200px] !text-xs"
                              lineNumbers={false}
                              foldGutter={false}
                              code={JSON.stringify(
                                event.getPayload()?.toJavaScript(),
                                null,
                                2,
                              )}
                            />
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </ModalBody>
      </div>
    </>
  );
}

function AssistantConversationTelephonyEventDialogComponent({
  events,
  ...modalAttributes
}: AssistantConversationTelephonyEventDialogProps) {
  return (
    <RightSideModal
      {...modalAttributes}
      className="min-w-[30vw]! overflow-visible"
    >
      <AssistantConversationTelephonyEventPanel events={events} />
    </RightSideModal>
  );
}

export const AssistantConversationTelephonyEventDialog = memo(
  AssistantConversationTelephonyEventDialogComponent,
);
