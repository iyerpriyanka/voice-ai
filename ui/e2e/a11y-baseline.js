const shellKnownViolations = [
  {
    id: 'button-name',
    target: /#downshift-.*-toggle-button/,
    reason: 'The shell theme selector renders an unnamed Downshift toggle.',
  },
  {
    id: 'list',
    target: 'nav > ul',
    reason: 'The sidebar navigation currently renders section labels in a ul.',
  },
];

const journeyKnownViolations = {
  'static.privacy': [
    {
      id: 'color-contrast',
      target: /mailto:prashant@rapida\.ai/,
      reason:
        'Privacy page mailto links use the current low-contrast link color.',
    },
  ],
  'deployment.assistant': [
    ...shellKnownViolations,
    {
      id: 'color-contrast',
      target: '.tabular-nums',
      reason:
        'Assistant count text uses the current low-contrast secondary color.',
    },
  ],
  'integration.models': [
    ...shellKnownViolations,
    {
      id: 'color-contrast',
      target: '.text-gray-500',
      reason:
        'Provider count text uses the current low-contrast secondary color.',
    },
  ],
  'dashboard.home': shellKnownViolations,
  'logs.request': shellKnownViolations,
  'organization.overview': shellKnownViolations,
  'account.settings': [
    ...shellKnownViolations,
    {
      id: 'color-contrast',
      target: '.font-medium.text-sm',
      reason:
        'Account sidebar labels use the current low-contrast secondary color.',
    },
    {
      id: 'color-contrast',
      target: 'p',
      reason:
        'Account helper copy uses the current low-contrast paragraph color.',
    },
  ],
};

function targetMatches(expected, target) {
  const value = target.join(' ');
  if (expected instanceof RegExp) return expected.test(value);
  return value === expected;
}

function isKnownA11yViolation(journeyId, violation) {
  const candidates = journeyKnownViolations[journeyId] || [];

  return violation.nodes.every(node =>
    candidates.some(
      candidate =>
        candidate.id === violation.id &&
        targetMatches(candidate.target, node.target),
    ),
  );
}

module.exports = {
  isKnownA11yViolation,
  shellKnownViolations,
  journeyKnownViolations,
};
