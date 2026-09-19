import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Helmet } from './helmet';

const meta = {
  title: 'App Shell/Helmet',
  component: Helmet,
  parameters: {
    docs: {
      description: {
        component:
          'Updates document metadata using the active tenant theme. The visible preview mirrors the expected document title for easier review.',
      },
    },
  },
  args: {
    title: 'Dashboard',
    meta: [{ name: 'description', content: 'Tenant dashboard' }],
  },
  render: args => (
    <div className="max-w-xl space-y-3 text-sm text-gray-700 dark:text-gray-300">
      <Helmet {...args} />
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Document metadata
      </h1>
      <p>
        The browser title is updated by the head manager. Use the Controls panel
        to change the page title and metadata args.
      </p>
      <dl className="grid grid-cols-[120px_1fr] gap-2">
        <dt className="font-medium">Page title</dt>
        <dd>{args.title || 'Theme brand only'}</dd>
        <dt className="font-medium">Meta tags</dt>
        <dd>{args.meta?.length ?? 0}</dd>
      </dl>
    </div>
  ),
} satisfies Meta<typeof Helmet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BrandOnly: Story = {
  args: {
    title: '',
    meta: [],
  },
};
