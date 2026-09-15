import { settled, type TestContext } from '@ember/test-helpers';
import { IntlState } from 'ember-intl';
import IntlService from 'ember-intl/services/intl';
// Not the app's `setupTest`: it looks up `service:intl` before each test, and
// a service can't be registered after it has been looked up.
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

  test("setLocale on the service updates the document's lang attribute", async function (this: TestContext, assert) {
    document.documentElement.setAttribute('lang', 'und');

    const state = new IntlState();

    this.owner.register('service:intl', IntlService.from(state));

    const intl = this.owner.lookup('service:intl');

    intl.setLocale('de-de');
    await settled();

    assert.strictEqual(state.primaryLocale, 'de-de');
    assert.strictEqual(document.documentElement.getAttribute('lang'), 'de-de');
  });

  test('it keeps the methods of the class that it is called on', function (this: TestContext, assert) {
    class AppIntlService extends IntlService {
      override t(): string {
        return 'from the subclass';
      }
    }

    const state = new IntlState();

    this.owner.register('service:intl', AppIntlService.from(state));

    const intl = this.owner.lookup('service:intl');

    assert.true(intl instanceof AppIntlService);
    assert.strictEqual(intl.state, state);
    assert.strictEqual(intl.t('greeting'), 'from the subclass');
  });

  test('calling it on a class that it returned uses the newer state', function (this: TestContext, assert) {
    const first = new IntlState();
    const second = new IntlState();

    this.owner.register('service:intl', IntlService.from(first).from(second));

    assert.strictEqual(this.owner.lookup('service:intl').state, second);
  });

  test('without it, every service creates its own state', function (this: TestContext, assert) {
    const factory = this.owner.factoryFor('service:intl');
    const one = factory.create();
    const other = factory.create();

    assert.true(one.state instanceof IntlState);
    assert.notStrictEqual(one.state, other.state);
  });
});
