import React from 'react';
import type { Preview } from '@storybook/react-webpack5';
import { HelmetProvider } from 'react-helmet-async';
import developmentConfig from '../src/configs/config.development.json';
import { ThemeProvider } from '../src/theme/theme-provider';
import type { ThemeManifest } from '../src/theme/types';
import '../src/styles/global-styles';

const theme = developmentConfig.theme as ThemeManifest;

const preview: Preview = {
  decorators: [
    Story => (
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <Story />
        </ThemeProvider>
      </HelmetProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
