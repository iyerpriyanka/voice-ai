const {
  COLOR_MODES,
  checkA11y,
  expect,
  gotoJourney,
  setColorMode,
  test,
} = require('./fixtures');
const { journeysWithCheck } = require('./route-manifest');

for (const journey of journeysWithCheck('a11y')) {
  for (const colorMode of COLOR_MODES) {
    test(`${journey.id} has no serious or critical accessibility violations in ${colorMode} mode`, async ({
      page,
    }) => {
      await setColorMode(page, colorMode);
      await gotoJourney(page, journey);
      await expect(page.locator('html')).toHaveAttribute(
        'data-color-mode',
        colorMode,
      );
      await checkA11y(page, journey);
    });
  }
}
