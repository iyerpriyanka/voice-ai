const shellKnownViolations = [];

const authenticatedShellJourneys = [
  'dashboard.home',
  'deployment.assistant',
  'deployment.endpoint',
  'integration.models',
  'integration.personalCredential',
  'logs.request',
  'logs.tool',
  'logs.conversation',
  'logs.traces',
  'organization.overview',
  'organization.users',
  'organization.projects',
  'organization.security',
  'account.settings',
];

const journeyKnownViolations = {
  ...Object.fromEntries(
    authenticatedShellJourneys.map(journeyId => [
      journeyId,
      shellKnownViolations,
    ]),
  ),
  'static.privacy': [
    {
      id: 'color-contrast',
      target: /mailto:prashant@rapida\.ai/,
      maxNodes: 2,
      reason:
        'Privacy page mailto links use the current low-contrast link color.',
    },
  ],
  'static.terms': [
    {
      id: 'color-contrast',
      target: '.text-blue-500',
      maxNodes: 1,
      reason: 'Terms links use the current low-contrast link color.',
    },
  ],
  'dashboard.home': [
    ...shellKnownViolations,
  ],
  'deployment.endpoint': [
    ...shellKnownViolations,
    {
      id: 'color-contrast',
      target: '.dark\\:text-gray-400',
      maxNodes: 1,
      reason:
        'Endpoint helper text uses the current low-contrast secondary color.',
    },
  ],
  'integration.models': [
    ...shellKnownViolations,
    {
      id: 'color-contrast',
      target: '.text-gray-500',
      maxNodes: 1,
      reason:
        'Provider count text uses the current low-contrast secondary color.',
    },
  ],
  'account.settings': [
    ...shellKnownViolations,
    {
      id: 'color-contrast',
      target: '.font-medium.text-sm',
      maxNodes: 1,
      reason:
        'Account sidebar labels use the current low-contrast secondary color.',
    },
    {
      id: 'color-contrast',
      target: 'p',
      maxNodes: 1,
      reason:
        'Account helper copy uses the current low-contrast paragraph color.',
    },
  ],
  'organization.users': [
    ...shellKnownViolations,
    {
      id: 'aria-hidden-focus',
      target: '.cds--batch-actions',
      maxNodes: 1,
      reason: 'The Carbon data table keeps a focusable hidden batch toolbar.',
    },
  ],
  'organization.projects': [
    ...shellKnownViolations,
    {
      id: 'aria-hidden-focus',
      target: '.cds--batch-actions',
      maxNodes: 1,
      reason: 'The Carbon data table keeps a focusable hidden batch toolbar.',
    },
  ],
  'organization.security': [
    ...shellKnownViolations,
    {
      id: 'color-contrast',
      target: '.cds--link--sm',
      maxNodes: 1,
      reason: 'The Carbon small link has insufficient contrast in dark mode.',
    },
  ],
};

function targetMatches(expected, target) {
  const value = target.join(' ');
  if (expected instanceof RegExp) return expected.test(value);
  return value === expected;
}

function evaluateA11yViolations(journeyId, violations) {
  const candidates = journeyKnownViolations[journeyId] || [];
  const nodeCounts = candidates.map(() => 0);
  const unapprovedViolations = [];

  for (const violation of violations) {
    for (const node of violation.nodes) {
      const candidateIndex = candidates.findIndex(
        candidate =>
          candidate.id === violation.id &&
          targetMatches(candidate.target, node.target),
      );

      if (candidateIndex === -1) {
        unapprovedViolations.push({
          id: violation.id,
          impact: violation.impact,
          help: violation.help,
          target: node.target,
        });
        continue;
      }

      nodeCounts[candidateIndex] += 1;
    }
  }

  const overages = candidates.flatMap((candidate, index) => {
    const actualNodes = nodeCounts[index];
    if (actualNodes <= candidate.maxNodes) return [];

    return [
      {
        id: candidate.id,
        target: String(candidate.target),
        maxNodes: candidate.maxNodes,
        actualNodes,
        reason: candidate.reason,
      },
    ];
  });

  return { unapprovedViolations, overages };
}

module.exports = {
  evaluateA11yViolations,
  shellKnownViolations,
  journeyKnownViolations,
};
