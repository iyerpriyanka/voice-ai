const {
  AUTHENTICATION_PATHS,
  expect,
  gotoJourney,
  mockAuthenticationOperation,
  test,
} = require('../../fixtures');
const { routeJourneys } = require('../../route-manifest');

const authJourney = id =>
  routeJourneys.find(journey => journey.id === `auth.${id}`);

async function submitSignIn(page) {
  await page.getByLabel('Email Address').fill('user@example.test');
  await page.locator('#signin-password').fill('correct horse battery staple');
  await page.getByRole('button', { name: 'Continue' }).click();
}

async function submitSignUp(page) {
  await page.getByLabel('Name').fill('E2E User');
  await page.getByLabel('Email Address').fill('user@example.test');
  await page.locator('#signup-password').fill('correct horse battery staple');
  await page.getByRole('button', { name: 'Create account' }).click();
}

test('sign-in submits through the authentication client and opens the dashboard', async ({
  page,
}) => {
  await gotoJourney(page, authJourney('signin'));
  const request = page.waitForRequest(
    candidate =>
      candidate.method() === 'POST' &&
      candidate.url().endsWith(AUTHENTICATION_PATHS.signIn),
  );

  await submitSignIn(page);

  await request;
  await expect(page).toHaveURL(/\/dashboard$/);
});

test('sign-in displays the authentication client error', async ({ page }) => {
  await mockAuthenticationOperation(page, 'signIn', {
    success: false,
    message: 'Invalid email or password.',
  });
  await gotoJourney(page, authJourney('signin'));

  await submitSignIn(page);

  await expect(page.getByText('Invalid email or password.')).toBeVisible();
  await expect(page).toHaveURL(/\/auth\/signin$/);
});

test('sign-up submits through the authentication client and opens the dashboard', async ({
  page,
}) => {
  await gotoJourney(page, authJourney('signup'));
  const request = page.waitForRequest(
    candidate =>
      candidate.method() === 'POST' &&
      candidate.url().endsWith(AUTHENTICATION_PATHS.signUp),
  );

  await submitSignUp(page);

  await request;
  await expect(page).toHaveURL(/\/dashboard$/);
});

test('sign-up displays the authentication client error', async ({ page }) => {
  await mockAuthenticationOperation(page, 'signUp', {
    success: false,
    message: 'An account already exists for this email.',
  });
  await gotoJourney(page, authJourney('signup'));

  await submitSignUp(page);

  await expect(
    page.getByText('An account already exists for this email.'),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/auth\/signup$/);
});

test('forgot password confirms a successful client response', async ({
  page,
}) => {
  await gotoJourney(page, authJourney('forgotPassword'));
  const request = page.waitForRequest(
    candidate =>
      candidate.method() === 'POST' &&
      candidate.url().endsWith(AUTHENTICATION_PATHS.forgotPassword),
  );

  await page.getByLabel('Email Address').fill('user@example.test');
  await page.getByRole('button', { name: 'Send reset link' }).click();

  await request;
  await expect(page.getByText('Email sent')).toBeVisible();
  await expect(page.getByText(/Thanks! An email was sent/)).toBeVisible();
});

test('forgot password displays the authentication client error', async ({
  page,
}) => {
  await mockAuthenticationOperation(page, 'forgotPassword', {
    success: false,
    message: 'No account was found for this email.',
  });
  await gotoJourney(page, authJourney('forgotPassword'));

  await page.getByLabel('Email Address').fill('missing@example.test');
  await page.getByRole('button', { name: 'Send reset link' }).click();

  await expect(
    page.getByText('No account was found for this email.'),
  ).toBeVisible();
  await expect(page.getByText('Email sent')).toHaveCount(0);
});

test('change password rejects mismatched passwords without calling the client', async ({
  page,
}) => {
  let requestCount = 0;
  page.on('request', request => {
    if (request.url().endsWith(AUTHENTICATION_PATHS.createPassword)) {
      requestCount += 1;
    }
  });
  await gotoJourney(page, authJourney('changePassword'));

  await page.locator('#new-password').fill('first password');
  await page.locator('#confirm-password').fill('second password');
  await page.getByRole('button', { name: 'Save new password' }).click();

  await expect(
    page.getByText(
      'Passwords entered do not match, please check and try again.',
    ),
  ).toBeVisible();
  expect(requestCount).toBe(0);
});

test('change password submits through the client and returns to sign-in', async ({
  page,
}) => {
  await gotoJourney(page, authJourney('changePassword'));
  const request = page.waitForRequest(
    candidate =>
      candidate.method() === 'POST' &&
      candidate.url().endsWith(AUTHENTICATION_PATHS.createPassword),
  );

  await page.locator('#new-password').fill('new password');
  await page.locator('#confirm-password').fill('new password');
  await page.getByRole('button', { name: 'Save new password' }).click();

  await request;
  await expect(page).toHaveURL(/\/auth\/signin$/);
});
