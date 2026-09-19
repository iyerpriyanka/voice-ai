import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Rapida Components',
    brandImage: '/logos/rapida-db.svg',
    brandUrl: '/',
  }),
});
