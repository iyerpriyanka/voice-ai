const fs = require('fs');
const path = require('path');
const {
  expect,
  gotoJourney,
  screenshotName,
  screenshotPath,
  test,
} = require('./fixtures');
const { journeysWithCheck } = require('./route-manifest');

for (const journey of journeysWithCheck('screenshot')) {
  test(`${journey.id} matches screenshot journey`, async ({ page }) => {
    await gotoJourney(page, journey);

    const targetPath = screenshotPath(journey);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    await page.screenshot({ path: targetPath, fullPage: true });

    expect(fs.existsSync(targetPath)).toBe(true);
    await expect(page).toHaveScreenshot(screenshotName(journey), {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
}
