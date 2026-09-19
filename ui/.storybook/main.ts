import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-webpack5';

const storybookDirectory = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: false,
  },
  staticDirs: ['../public'],
  webpackFinal: async storybookConfig => {
    const checkerPlugins = new Set([
      'ESLintWebpackPlugin',
      'ForkTsCheckerWebpackPlugin',
    ]);

    storybookConfig.resolve = storybookConfig.resolve ?? {};
    storybookConfig.resolve.alias = {
      ...(storybookConfig.resolve.alias ?? {}),
      '@': path.resolve(storybookDirectory, '../src'),
    };
    storybookConfig.plugins = storybookConfig.plugins?.filter(
      plugin => !checkerPlugins.has(plugin?.constructor?.name ?? ''),
    );

    return storybookConfig;
  },
};

export default config;
