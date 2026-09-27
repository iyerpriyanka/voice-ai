#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const verificationSteps = ({ includeE2E = false } = {}) => {
  const steps = [
    ['tooling-tests', ['yarn', 'test:tooling']],
    ['docs', ['yarn', 'check:docs']],
    ['theme-contract', ['yarn', 'check:theme-contract']],
    ['public-assets', ['yarn', 'check:public-assets']],
    ['dependencies', ['yarn', 'check:dependencies']],
    ['lint', ['yarn', 'lint']],
    ['css-lint', ['yarn', 'lint:css']],
    ['typecheck', ['yarn', 'checkTs']],
    ['unit', ['yarn', 'test', '--watchAll=false', '--runInBand', '--coverage']],
    ['build', ['yarn', 'build']],
    ['bundle-size', ['yarn', 'check:bundle-size']],
    ['route-coverage', ['yarn', 'check:e2e-routes']],
  ];

  if (includeE2E) steps.push(['e2e', ['yarn', 'e2e']]);
  return steps;
};

const outputTail = output =>
  String(output || '')
    .trim()
    .split('\n')
    .slice(-60)
    .join('\n');

export const runVerification = ({
  includeE2E = false,
  root = process.cwd(),
  execute = spawnSync,
  write = line => console.log(line),
} = {}) => {
  const results = [];

  for (const [name, command] of verificationSteps({ includeE2E })) {
    write(`>> ${name}`);
    const startedAt = Date.now();
    const result = execute(command[0], command.slice(1), {
      cwd: root,
      encoding: 'utf8',
      env: process.env,
      maxBuffer: 100 * 1024 * 1024,
    });
    const exitCode = result.status ?? 1;
    const durationSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);
    results.push({ name, exitCode });
    write(`${exitCode === 0 ? 'ok' : 'FAILED'} ${name} (${durationSeconds}s)`);

    if (exitCode !== 0) {
      const tail = outputTail(`${result.stdout || ''}${result.stderr || ''}`);
      if (tail) write(tail);
      if (result.error) write(result.error.message);
    }
  }

  const failed = results.filter(result => result.exitCode !== 0);
  write(
    failed.length === 0
      ? `UI verification passed (${results.length} stages).`
      : `UI verification failed: ${failed.map(result => result.name).join(', ')}.`,
  );
  return { results, failed, exitCode: failed.length === 0 ? 0 : 1 };
};

const isMain =
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (isMain) {
  const allowedArguments = new Set(['--e2e']);
  const unknown = process.argv
    .slice(2)
    .filter(arg => !allowedArguments.has(arg));
  if (unknown.length > 0) {
    console.error(`Unknown option: ${unknown[0]}`);
    process.exitCode = 2;
  } else {
    const result = runVerification({
      includeE2E: process.argv.includes('--e2e'),
    });
    process.exitCode = result.exitCode;
  }
}
