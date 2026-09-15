import type { TestContext } from '@ember/test-helpers';
import { IntlState } from 'ember-intl';
import IntlService from 'ember-intl/services/intl';
import { setupIntl } from 'ember-intl/test-support';
// Not the app's `setupTest`: it looks up `service:intl` before each test, and
// a service can't be registered after it has been looked up.
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

// A state that lives in a module outlives each test's owner.
const state = new IntlState();

module('Unit | Service | intl > from, with setupIntl', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function (this: TestContext) {
    this.owner.register('service:intl', IntlService.from(state));
  });

  setupIntl(hooks, 'en-us', { greeting: 'Hello' });

  hooks.afterEach(function () {
    state.reset();
  });

  test('setupIntl writes to the given state', function (assert) {
    assert.strictEqual(state.primaryLocale, 'en-us');
    assert.strictEqual(state.t('greeting'), 'Hello');
    assert.strictEqual(state.t('missing'), 't:missing');

    state.addTranslations('en-us', { added: 'Added in this test' });
  });

  test('reset after each test removes what an earlier test added', function (assert) {
    assert.false(state.exists('added'));
    assert.strictEqual(state.t('greeting'), 'Hello');
  });
});
