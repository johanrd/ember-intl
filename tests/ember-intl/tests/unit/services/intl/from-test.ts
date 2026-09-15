import { settled, type TestContext } from '@ember/test-helpers';
import { IntlState } from 'ember-intl';
import IntlService from 'ember-intl/services/intl';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Service | intl > from', function (hooks) {
  setupTest(hooks);

  test('the service reads and writes the given state', function (this: TestContext, assert) {
    const state = new IntlState();

    state.setLocale('en-us');
    state.addTranslations('en-us', { greeting: 'Hello' });

    this.owner.register('service:intl', IntlService.from(state));

    const intl = this.owner.lookup('service:intl');

    assert.strictEqual(intl.state, state);
    assert.strictEqual(intl.t('greeting'), 'Hello');

    intl.addTranslations('en-us', { farewell: 'Goodbye' });

    assert.strictEqual(state.t('farewell'), 'Goodbye');
  });

  test("setLocale on the service still updates the document's lang attribute", async function (this: TestContext, assert) {
    const state = new IntlState();

    this.owner.register('service:intl', IntlService.from(state));

    const intl = this.owner.lookup('service:intl');

    intl.setLocale('de-de');
    await settled();

    assert.strictEqual(state.primaryLocale, 'de-de');
    assert.strictEqual(document.documentElement.getAttribute('lang'), 'de-de');
  });

  test('without from, every service creates its own state', function (this: TestContext, assert) {
    const intl = this.owner.lookup('service:intl');

    assert.true(intl.state instanceof IntlState);
  });
});
