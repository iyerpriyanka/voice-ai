import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { evaluateA11yViolations } = require('../e2e/a11y-baseline');

const violation = target => ({
  id: 'color-contrast',
  impact: 'serious',
  help: 'Elements must meet minimum color contrast ratio thresholds',
  nodes: [{ target: [target] }],
});

test('accepts accessibility debt within its journey and node limit', () => {
  const result = evaluateA11yViolations('static.terms', [
    violation('.text-blue-500'),
  ]);

  assert.deepEqual(result, { unapprovedViolations: [], overages: [] });
});

test('reports new findings and accessibility debt above its node limit', () => {
  const result = evaluateA11yViolations('static.terms', [
    {
      ...violation('.text-blue-500'),
      nodes: [
        { target: ['.text-blue-500'] },
        { target: ['.text-blue-500'] },
      ],
    },
    violation('#new-low-contrast-text'),
  ]);

  assert.equal(result.unapprovedViolations.length, 1);
  assert.deepEqual(result.overages, [
    {
      id: 'color-contrast',
      target: '.text-blue-500',
      maxNodes: 1,
      actualNodes: 2,
      reason: 'Terms links use the current low-contrast link color.',
    },
  ]);
});
