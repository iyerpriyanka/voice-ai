const { expect, gotoJourney, test } = require('../../fixtures');
const { routeJourneys } = require('../../route-manifest');

const overviewJourney = routeJourneys.find(
  journey => journey.id === 'deployment.endpointOverview',
);

test('endpoint overview separates resource details from the playground', async ({
  page,
}) => {
  await gotoJourney(page, overviewJourney);

  await expect(
    page.getByRole('heading', { name: 'Endpoint details' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Customer support analysis' }),
  ).toBeVisible();
  await expect(page.locator('form')).toHaveCount(0);

  await page.getByRole('tab', { name: 'Playground' }).click();

  await expect(page).toHaveURL(/\/playground$/);
  await expect(page.getByRole('heading', { name: 'Playground' })).toBeVisible();
  await expect(page.locator('form')).toBeVisible();
});
