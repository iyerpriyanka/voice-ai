import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import test from 'node:test';

import { checkUiDocs, UI_GUIDES } from './check-ui-docs.mjs';

const createFixture = context => {
  const root = mkdtempSync(resolve(tmpdir(), 'ui-docs-'));
  context.after(() => rmSync(root, { recursive: true, force: true }));
  writeFileSync(
    resolve(root, 'package.json'),
    `${JSON.stringify({ scripts: { test: 'jest', build: 'build' } })}\n`,
  );
  mkdirSync(resolve(root, 'e2e'));
  UI_GUIDES.forEach(guide =>
    writeFileSync(resolve(root, guide), '`yarn test` and `e2e/`\n'),
  );
  return root;
};

test('accepts documented scripts and paths that exist', context => {
  const root = createFixture(context);

  assert.deepEqual(checkUiDocs(root), []);
});

test('reports missing scripts and paths', context => {
  const root = createFixture(context);
  writeFileSync(
    resolve(root, 'TESTING.md'),
    '`yarn missing-script` uses `scripts/missing-file.mjs`\n',
  );

  assert.deepEqual(checkUiDocs(root), [
    'TESTING.md: referenced path does not exist: scripts/missing-file.mjs',
    'TESTING.md: yarn script does not exist: missing-script',
  ]);
});
