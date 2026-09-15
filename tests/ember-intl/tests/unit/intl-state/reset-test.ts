import { IntlState } from 'ember-intl';
import { module, test } from 'qunit';

module('Unit | IntlState > reset', function () {
  test('it forgets the locales and translations', function (assert) {
    const state = new IntlState();

    state.setLocale('en-us');
    state.addTranslations('en-us', { greeting: 'Hello' });

    state.reset();

    assert.deepEqual(state.locales, []);
    assert.throws(() => {
      return state.primaryLocale;
    }, /No locales set/);

    state.setLocale('en-us');

    assert.false(state.exists('greeting'));
  });

  test('it restores the default missing translation handler', function (assert) {
    const state = new IntlState();

    state.setOnMissingTranslation(() => 'from the test');
    state.reset();
    state.setLocale('en-us');

    assert.strictEqual(
      state.t('greeting'),
      'Missing translation "greeting" for locale "en-us"',
    );
  });

  test('it forgets the formats', function (assert) {
    const state = new IntlState();

    state.setFormats({
      formatNumber: {
        twoDecimals: { maximumFractionDigits: 2 },
      },
    });
    state.setLocale('en-us');

    assert.strictEqual(
      state.formatNumber(1.23456, { format: 'twoDecimals' }),
      '1.23',
    );

    state.reset();
    state.setLocale('en-us');

    assert.throws(() => {
      state.formatNumber(1.23456, { format: 'twoDecimals' });
    });
  });
});
