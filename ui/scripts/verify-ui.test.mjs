import assert from 'node:assert/strict';
import test from 'node:test';

import { runVerification, verificationSteps } from './verify-ui.mjs';

test('runs every stage after a failure and returns a failing summary', () => {
  const invoked = [];
  const output = [];
  const steps = verificationSteps();
  const result = runVerification({
    execute: (command, args) => {
      invoked.push([command, ...args]);
      return {
        status: args[0] === 'lint' ? 1 : 0,
        stdout: args[0] === 'lint' ? 'lint failed\n' : '',
        stderr: '',
      };
    },
    write: line => output.push(line),
  });

  assert.equal(invoked.length, steps.length);
  assert.equal(result.exitCode, 1);
  assert.deepEqual(result.failed, [{ name: 'lint', exitCode: 1 }]);
  assert.match(output.at(-1), /lint/);
});

test('adds browser tests only to the full verification run', () => {
  assert.equal(
    verificationSteps().some(([name]) => name === 'e2e'),
    false,
  );
  assert.equal(verificationSteps({ includeE2E: true }).at(-1)[0], 'e2e');
});
