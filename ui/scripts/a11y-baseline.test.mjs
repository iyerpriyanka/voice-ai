import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { evaluateA11yViolations } = require('../e2e/a11y-baseline');

const violation = target => ({
  id: 'button-name',
  impact: 'critical',
  help: 'Buttons must have discernible text',
  nodes: [{ target: [target] }],
});

test('accepts accessibility debt within its journey and node limit', () => {
  const result = evaluateA11yViolations('dashboard.home', [
    violation('#downshift-1-toggle-button'),
  ]);

  assert.deepEqual(result, { unapprovedViolations: [], overages: [] });
});

test('reports new findings and accessibility debt above its node limit', () => {
  const result = evaluateA11yViolations('dashboard.home', [
    {
      ...violation('#downshift-1-toggle-button'),
      nodes: [
        { target: ['#downshift-1-toggle-button'] },
        { target: ['#downshift-2-toggle-button'] },
      ],
    },
    violation('#new-unnamed-button'),
  ]);

  assert.equal(result.unapprovedViolations.length, 1);
  assert.deepEqual(result.overages, [
    {
      id: 'button-name',
      target: '/#downshift-.*-toggle-button/',
      maxNodes: 1,
      actualNodes: 2,
      reason: 'The shell theme selector renders an unnamed Downshift toggle.',
    },
  ]);
});
