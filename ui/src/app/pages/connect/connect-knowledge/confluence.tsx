import { FC } from 'react';
import { PageLoader } from '@/app/components/ui/feedback';
import { useOAuthCallback } from '@/hooks/use-oauth-callback';
import { connectKnowledgeProvider } from '@/clients';

export const ConnectConfluencePage: FC = () => {
  useOAuthCallback(
    connectKnowledgeProvider,
    'atlassian',
    'Unable to connect confluence, please try again later.',
  );
  return <PageLoader />;
};
