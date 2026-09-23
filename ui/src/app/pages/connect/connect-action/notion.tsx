import { FC } from 'react';
import { PageLoader } from '@/app/components/ui/feedback';
import { useOAuthCallback } from '@/hooks/use-oauth-callback';
import { connectActionProvider } from '@/clients';

export const ConnectNotionActionPage: FC = () => {
  useOAuthCallback(
    connectActionProvider,
    'notion',
    'Unable to connect notion, please try again later.',
  );
  return <PageLoader />;
};
