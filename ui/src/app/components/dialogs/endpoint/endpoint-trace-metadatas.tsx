import type { Metadata } from '@rapidaai/react';
import {
  StructuredListBody,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
} from '@carbon/react';
import { EmptyState } from '@/app/components/ui/feedback';
import { DataBase } from '@carbon/icons-react';

export function EndpointMetadatas({ metadata }: { metadata: Array<Metadata> }) {
  if (metadata.length <= 0)
    return (
      <EmptyState
        className="h-full min-h-[420px]"
        icon={DataBase}
        title="No metadata found"
        subtitle="No metadata was recorded for this trace."
      />
    );
  return (
    <StructuredListWrapper selection={false}>
      <StructuredListBody>
        {metadata.map((item, index) => (
          <StructuredListRow key={`metadata-idx-${index}`}>
            <StructuredListCell noWrap>{item.getKey()}</StructuredListCell>
            <StructuredListCell>{item.getValue()}</StructuredListCell>
          </StructuredListRow>
        ))}
      </StructuredListBody>
    </StructuredListWrapper>
  );
}
