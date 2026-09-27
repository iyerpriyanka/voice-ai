#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const UI_GUIDES = ['AGENTS.md', 'DEVELOPMENT.md', 'TESTING.md'];

const documentedScriptPattern = /\byarn(?:\s+run)?\s+([a-zA-Z0-9:_-]+)/g;
const documentedPathPattern =
  /`((?:e2e|scripts|src|\.storybook)\/[a-zA-Z0-9_./*-]+)`/g;
const yarnCommandsWithoutPackageScripts = new Set(['install']);

const readPackageScripts = root => {
  const packagePath = resolve(root, 'package.json');
  if (!existsSync(packagePath)) {
    return {
      scripts: new Set(),
      errors: ['package.json: file does not exist'],
    };
  }

  try {
    const packageJSON = JSON.parse(readFileSync(packagePath, 'utf8'));
    return {
      scripts: new Set(Object.keys(packageJSON.scripts || {})),
      errors: [],
    };
  } catch (error) {
    return {
      scripts: new Set(),
      errors: [`package.json: could not be read: ${error.message}`],
    };
  }
};

export const checkUiDocs = (root = process.cwd()) => {
  const errors = [];
  const { scripts, errors: packageErrors } = readPackageScripts(root);
  errors.push(...packageErrors);

  for (const guide of UI_GUIDES) {
    const guidePath = resolve(root, guide);
    if (!existsSync(guidePath)) {
      errors.push(`${guide}: file does not exist`);
      continue;
    }

    const source = readFileSync(guidePath, 'utf8');
    for (const match of source.matchAll(documentedScriptPattern)) {
      const script = match[1];
      if (
        !yarnCommandsWithoutPackageScripts.has(script) &&
        !scripts.has(script)
      ) {
        errors.push(`${guide}: yarn script does not exist: ${script}`);
      }
    }

    for (const match of source.matchAll(documentedPathPattern)) {
      const documentedPath = match[1];
      if (documentedPath.includes('*')) continue;
      if (!existsSync(resolve(root, documentedPath))) {
        errors.push(
          `${guide}: referenced path does not exist: ${documentedPath}`,
        );
      }
    }
  }

  return [...new Set(errors)].sort();
};

const isMain =
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (isMain) {
  const errors = checkUiDocs(process.argv[2] || process.cwd());
  if (errors.length > 0) {
    console.error('UI documentation check failed:');
    errors.forEach(error => console.error(`- ${error}`));
    process.exitCode = 1;
  } else {
    console.log('UI documentation check passed.');
  }
}
