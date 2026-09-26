const fs = require('fs');
const path = require('path');
const {
  routeRoots,
  routeJourneys,
  sourceRouteInventory,
} = require('../e2e/route-manifest');

const appRouteFile = path.join(__dirname, '..', 'src', 'app', 'index.tsx');
const routeDir = path.join(__dirname, '..', 'src', 'app', 'routes');
const devConfigFile = path.join(
  __dirname,
  '..',
  'src',
  'configs',
  'config.development.json',
);

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readAppRouteRoots() {
  const source = fs.readFileSync(appRouteFile, 'utf8');
  const roots = new Set();
  const routePathPattern =
    /<Route\b[^>]*\bpath=(?:\{)?["'`]([^"'`{}]+)["'`](?:\})?/g;
  let match;

  while ((match = routePathPattern.exec(source))) {
    const value = match[1];
    if (value === '/' || value === '*') continue;
    const root = value.replace(/\/\*$/, '');
    if (root.startsWith('/')) roots.add(root);
  }

  return [...roots].sort();
}

function routeSourceFiles() {
  return fs
    .readdirSync(routeDir)
    .filter(fileName => fileName.endsWith('.tsx'))
    .filter(fileName => fileName !== 'index.tsx')
    .sort();
}

function increment(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function routeKey(fileName, routePath) {
  return `${fileName}:${routePath}`;
}

function readRouteSourceEntries() {
  const entries = new Map();
  const routePathPattern =
    /<Route\b[^>]*\bpath=(?:\{)?["'`]([^"'`{}]*)["'`](?:\})?/g;

  for (const fileName of routeSourceFiles()) {
    const source = fs.readFileSync(path.join(routeDir, fileName), 'utf8');
    let match;

    while ((match = routePathPattern.exec(source))) {
      const routePath = match[1];
      if (routePath === '*') continue;
      increment(entries, routeKey(fileName, routePath));
    }
  }

  return entries;
}

function getConfigValue(config, featurePath) {
  return featurePath
    .split('.')
    .reduce((current, key) => (current ? current[key] : undefined), config);
}

function inventoryEntries() {
  const entries = [];

  for (const [fileName, routes] of Object.entries(sourceRouteInventory)) {
    for (const route of routes) {
      entries.push({ fileName, ...route });
    }
  }

  return entries;
}

function checkRouteCoverage() {
  const appRoots = readAppRouteRoots();
  const config = readJSON(devConfigFile);
  const manifestRoots = routeRoots.map(route => route.root).sort();
  const journeyIds = new Set(routeJourneys.map(journey => journey.id));
  const journeyById = new Map(
    routeJourneys.map(journey => [journey.id, journey]),
  );

  const missingRoots = appRoots.filter(root => !manifestRoots.includes(root));
  const unknownRoots = manifestRoots.filter(root => !appRoots.includes(root));
  const duplicateRoots = manifestRoots.filter(
    (root, index) => manifestRoots.indexOf(root) !== index,
  );
  const duplicateJourneys = routeJourneys
    .map(journey => journey.id)
    .filter((id, index, ids) => ids.indexOf(id) !== index);
  const invalidDisabledRoots = routeRoots
    .filter(route => route.disabledFeature)
    .filter(route => getConfigValue(config, route.disabledFeature) !== false)
    .map(route => route.root);
  const rootsWithoutCoverageDecision = routeRoots
    .filter(
      route =>
        !route.journey && !route.disabledFeature && !route.deferredReason,
    )
    .map(route => route.root);
  const unmappedEnabledRoots = routeRoots
    .filter(route => !route.disabledFeature && !route.deferredReason)
    .filter(route => !route.journey || !journeyIds.has(route.journey))
    .map(route => route.root);
  const misroutedRootJourneys = routeRoots
    .filter(route => route.journey && journeyIds.has(route.journey))
    .filter(route => {
      const journey = journeyById.get(route.journey);
      return (
        journey.path !== route.root &&
        !journey.path.startsWith(`${route.root}/`)
      );
    })
    .map(route => `${route.root} -> ${route.journey}`);
  const journeysWithoutAssertions = routeJourneys
    .filter(
      journey =>
        !journey.path ||
        !journey.expectText ||
        !Array.isArray(journey.checks) ||
        journey.checks.length === 0,
    )
    .map(journey => journey.id);
  const discoveredRouteSources = readRouteSourceEntries();
  const inventory = inventoryEntries();
  const inventorySourceKeys = new Map(
    inventory.map(route => [
      routeKey(route.fileName, route.path),
      route.count || 1,
    ]),
  );
  const missingSourceRoutes = [...discoveredRouteSources.keys()]
    .filter(key => !inventorySourceKeys.has(key))
    .sort();
  const unknownSourceRoutes = [...inventorySourceKeys.keys()]
    .filter(key => !discoveredRouteSources.has(key))
    .sort();
  const sourceRouteCountMismatches = [...discoveredRouteSources.entries()]
    .filter(([key, count]) => inventorySourceKeys.get(key) !== count)
    .map(
      ([key, count]) =>
        `${key} expected ${inventorySourceKeys.get(key) || 0} found ${count}`,
    );
  const sourceRoutesWithoutDecision = inventory
    .filter(
      route =>
        !route.journey && !route.disabledFeature && !route.deferredReason,
    )
    .map(route => routeKey(route.fileName, route.path));
  const sourceRoutesWithUnknownJourney = inventory
    .filter(route => route.journey && !journeyIds.has(route.journey))
    .map(
      route => `${routeKey(route.fileName, route.path)} -> ${route.journey}`,
    );
  const sourceRoutesWithInvalidDisabledFeature = inventory
    .filter(route => route.disabledFeature)
    .filter(route => getConfigValue(config, route.disabledFeature) !== false)
    .map(route => routeKey(route.fileName, route.path));

  return {
    appRoots,
    manifestRoots,
    missingRoots,
    unknownRoots,
    duplicateRoots,
    duplicateJourneys,
    invalidDisabledRoots,
    rootsWithoutCoverageDecision,
    unmappedEnabledRoots,
    misroutedRootJourneys,
    journeysWithoutAssertions,
    missingSourceRoutes,
    unknownSourceRoutes,
    sourceRouteCountMismatches,
    sourceRoutesWithoutDecision,
    sourceRoutesWithUnknownJourney,
    sourceRoutesWithInvalidDisabledFeature,
  };
}

if (require.main === module) {
  const result = checkRouteCoverage();
  const hasFailure =
    result.missingRoots.length > 0 ||
    result.unknownRoots.length > 0 ||
    result.duplicateRoots.length > 0 ||
    result.duplicateJourneys.length > 0 ||
    result.invalidDisabledRoots.length > 0 ||
    result.rootsWithoutCoverageDecision.length > 0 ||
    result.unmappedEnabledRoots.length > 0 ||
    result.misroutedRootJourneys.length > 0 ||
    result.journeysWithoutAssertions.length > 0 ||
    result.missingSourceRoutes.length > 0 ||
    result.unknownSourceRoutes.length > 0 ||
    result.sourceRouteCountMismatches.length > 0 ||
    result.sourceRoutesWithoutDecision.length > 0 ||
    result.sourceRoutesWithUnknownJourney.length > 0 ||
    result.sourceRoutesWithInvalidDisabledFeature.length > 0;

  console.log(JSON.stringify(result, null, 2));
  process.exit(hasFailure ? 1 : 0);
}

module.exports = {
  checkRouteCoverage,
  readAppRouteRoots,
};
