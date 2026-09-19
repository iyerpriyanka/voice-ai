import { ActionConnect } from '@rapidaai/react';
import { FC } from 'react';
import { PageLoader } from '@/app/components/ui/feedback';
import { useOAuthCallback } from '@/hooks/use-oauth-callback';

export const ConnectGithubActionPage: FC = () => {
  useOAuthCallback(
    ActionConnect,
    'github',
    'Unable to connect github, please try again later.',
  );
  return <PageLoader />;
};
