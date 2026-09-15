import { render, settled, type TestContext } from '@ember/test-helpers';
import { IntlState, t } from 'ember-intl';
import IntlService from 'ember-intl/services/intl';
import { setLocale } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import translationsForDeDe from 'virtual:ember-intl/translations/de-de';
import translationsForEnUs from 'virtual:ember-intl/translations/en-us';

module(
  'Integration | Helper | t > state given to the service',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it updates when the state is changed directly', async function (this: TestContext, assert) {
      const state = new IntlState();

      state.addTranslations('de-de', translationsForDeDe);
      state.addTranslations('en-us', translationsForEnUs);
      state.setLocale('en-us');

      this.owner.register('service:intl', IntlService.from(state));

      await render(
        <template>
          <div data-test-output>
            {{t "smoke-tests.hello.world"}}
          </div>
        </template>,
      );

      assert.dom('[data-test-output]').hasText('Hello world!');

      state.setLocale('de-de');
      await settled();

      assert.dom('[data-test-output]').hasText('Hallo Welt!');
    });

    test('a plain function reading the state updates like the helper', async function (this: TestContext, assert) {
      const state = new IntlState();

      state.addTranslations('de-de', translationsForDeDe);
      state.addTranslations('en-us', translationsForEnUs);
      state.setLocale('en-us');

      this.owner.register('service:intl', IntlService.from(state));

      // A plain function with no owner, as an app would export from a module
      const helloWorld = (): string => state.t('smoke-tests.hello.world');

      await render(
        <template>
          <div data-test-plain-function>{{(helloWorld)}}</div>
          <div data-test-helper>{{t "smoke-tests.hello.world"}}</div>
        </template>,
      );

      assert.dom('[data-test-plain-function]').hasText('Hello world!');
      assert.dom('[data-test-helper]').hasText('Hello world!');

      // Through the service, as an app changes the locale
      await setLocale('de-de');

      assert.dom('[data-test-plain-function]').hasText('Hallo Welt!');
      assert.dom('[data-test-helper]').hasText('Hallo Welt!');
    });
  },
);
