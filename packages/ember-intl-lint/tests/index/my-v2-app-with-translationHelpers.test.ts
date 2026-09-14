import { assert, assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { runCodemod } from '../../src/index.js';
import {
  inputProject,
  outputProject,
} from '../fixtures/my-v2-app-with-translationHelpers/index.js';
import { codemodOptions } from '../helpers/shared-test-setups/my-v2-app-with-translationHelpers.js';

test('index > my-v2-app-with-translationHelpers', async function () {
  loadFixture(inputProject, codemodOptions);

  const lintResults = await runCodemod(codemodOptions);

  assert.deepStrictEqual(lintResults, {
    'no-inconsistent-messages': [],
    'no-missing-keys': ['hello.message'],
    'no-unused-keys': [],
  });

  assertFixture(outputProject, codemodOptions);
});
