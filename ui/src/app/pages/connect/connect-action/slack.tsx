import { FC } from 'react';
import { PageLoader } from '@/app/components/ui/feedback';
import { useOAuthCallback } from '@/hooks/use-oauth-callback';
import { connectActionProvider } from '@/clients';

export const ConnectSlackActionPage: FC = () => {
  useOAuthCallback(
    connectActionProvider,
    'slack',
    'Unable to connect slack, please try again later.',
  );
  return <PageLoader />;
};
