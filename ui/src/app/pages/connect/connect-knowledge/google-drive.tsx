import { FC } from 'react';
import { PageLoader } from '@/app/components/ui/feedback';
import { useOAuthCallback } from '@/hooks/use-oauth-callback';
import { connectKnowledgeProvider } from '@/clients';

export const ConnectGoogleDriveKnowledgePage: FC = () => {
  useOAuthCallback(
    connectKnowledgeProvider,
    'google-drive',
    'Unable to connect google drive, please try again later.',
  );
  return <PageLoader />;
};
