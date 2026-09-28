const { expect, gotoJourney, test } = require('../../fixtures');
const { routeJourneys } = require('../../route-manifest');

const googleJourney = routeJourneys.find(
  journey => journey.id === 'integration.googleSpeechService',
);

test('provider catalogue uses an expandable table toolbar and lazy previews', async ({
  page,
}) => {
  const previewRequests = [];
  page.on('request', request => {
    if (/\.(mp3|wav)(\?|$)/i.test(request.url())) {
      previewRequests.push(request.url());
    }
  });
  await page.route('https://docs.cloud.google.com/**', route =>
    route.fulfill({ status: 204 }),
  );

  await gotoJourney(page, googleJourney);

  await expect(
    page.locator('[data-testid="voice-catalog-table"] tbody tr'),
  ).toHaveCount(12);

  const searchContainer = page.locator(
    '.cds--toolbar-search-container-expandable',
  );
  const search = page.getByRole('searchbox', { name: 'Search voices' });
  await expect(searchContainer).toHaveClass(/-expandable/);
  await expect(searchContainer).not.toHaveClass(/-active/);
  await search.focus();
  await expect(searchContainer).toHaveClass(/-active/);
  await search.blur();
  await expect(searchContainer).not.toHaveClass(/-active/);

  await expect(page.locator('audio')).toHaveCount(0);
  expect(previewRequests).toEqual([]);

  await page
    .getByRole('button', { name: /^Preview / })
    .first()
    .click();
  await expect.poll(() => previewRequests.length).toBe(1);
  await expect(page.locator('audio')).toHaveCount(0);
});
