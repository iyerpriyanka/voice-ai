import { Metric } from '@rapidaai/react';
import { Tooltip } from '@/app/components/ui/primitives/tooltip';
import { FC } from 'react';
import { EmptyState } from '@/app/components/ui/feedback/empty-state';
import {
  ChartLine,
  CheckmarkFilled,
  ErrorFilled,
  Information,
} from '@carbon/icons-react';

export const EndpointMetrics: FC<{ metrics: Array<Metric> }> = ({
  metrics,
}) => {
  if (metrics.length <= 0)
    return (
      <EmptyState
        className="h-full min-h-[420px]"
        icon={ChartLine}
        title="No metrics found"
        subtitle="No metrics were recorded for this trace."
      />
    );
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-800 w-full">
      {metrics.map((x, idx) => (
        <div
          key={`metrics-idx-${idx}`}
          className="flex items-center justify-between h-12 px-4 gap-4"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400 shrink-0">
              {x.getName()}
            </span>
            <Tooltip
              icon={
                <Information
                  size={14}
                  className="text-gray-400 shrink-0"
                />
              }
            >
              <p className="font-normal text-sm p-1 px-2">
                {x.getDescription()}
              </p>
            </Tooltip>
          </div>
          <div className="flex items-center shrink-0 ml-4">
            <MetricValue value={x.getValue()} />
          </div>
        </div>
      ))}
    </div>
  );
};

const MetricValue = ({ value }) => {
  if (
    typeof value === 'string' &&
    !isNaN(parseFloat(value)) &&
    parseFloat(value) < 1
  ) {
    const progress = Math.min(Math.max(parseFloat(value), 0), 100);
    return (
      <div className="w-24 bg-gray-200 dark:bg-gray-700 h-1.5">
        <div className="bg-primary h-1.5" style={{ width: `${progress}%` }} />
      </div>
    );
  } else if (value === 'false') {
    return (
      <CheckmarkFilled size={20} className="text-green-500" />
    );
  } else if (value === 'true') {
    return <ErrorFilled size={20} className="text-red-500" />;
  } else {
    return (
      <span className="text-gray-900 dark:text-gray-100 tabular-nums">
        {value}
      </span>
    );
  }
};
