import { ActionConnect } from '@rapidaai/react';
import { FC } from 'react';
import { PageLoader } from '@/app/components/ui/feedback';
import { useOAuthCallback } from '@/hooks/use-oauth-callback';

export const ConnectGmailActionPage: FC = () => {
  useOAuthCallback(
    ActionConnect,
    'gmail',
    'Unable to connect gmail, please try again later.',
  );
  return <PageLoader />;
};
