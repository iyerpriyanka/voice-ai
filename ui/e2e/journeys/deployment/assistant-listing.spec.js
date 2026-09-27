const {
  ASSISTANT_LIST_PATH,
  expect,
  gotoJourney,
  test,
} = require('../../fixtures');
const { routeJourneys } = require('../../route-manifest');

const assistantJourney = routeJourneys.find(
  journey => journey.id === 'deployment.assistant',
);
const assistantListError =
  'Something went wrong while retrieving your assistants. Please refresh the page or try again later.';

test('assistant listing renders a successful empty result', async ({
  page,
}) => {
  let requestCount = 0;

  page.on('request', request => {
    if (
      request.method() === 'POST' &&
      request.url().endsWith('/assistant_api.AssistantService/GetAllAssistant')
    ) {
      requestCount += 1;
    }
  });

  await gotoJourney(page, assistantJourney);
  await page.waitForLoadState('networkidle');

  await expect(page.getByText('No assistants', { exact: true })).toBeVisible();
  await expect(page.getByText(assistantListError)).toHaveCount(0);
  expect(requestCount).toBe(1);
});

test('assistant listing reports one failed initial request', async ({
  page,
}) => {
  let requestCount = 0;

  await page.route(ASSISTANT_LIST_PATH, route => {
    if (route.request().method() !== 'POST') {
      return route.fallback();
    }

    requestCount += 1;
    return route.abort('failed');
  });

  await gotoJourney(page, assistantJourney);
  await page.waitForLoadState('networkidle');

  expect(requestCount).toBe(1);
  await expect(page.getByText(assistantListError)).toHaveCount(1);
});
