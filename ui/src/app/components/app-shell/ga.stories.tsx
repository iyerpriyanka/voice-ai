import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { getAnalyticsPagePath, isGoogleAnalyticsEnabled } from './ga';

interface AnalyticsPreviewArgs {
  env: string;
  hostname: string;
  measurementId: string;
  pathname: string;
  search: string;
}

const AnalyticsPreview = ({
  env,
  hostname,
  measurementId,
  pathname,
  search,
}: AnalyticsPreviewArgs) => {
  const isEnabled = isGoogleAnalyticsEnabled({
    env,
    hostname,
    measurementId,
  });
  const page = getAnalyticsPagePath({ pathname, search });

  return (
    <div className="max-w-xl space-y-3 text-sm text-gray-700 dark:text-gray-300">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Google Analytics route tracking
      </h1>
      <p>
        This preview documents the analytics decision without loading Google
        Analytics in Storybook.
      </p>
      <dl className="grid grid-cols-[140px_1fr] gap-2">
        <dt className="font-medium">Enabled</dt>
        <dd>{isEnabled ? 'Yes' : 'No'}</dd>
        <dt className="font-medium">Page path</dt>
        <dd>{page}</dd>
        <dt className="font-medium">Environment</dt>
        <dd>{env}</dd>
        <dt className="font-medium">Host</dt>
        <dd>{hostname}</dd>
      </dl>
    </div>
  );
};

const meta = {
  title: 'App Shell/GA',
  component: AnalyticsPreview,
  parameters: {
    docs: {
      description: {
        component:
          'Documents when route pageviews are sent. The production component sends analytics only when the environment is production, the host is not local, and a measurement id is present.',
      },
    },
  },
  args: {
    env: 'production',
    hostname: 'app.rapida.ai',
    measurementId: 'G-STORYBOOK',
    pathname: '/dashboard',
    search: '?tab=overview',
  },
} satisfies Meta<typeof AnalyticsPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ProductionHost: Story = {};

export const Localhost: Story = {
  args: {
    hostname: 'localhost',
  },
};

export const Development: Story = {
  args: {
    env: 'development',
  },
};
