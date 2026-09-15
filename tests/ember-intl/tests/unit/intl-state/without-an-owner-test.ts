import { createCache, getValue } from '@glimmer/tracking/primitives/cache';
import { IntlState } from 'ember-intl';
import { module, test } from 'qunit';

module('Unit | IntlState > without an owner', function () {
  test('it translates and formats', function (assert) {
    const state = new IntlState();

    state.setLocale('en-us');
    state.addTranslations('en-us', {
      greeting: 'Hello, {name}!',
    });

    assert.strictEqual(state.primaryLocale, 'en-us');
    assert.true(state.exists('greeting'));
    assert.strictEqual(state.t('greeting', { name: 'Ember' }), 'Hello, Ember!');
    assert.strictEqual(state.formatNumber(1234.5), '1,234.5');
  });

  test('reads are autotracked', function (assert) {
    const state = new IntlState();

    state.setLocale('en-us');
    state.addTranslations('en-us', { greeting: 'Hello' });
    state.addTranslations('de-de', { greeting: 'Hallo' });

    const greeting = createCache(() => state.t('greeting'));

    assert.strictEqual(getValue(greeting), 'Hello');

    state.setLocale('de-de');

    assert.strictEqual(getValue(greeting), 'Hallo');
  });
});
