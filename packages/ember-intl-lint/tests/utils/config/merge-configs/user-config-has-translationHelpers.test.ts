import { assert, test } from '@codemod-utils/tests';

import {
  getDefaultConfig,
  mergeConfigs,
} from '../../../../src/utils/config/index.js';

test('utils | config | merge-configs > user config has translationHelpers', function () {
  const userConfig = {
    translationHelpers: [
      { export: 't', kind: 't' as const, source: 'my-app/utils/intl' },
    ],
  };

  const config = mergeConfigs(getDefaultConfig(), userConfig);

  assert.deepStrictEqual(config.translationHelpers, [
    { export: 't', kind: 't', source: 'my-app/utils/intl' },
  ]);
});
