import { FC } from 'react';
import { PageLoader } from '@/app/components/ui/feedback';
import { useOAuthCallback } from '@/hooks/use-oauth-callback';
import { connectKnowledgeProvider } from '@/clients';

export const ConnectOneDriveKnowledgePage: FC = () => {
  useOAuthCallback(
    connectKnowledgeProvider,
    'one-drive',
    'Unable to connect one drive, please try again later.',
  );
  return <PageLoader />;
};
