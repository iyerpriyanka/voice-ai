import { FC } from 'react';
import { PageLoader } from '@/app/components/ui/feedback';
import { useOAuthCallback } from '@/hooks/use-oauth-callback';
import { connectActionProvider } from '@/clients';

export const ConnectGoogleDriveActionPage: FC = () => {
  useOAuthCallback(
    connectActionProvider,
    'google-drive',
    'Unable to connect google drive, please try again later.',
  );
  return <PageLoader />;
};
