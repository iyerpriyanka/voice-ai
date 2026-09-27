const fs = require('fs');
const path = require('path');
const {
  COLOR_MODES,
  expect,
  gotoJourney,
  setColorMode,
  screenshotName,
  screenshotPath,
  test,
} = require('./fixtures');
const { journeysWithCheck } = require('./route-manifest');

for (const journey of journeysWithCheck('screenshot')) {
  for (const colorMode of COLOR_MODES) {
    test(`${journey.id} matches screenshot journey in ${colorMode} mode`, async ({
      page,
    }) => {
      await setColorMode(page, colorMode);
      await gotoJourney(page, journey);
      await expect(page.locator('html')).toHaveAttribute(
        'data-color-mode',
        colorMode,
      );

      const targetPath = screenshotPath(journey, colorMode);
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      await page.screenshot({ path: targetPath, fullPage: true });

      expect(fs.existsSync(targetPath)).toBe(true);
      await expect(page).toHaveScreenshot(screenshotName(journey, colorMode), {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
      });
    });
  }
}
