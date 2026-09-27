const { expect, gotoJourney, test } = require('./fixtures');
const { routeJourneys } = require('./route-manifest');

function isApplicationClientRequest(request) {
  return ['fetch', 'xhr'].includes(request.resourceType());
}

for (const journey of routeJourneys) {
  test(`${journey.id} completes initial client requests`, async ({
    page,
  }, testInfo) => {
    const failures = [];
    const requests = [];

    page.on('request', request => {
      if (!isApplicationClientRequest(request)) return;
      requests.push({
        method: request.method(),
        url: request.url(),
      });
    });

    page.on('requestfailed', request => {
      if (!isApplicationClientRequest(request)) return;
      failures.push({
        method: request.method(),
        url: request.url(),
        error: request.failure()?.errorText || 'request failed',
      });
    });

    page.on('response', response => {
      if (!isApplicationClientRequest(response.request())) return;
      if (response.status() < 400) return;
      failures.push({
        method: response.request().method(),
        url: response.url(),
        error: `HTTP ${response.status()}`,
      });
    });

    await gotoJourney(page, journey);
    await page.waitForLoadState('networkidle');

    const visibleApplicationErrors = (
      await page.locator('.cds--toast-notification--error').allTextContents()
    )
      .map(message => message.trim())
      .filter(Boolean);

    await testInfo.attach('client-requests.json', {
      body: Buffer.from(JSON.stringify(requests, null, 2)),
      contentType: 'application/json',
    });

    if (process.env.E2E_LOG_CLIENT_REQUESTS === '1') {
      console.log(journey.id, requests);
    }

    expect(failures).toEqual([]);
    expect(visibleApplicationErrors).toEqual([]);
  });
}
