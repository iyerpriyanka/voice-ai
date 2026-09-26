const { checkA11y, gotoJourney, test } = require('./fixtures');
const { journeysWithCheck } = require('./route-manifest');

for (const journey of journeysWithCheck('a11y')) {
  test(`${journey.id} has no serious or critical accessibility violations`, async ({
    page,
  }) => {
    await gotoJourney(page, journey);
    await checkA11y(page, journey);
  });
}
