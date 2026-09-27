import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { checkJourneyDecisions } = require('./check-e2e-route-coverage.cjs');

test('accepts a journey with all route check decisions', () => {
  const result = checkJourneyDecisions([
    {
      id: 'dashboard.home',
      checks: ['smoke', 'a11y'],
      screenshotDeferredReason: 'The layout is covered by another journey.',
    },
  ]);

  assert.deepEqual(result, {
    journeysWithoutSmoke: [],
    journeysWithoutA11yDecision: [],
    journeysWithoutScreenshotDecision: [],
    journeysWithUnknownChecks: [],
    journeysWithConflictingDecisions: [],
  });
});

test('reports missing, unknown, and conflicting route check decisions', () => {
  const result = checkJourneyDecisions([
    {
      id: 'dashboard.home',
      checks: ['visual'],
    },
    {
      id: 'account.settings',
      checks: ['smoke', 'a11y', 'screenshot'],
      a11yDeferredReason: 'Stale decision.',
      screenshotDeferredReason: 'Stale decision.',
    },
  ]);

  assert.deepEqual(result, {
    journeysWithoutSmoke: ['dashboard.home'],
    journeysWithoutA11yDecision: ['dashboard.home'],
    journeysWithoutScreenshotDecision: ['dashboard.home'],
    journeysWithUnknownChecks: ['dashboard.home:visual'],
    journeysWithConflictingDecisions: [
      'account.settings:a11y',
      'account.settings:screenshot',
    ],
  });
});
