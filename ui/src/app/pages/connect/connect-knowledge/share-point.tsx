import { FC } from 'react';
import { PageLoader } from '@/app/components/ui/feedback';
import { useOAuthCallback } from '@/hooks/use-oauth-callback';
import { connectKnowledgeProvider } from '@/clients';

export const ConnectSharePointKnowledgePage: FC = () => {
  useOAuthCallback(
    connectKnowledgeProvider,
    'share-point',
    'Unable to connect share-point, please try again later.',
  );
  return <PageLoader />;
};
