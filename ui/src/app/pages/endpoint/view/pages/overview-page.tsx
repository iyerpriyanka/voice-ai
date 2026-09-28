import { PrimaryButton } from '@/app/components/ui/primitives';
import { Endpoint, EndpointProviderModel } from '@rapidaai/react';
import { ArrowRight, Code, Report } from '@carbon/icons-react';
import {
  CopyButton,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
  Tag,
  Tile,
} from '@carbon/react';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

function DetailRow(props: { label: string; value: ReactNode }) {
  return (
    <StructuredListRow>
      <StructuredListCell className="w-48 font-semibold" noWrap>
        {props.label}
      </StructuredListCell>
      <StructuredListCell>{props.value}</StructuredListCell>
    </StructuredListRow>
  );
}

function DetailTag(props: {
  value?: string;
  type?: 'green' | 'gray' | 'blue';
}) {
  const value = props.value || 'Not set';

  return (
    <Tag size="sm" type={props.type ?? 'gray'}>
      {value}
    </Tag>
  );
}

function CopyableValue(props: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <code className="break-all text-xs text-[var(--cds-text-primary)]">
        {props.value}
      </code>
      <CopyButton
        align="right"
        size="sm"
        feedback="Copied"
        iconDescription={`Copy ${props.label}`}
        onClick={() => navigator.clipboard?.writeText(props.value)}
      />
    </div>
  );
}

function EndpointUseCase(props: {
  icon: typeof Report;
  title: string;
  description: string;
}) {
  const Icon = props.icon;

  return (
    <Tile className="h-full! p-5!" data-testid="endpoint-use-case">
      <Icon className="text-[var(--cds-icon-primary)]" size={24} />
      <h3 className="mt-4 text-sm font-semibold text-[var(--cds-text-primary)]">
        {props.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[var(--cds-text-secondary)]">
        {props.description}
      </p>
    </Tile>
  );
}

export function EndpointOverviewPage(props: {
  currentEndpoint: Endpoint;
  currentEndpointProviderModel: EndpointProviderModel;
}) {
  const { currentEndpoint, currentEndpointProviderModel } = props;
  const navigate = useNavigate();
  const endpointId = currentEndpoint.getId();
  const status = currentEndpoint.getStatus();

  return (
    <main className="flex-1 overflow-auto bg-[var(--cds-background)] p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section aria-labelledby="endpoint-overview-title">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cds-text-secondary)]">
            Hosted endpoint
          </p>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1
                id="endpoint-overview-title"
                className="text-2xl font-semibold text-[var(--cds-text-primary)]"
              >
                {currentEndpoint.getName()}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--cds-text-secondary)]">
                {currentEndpoint.getDescription() ||
                  'Review the endpoint configuration before invoking it or attaching it to an assistant workflow.'}
              </p>
            </div>
            <PrimaryButton
              size="md"
              renderIcon={ArrowRight}
              onClick={() =>
                navigate(`/deployment/endpoint/${endpointId}/playground`)
              }
            >
              Open playground
            </PrimaryButton>
          </div>
        </section>

        <Tile className="p-0!">
          <div className="border-b border-[var(--cds-border-subtle-01)] px-5 py-4">
            <h2
              id="endpoint-details-title"
              className="text-base font-semibold text-[var(--cds-text-primary)]"
            >
              Endpoint details
            </h2>
          </div>
          <StructuredListWrapper
            aria-labelledby="endpoint-details-title"
            isCondensed
            isFlush
          >
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>Field</StructuredListCell>
                <StructuredListCell head>Value</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              <DetailRow
                label="Status"
                value={
                  <DetailTag
                    value={status}
                    type={status?.toLowerCase() === 'active' ? 'green' : 'gray'}
                  />
                }
              />
              <DetailRow
                label="Model provider"
                value={
                  currentEndpointProviderModel.getModelprovidername() ||
                  'Not set'
                }
              />
              <DetailRow
                label="Visibility"
                value={<DetailTag value={currentEndpoint.getVisibility()} />}
              />
              <DetailRow
                label="Language"
                value={
                  <DetailTag
                    value={currentEndpoint.getLanguage()}
                    type="blue"
                  />
                }
              />
              <DetailRow
                label="Endpoint ID"
                value={<CopyableValue label="endpoint ID" value={endpointId} />}
              />
              <DetailRow
                label="Provider model ID"
                value={
                  <CopyableValue
                    label="provider model ID"
                    value={currentEndpointProviderModel.getId()}
                  />
                }
              />
            </StructuredListBody>
          </StructuredListWrapper>
        </Tile>

        <section aria-labelledby="endpoint-usage-title">
          <h2
            id="endpoint-usage-title"
            className="text-base font-semibold text-[var(--cds-text-primary)]"
          >
            Use this endpoint
          </h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <EndpointUseCase
              icon={Report}
              title="Post-conversation analysis"
              description="Attach this endpoint under an assistant's Analysis settings to run structured processing after a call."
            />
            <EndpointUseCase
              icon={Code}
              title="LLM tool call"
              description="Add this endpoint under Tool Call to make it available during an assistant conversation."
            />
          </div>
        </section>
      </div>
    </main>
  );
}
