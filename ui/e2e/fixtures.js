const path = require('path');
const { test: base, expect } = require('@playwright/test');
const { isKnownA11yViolation } = require('./a11y-baseline');

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
      id: 'user-e2e',
      name: 'E2E User',
      email: 'e2e@example.test',
    },
    token: {
      token: 'token-e2e',
    },
    organizationRole: {
      id: 'organization-role-e2e',
      organizationid: 'organization-e2e',
      role: 'admin',
    },
    projectRoles: [
      {
        id: 'project-role-e2e',
        projectid: 'project-e2e',
        role: 'admin',
      },
    ],
    currentProjectRole: {
      id: 'project-role-e2e',
      projectid: 'project-e2e',
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
  await expect(page.locator('body')).not.toContainText(
    "Sorry we couldn't find this page.",
  );
}

async function checkA11y(page, journey) {
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const results = await page.evaluate(async () =>
    window.axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    }),
  );
  const violations = results.violations
    .filter(violation => ['critical', 'serious'].includes(violation.impact))
    .filter(violation => !isKnownA11yViolation(journey.id, violation));

  expect(
    violations.map(violation => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.map(node => node.target),
    })),
  ).toEqual([]);
}

function screenshotPath(journey) {
  const fileName = journey.id.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  return path.join('e2e-artifacts', 'screenshots', `${fileName}.png`);
}

function screenshotName(journey) {
  return `${journey.id.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`;
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
  checkA11y,
  gotoJourney,
  screenshotName,
  screenshotPath,
};
