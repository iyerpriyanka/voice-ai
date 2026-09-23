import { FC } from 'react';
import { PageLoader } from '@/app/components/ui/feedback';
import { useOAuthCallback } from '@/hooks/use-oauth-callback';
import { connectActionProvider } from '@/clients';

export const ConnectGmailActionPage: FC = () => {
  useOAuthCallback(
    connectActionProvider,
    'gmail',
    'Unable to connect gmail, please try again later.',
  );
  return <PageLoader />;
};
