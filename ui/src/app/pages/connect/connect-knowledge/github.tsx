import { FC } from 'react';
import { PageLoader } from '@/app/components/ui/feedback';
import { useOAuthCallback } from '@/hooks/use-oauth-callback';
import { connectKnowledgeProvider } from '@/clients';

export const ConnectGithubKnowledgePage: FC = () => {
  useOAuthCallback(
    connectKnowledgeProvider,
    'github',
    'Unable to connect github, please try again later.',
  );
  return <PageLoader />;
};
