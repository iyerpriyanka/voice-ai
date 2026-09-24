import { FC } from 'react';
import { PageLoader } from '@/app/components/ui/feedback';
import { useOAuthCallback } from '@/hooks/use-oauth-callback';
import { connectActionProvider } from '@/clients';

export const ConnectGithubActionPage: FC = () => {
  useOAuthCallback(
    connectActionProvider,
    'github',
    'Unable to connect github, please try again later.',
  );
  return <PageLoader />;
};
