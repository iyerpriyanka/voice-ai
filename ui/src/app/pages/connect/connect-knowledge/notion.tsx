import { FC } from 'react';
import { PageLoader } from '@/app/components/ui/feedback';
import { useOAuthCallback } from '@/hooks/use-oauth-callback';
import { connectKnowledgeProvider } from '@/clients';

export const ConnectNotionKnowledgePage: FC = () => {
  useOAuthCallback(
    connectKnowledgeProvider,
    'notion',
    'Unable to connect notion, please try again later.',
  );
  return <PageLoader />;
};
