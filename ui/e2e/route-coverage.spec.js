const { test, expect } = require('./fixtures');
const {
  checkRouteCoverage,
} = require('../scripts/check-e2e-route-coverage.cjs');

test('route manifest covers enabled app route roots', () => {
  const result = checkRouteCoverage();

  expect(result.missingRoots).toEqual([]);
  expect(result.unknownRoots).toEqual([]);
  expect(result.duplicateRoots).toEqual([]);
  expect(result.duplicateJourneys).toEqual([]);
  expect(result.invalidDisabledRoots).toEqual([]);
  expect(result.rootsWithoutCoverageDecision).toEqual([]);
  expect(result.unmappedEnabledRoots).toEqual([]);
  expect(result.misroutedRootJourneys).toEqual([]);
  expect(result.journeysWithoutAssertions).toEqual([]);
  expect(result.missingSourceRoutes).toEqual([]);
  expect(result.unknownSourceRoutes).toEqual([]);
  expect(result.sourceRouteCountMismatches).toEqual([]);
  expect(result.sourceRoutesWithoutDecision).toEqual([]);
  expect(result.sourceRoutesWithUnknownJourney).toEqual([]);
  expect(result.sourceRoutesWithInvalidDisabledFeature).toEqual([]);
});
