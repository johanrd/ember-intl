import { destroy } from '@ember/destroyable';
import { settled, type TestContext } from '@ember/test-helpers';
import { IntlState } from 'ember-intl';
import IntlService from 'ember-intl/services/intl';
// Not the app's `setupTest`: it looks up `service:intl` before each test, and
// a service can't be registered after it has been looked up.
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

function getLang(): null | string {
  return document.documentElement.getAttribute('lang');
}

module("Unit | Service | intl > document's lang attribute", function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    document.documentElement.setAttribute('lang', 'und');
  });

  test('setLocale on the service updates it', async function (this: TestContext, assert) {
    const intl = this.owner.lookup('service:intl');

    intl.setLocale('de-de');
    await settled();

    assert.strictEqual(getLang(), 'de-de');
  });

  test('changing the locale of a given state directly updates it', async function (this: TestContext, assert) {
    const state = new IntlState();

    this.owner.register('service:intl', IntlService.from(state));
    this.owner.lookup('service:intl');

    state.setLocale('de-de');
    await settled();

    assert.strictEqual(getLang(), 'de-de');
  });

  test('a locale set before the service is created is applied', async function (this: TestContext, assert) {
    const state = new IntlState();

    state.setLocale('de-de');

    this.owner.register('service:intl', IntlService.from(state));
    this.owner.lookup('service:intl');
    await settled();

    assert.strictEqual(getLang(), 'de-de');
  });

  test('it follows the latest change, on the service or on the state', async function (this: TestContext, assert) {
    const state = new IntlState();

    this.owner.register('service:intl', IntlService.from(state));

    const intl = this.owner.lookup('service:intl');

    intl.setLocale('en-us');
    await settled();

    assert.strictEqual(getLang(), 'en-us');

    state.setLocale('de-de');
    await settled();

    assert.strictEqual(getLang(), 'de-de');

    intl.setLocale('en-us');
    await settled();

    assert.strictEqual(getLang(), 'en-us');
  });

  test('a destroyed service no longer updates it', async function (this: TestContext, assert) {
    const state = new IntlState();

    this.owner.register('service:intl', IntlService.from(state));

    const intl = this.owner.lookup('service:intl');

    destroy(intl);
    await settled();

    state.setLocale('de-de');
    await settled();

    assert.strictEqual(getLang(), 'und');
  });
});
