const translationModules = {
  'de-de': () => import('virtual:ember-intl/translations/de-de'),
  'en-us': () => import('virtual:ember-intl/translations/en-us'),
} as const;

type Locale = keyof typeof translationModules;

export function loadTranslations(hooks: NestedHooks): void {
  hooks.beforeEach(async function () {
    const intl = this.owner.lookup('service:intl');

    async function load(locale: Locale): Promise<void> {
      const { default: translations } = await translationModules[locale]();

      intl.addTranslations(locale, translations);
    }

    await Promise.allSettled([load('de-de'), load('en-us')]);
  });
}
