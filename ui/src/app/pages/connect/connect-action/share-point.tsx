import { ActionConnect } from '@rapidaai/react';
import { FC } from 'react';
import { PageLoader } from '@/app/components/ui/feedback';
import { useOAuthCallback } from '@/hooks/use-oauth-callback';

export const ConnectSharePointActionPage: FC = () => {
  useOAuthCallback(
    ActionConnect,
    'share-point',
    'Unable to connect share-point, please try again later.',
  );
  return <PageLoader />;
};
