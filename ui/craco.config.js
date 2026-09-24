const path = require('path');
const os = require('os');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const shouldUseAllure = process.env.ALLURE_REPORT === 'true';

module.exports = {
  jest: {
    configure: jestConfig => {
      jestConfig.moduleNameMapper = {
        ...jestConfig.moduleNameMapper,
        '^@/(.*)$': '<rootDir>/src/$1',
      };
      jestConfig.setupFilesAfterEnv = [
        ...(jestConfig.setupFilesAfterEnv || []),
        '<rootDir>/src/setup-tests.ts',
      ];
      if (shouldUseAllure) {
        jestConfig.testEnvironment = 'allure-jest/jsdom';
        jestConfig.testEnvironmentOptions = {
          ...(jestConfig.testEnvironmentOptions || {}),
          resultsDir: 'allure-results',
          environmentInfo: {
            project: 'rapida.ai ui',
            testRunner: 'jest',
            node: process.version,
            os: `${os.type()} ${os.release()}`,
          },
          globalLabels: {
            layer: 'ui',
          },
        };
      }
      return jestConfig;
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    plugins: [new MonacoWebpackPlugin()],
    configure: webpackConfig => {
      webpackConfig.output = {
        ...webpackConfig.output,
        publicPath: '/', // Ensures assets are loaded with relative paths in Electron
      };
      webpackConfig.plugins = webpackConfig.plugins.filter(
        plugin => plugin?.constructor?.name !== 'ForkTsCheckerWebpackPlugin',
      );
      return webpackConfig;
    },
  },
};
