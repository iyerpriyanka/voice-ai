const { test: base, expect } = require('@playwright/test');
const { evaluateA11yViolations } = require('./a11y-baseline');
const { installGrpcWebPreflightMock } = require('./mocks/grpc-web');
const {
  ASSISTANT_LIST_PATH,
  installAssistantClientMock,
} = require('./mocks/clients/assistant');
const {
  AUTHENTICATION_PATHS,
  installAuthenticationClientMock,
  mockAuthenticationOperation,
} = require('./mocks/clients/authentication');
const {
  ENDPOINT_LIST_PATH,
  installEndpointClientMock,
} = require('./mocks/clients/endpoint');
const {
  ACTIVITY_LIST_PATHS,
  installActivityClientMock,
} = require('./mocks/clients/activity');
const {
  CREDENTIAL_LIST_PATH,
  installCredentialClientMock,
} = require('./mocks/clients/credential');
const {
  ORGANIZATION_PATH,
  WORKSPACE_LIST_PATHS,
  installWorkspaceClientMock,
} = require('./mocks/clients/workspace');

const COLOR_MODES = ['light', 'dark'];

const dashboardDesign = {
  welcome: {
    prefix: 'Welcome back',
    fallbackName: 'there',
  },
  hero: {
    title: 'Operate your AI assistants',
    description:
      'Design, deploy, and observe realtime assistants from one testable workspace.',
    actions: [
      {
        label: 'Create assistant',
        kind: 'primary',
        intent: 'createAssistant',
      },
      {
        label: 'View deployments',
        kind: 'secondary',
        href: '/deployment/assistant',
      },
    ],
  },
  sections: [
    {
      title: 'Primary workflows',
      layout: 'feature-grid',
      cards: [
        {
          title: 'Assistant deployments',
          description: 'Review assistants, versions, and deployment channels.',
          action: 'Open assistants',
          href: '/deployment/assistant',
        },
        {
          title: 'Hosted endpoints',
          description: 'Track endpoint routing and release readiness.',
          action: 'Open endpoints',
          href: '/deployment/endpoint',
        },
        {
          title: 'Observability',
          description: 'Inspect activity logs and traces.',
          action: 'Open logs',
          href: '/logs',
        },
      ],
    },
    {
      title: 'Resources',
      layout: 'resource-grid',
      cards: [
        {
          title: 'Providers',
          description: 'Manage model and voice provider setup.',
          action: 'Open integrations',
          href: '/integration/models',
        },
        {
          title: 'Organization',
          description: 'Manage workspace profile and access.',
          action: 'Open organization',
          href: '/organization',
        },
        {
          title: 'Account',
          description: 'Review account settings.',
          action: 'Open account',
          href: '/account',
        },
      ],
    },
  ],
  news: {
    title: 'Product updates',
    readMoreHref: 'https://doc.rapida.ai',
    items: [
      {
        date: '2026-09-24',
        title: 'E2E baseline',
        description: 'Deterministic dashboard content for browser tests.',
      },
    ],
  },
};

const authState = {
  state: {
    currentUser: {
      id: '101',
      name: 'E2E User',
      email: 'e2e@example.test',
    },
    token: {
      token: 'token-e2e',
    },
    organizationRole: {
      id: '201',
      organizationid: '202',
      role: 'admin',
    },
    projectRoles: [
      {
        id: '301',
        projectid: '302',
        role: 'admin',
      },
    ],
    currentProjectRole: {
      id: '301',
      projectid: '302',
      role: 'admin',
    },
    featurePermissions: [],
  },
  version: 1,
};

async function installBrowserFixtures(page) {
  await page.route(
    'https://cdn-01.rapida.ai/web/rapida-dashboard-v1.json',
    route =>
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(dashboardDesign),
      }),
  );

  await page.route('https://www.googletagmanager.com/**', route =>
    route.abort('blockedbyclient'),
  );
  await page.route('http://localhost:8080/**', route => route.abort('failed'));
  await page.route('http://127.0.0.1:8080/**', route => route.abort('failed'));
  await installAssistantClientMock(page);
  await installAuthenticationClientMock(page);
  await installEndpointClientMock(page);
  await installActivityClientMock(page);
  await installCredentialClientMock(page);
  await installWorkspaceClientMock(page);
  await installGrpcWebPreflightMock(page);
}

async function gotoJourney(page, journey) {
  if (journey.auth) {
    await page.addInitScript(state => {
      window.localStorage.setItem('rpd::__user', JSON.stringify(state));
      window.localStorage.setItem('rapida-sidebar-open', 'true');
    }, authState);
  }

  await page.goto(journey.path);
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('body')).toContainText(journey.expectText);
  if (journey.readyText) {
    await expect(page.locator('body')).toContainText(journey.readyText);
  }
  await expect(page.locator('body')).not.toContainText(
    "Sorry we couldn't find this page.",
  );
}

async function setColorMode(page, colorMode) {
  await page.addInitScript(mode => {
    window.localStorage.setItem('ui-theme-mode', mode);
  }, colorMode);
}

async function checkA11y(page, journey) {
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const results = await page.evaluate(async () =>
    window.axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      },
    }),
  );
  const violations = results.violations.filter(violation =>
    ['critical', 'serious'].includes(violation.impact),
  );
  const assessment = evaluateA11yViolations(journey.id, violations);

  expect(assessment).toEqual({ unapprovedViolations: [], overages: [] });
}

function toScreenshotSlug(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-z0-9]+/gi, '-')
    .toLowerCase();
}

function screenshotFileParts(journey, colorMode) {
  const [routeArea, ...journeyName] = journey.id.split('.');
  return [
    toScreenshotSlug(routeArea),
    `${toScreenshotSlug(journeyName.join('-'))}-${colorMode}.png`,
  ];
}

function screenshotBaselinePath(journey, colorMode) {
  return screenshotFileParts(journey, colorMode);
}

const test = base.extend({
  page: async ({ page }, use) => {
    await installBrowserFixtures(page);
    await use(page);
  },
});

module.exports = {
  test,
  expect,
  COLOR_MODES,
  ASSISTANT_LIST_PATH,
  ACTIVITY_LIST_PATHS,
  AUTHENTICATION_PATHS,
  CREDENTIAL_LIST_PATH,
  ENDPOINT_LIST_PATH,
  ORGANIZATION_PATH,
  WORKSPACE_LIST_PATHS,
  checkA11y,
  gotoJourney,
  mockAuthenticationOperation,
  setColorMode,
  screenshotBaselinePath,
};
