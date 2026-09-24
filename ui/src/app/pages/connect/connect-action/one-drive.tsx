import { FC } from 'react';
import { PageLoader } from '@/app/components/ui/feedback';
import { useOAuthCallback } from '@/hooks/use-oauth-callback';
import { connectActionProvider } from '@/clients';

export const ConnectOneDriveActionPage: FC = () => {
  useOAuthCallback(
    connectActionProvider,
    'one-drive',
    'Unable to connect one drive, please try again later.',
  );
  return <PageLoader />;
};
