const { test } = require('./fixtures');
const { journeysWithCheck } = require('./route-manifest');
const { gotoJourney } = require('./fixtures');

for (const journey of journeysWithCheck('smoke')) {
  test(`${journey.id} renders ${journey.path}`, async ({ page }) => {
    await gotoJourney(page, journey);
  });
}
