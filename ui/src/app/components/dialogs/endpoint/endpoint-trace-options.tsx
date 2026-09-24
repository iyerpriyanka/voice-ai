import type { Metadata } from '@rapidaai/react';
import {
  StructuredListBody,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
} from '@carbon/react';
import { EmptyState } from '@/app/components/ui/feedback';
import { ModelAlt } from '@carbon/icons-react';

export function EndpointOptions({ options }: { options: Array<Metadata> }) {
  if (options.length <= 0)
    return (
      <EmptyState
        className="h-full min-h-[420px]"
        icon={ModelAlt}
        title="No model options found"
        subtitle="No model execution options were recorded for this trace."
      />
    );
  return (
    <StructuredListWrapper selection={false}>
      <StructuredListBody>
        {options.map((option, index) => (
          <StructuredListRow key={`options-idx-${index}`}>
            <StructuredListCell noWrap>{option.getKey()}</StructuredListCell>
            <StructuredListCell>
              <pre className="m-0 whitespace-pre-wrap break-all font-mono text-xs leading-5">
                {option.getValue()}
              </pre>
            </StructuredListCell>
          </StructuredListRow>
        ))}
      </StructuredListBody>
    </StructuredListWrapper>
  );
}
