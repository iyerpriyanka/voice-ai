import { Metric } from '@rapidaai/react';
import { PlainWrapper } from '@/app/components/layout/wrapper/alert-wrapper';
import { cn } from '@/utils';
import { Loading } from '@carbon/react';
import { Checkmark, Play, WarningAlt } from '@carbon/icons-react';
import React, { FC } from 'react';
import { FieldErrors } from 'react-hook-form';

export const ExecuteMessage: FC<{
  apiError?: string;
  loading?: boolean;
  formError?: FieldErrors;
  metrics: Array<Metric>;
  className?: string;
}> = ({ apiError, loading, formError, className, metrics }) => {
  if (loading) {
    return (
      <PlainWrapper className={cn(className, 'flex items-center')}>
        <Loading description="Executing endpoint" withOverlay={false} small />
        <div className="text-sm">Executing your endpoint.</div>
      </PlainWrapper>
    );
  }
  if (apiError)
    return (
      <PlainWrapper className={className}>
        <WarningAlt className="w-5 h-5 text-red-600 dark:text-red-700" />
        <div className="text-sm text-red-600">{apiError}</div>
      </PlainWrapper>
    );

  if (formError && Object.entries(formError).length > 0)
    return (
      <PlainWrapper className={className}>
        <WarningAlt className="w-5 h-5 text-red-600 dark:text-red-700" />
        <ul className="text-sm text-red-600">
          {Object.entries(formError).map(([key, error]) => (
            <li key={key}>{error?.message?.toString()}</li>
          ))}
        </ul>
      </PlainWrapper>
    );
  if (metrics.length > 0) {
    return (
      <PlainWrapper className={className}>
        <Checkmark className="w-5 h-5 text-green-600 dark:text-green-700" />
        <div className="text-sm font-medium">Executed successfully.</div>
      </PlainWrapper>
    );
  }
  return (
    <PlainWrapper>
      <Play className="w-5 h-5 text-blue-600 dark:text-blue-700" />
      <div className="text-sm font-medium">
        Click on the button to execute endpoint.
      </div>
    </PlainWrapper>
  );
};
