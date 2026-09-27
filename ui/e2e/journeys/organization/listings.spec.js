const {
  expect,
  gotoJourney,
  test,
  WORKSPACE_LIST_PATHS,
} = require('../../fixtures');
const { routeJourneys } = require('../../route-manifest');
const {
  fulfillGrpcWeb,
  protobufBytes,
  protobufString,
} = require('../../mocks/grpc-web');

const journey = id =>
  routeJourneys.find(routeJourney => routeJourney.id === `organization.${id}`);

const userListPath = WORKSPACE_LIST_PATHS.find(path =>
  path.endsWith('/web_api.AuthenticationService/GetAllUser'),
);
const projectListPath = WORKSPACE_LIST_PATHS.find(path =>
  path.endsWith('/web_api.ProjectService/GetAllProject'),
);

test('organization listings show actionable empty states', async ({ page }) => {
  await gotoJourney(page, journey('users'));
  await expect(
    page.getByRole('heading', { name: 'No organization users' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Invite user', exact: true }),
  ).toHaveCount(2);

  await gotoJourney(page, journey('projects'));
  await expect(
    page.getByRole('heading', { name: 'No projects' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Create new project', exact: true }),
  ).toHaveCount(2);
});

test('project listing shows an application response error', async ({
  page,
}) => {
  const error = protobufString(3, 'Unable to load projects.');

  await gotoJourney(page, journey('projects'));

  await page.route(projectListPath, route => {
    if (route.request().method() !== 'POST') return route.fallback();
    return fulfillGrpcWeb(route, protobufBytes(4, error));
  });

  await page.getByRole('button', { name: 'Refresh' }).click();

  await expect(page.getByText('Unable to load projects.')).toBeVisible();
});

test('user listing shows a transport request error', async ({ page }) => {
  await gotoJourney(page, journey('users'));

  await page.route(userListPath, route => {
    if (route.request().method() !== 'POST') return route.fallback();
    return route.abort('failed');
  });

  await page.getByRole('button', { name: 'Refresh' }).click();

  await expect(
    page.getByText(
      'Unable to get all the users for your organization, please try again in sometime.',
    ),
  ).toBeVisible();
});
