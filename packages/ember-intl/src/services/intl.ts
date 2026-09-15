import { cancel, next, type Timer as EmberRunTimer } from '@ember/runloop';
import Service from '@ember/service';

import { getHtmlElement } from '../-private/utils/get-html-element.ts';
import {
  convertToArray,
  hasLocaleChanged,
  type Locales,
} from '../-private/utils/locale.ts';
import { IntlState } from '../intl-state.ts';

export type { Formats } from '../intl-state.ts';

export default class IntlService extends Service {
  private _documentLocales?: Locales;

  private _timer?: EmberRunTimer;

  state = new IntlState();
  get locales(): IntlState['locales'] {
    return this.state.locales;
  }

  get primaryLocale(): IntlState['primaryLocale'] {
    return this.state.primaryLocale;
  }

  addTranslations(
    ...args: Parameters<IntlState['addTranslations']>
  ): ReturnType<IntlState['addTranslations']> {
    return this.state.addTranslations(...args);
  }

  exists(
    ...args: Parameters<IntlState['exists']>
  ): ReturnType<IntlState['exists']> {
    return this.state.exists(...args);
  }

  formatDate(
    ...args: Parameters<IntlState['formatDate']>
  ): ReturnType<IntlState['formatDate']> {
    return this.state.formatDate(...args);
  }

  formatDateRange(
    ...args: Parameters<IntlState['formatDateRange']>
  ): ReturnType<IntlState['formatDateRange']> {
    return this.state.formatDateRange(...args);
  }

  formatDisplayName(
    ...args: Parameters<IntlState['formatDisplayName']>
  ): ReturnType<IntlState['formatDisplayName']> {
    return this.state.formatDisplayName(...args);
  }

  formatList(
    ...args: Parameters<IntlState['formatList']>
  ): ReturnType<IntlState['formatList']> {
    return this.state.formatList(...args);
  }

  formatMessage(
    ...args: Parameters<IntlState['formatMessage']>
  ): ReturnType<IntlState['formatMessage']> {
    return this.state.formatMessage(...args);
  }

  formatNumber(
    ...args: Parameters<IntlState['formatNumber']>
  ): ReturnType<IntlState['formatNumber']> {
    return this.state.formatNumber(...args);
  }

  formatRelativeTime(
    ...args: Parameters<IntlState['formatRelativeTime']>
  ): ReturnType<IntlState['formatRelativeTime']> {
    return this.state.formatRelativeTime(...args);
  }

  formatTime(
    ...args: Parameters<IntlState['formatTime']>
  ): ReturnType<IntlState['formatTime']> {
    return this.state.formatTime(...args);
  }

  /**
   * Returns a service class that uses the given state instead of its own.
   * Code without an owner, like plain functions, can then read the same
   * state as templates and classes that inject `intl`.
   */
  static from(state: IntlState): typeof IntlService {
    return class extends IntlService {
      state = state;
    };
  }

  getTranslation(
    ...args: Parameters<IntlState['getTranslation']>
  ): ReturnType<IntlState['getTranslation']> {
    return this.state.getTranslation(...args);
  }

  setFormats(
    ...args: Parameters<IntlState['setFormats']>
  ): ReturnType<IntlState['setFormats']> {
    return this.state.setFormats(...args);
  }

  setLocale(locale: Locales | string): void {
    this.state.setLocale(locale);

    const proposedLocale = convertToArray(locale);

    if (hasLocaleChanged(proposedLocale, this._documentLocales)) {
      this._documentLocales = proposedLocale;

      // eslint-disable-next-line ember/no-runloop
      cancel(this._timer);

      // eslint-disable-next-line ember/no-runloop
      this._timer = next(() => {
        this.updateDocumentLanguage();
      });
    }
  }

  setOnFormatjsError(
    ...args: Parameters<IntlState['setOnFormatjsError']>
  ): ReturnType<IntlState['setOnFormatjsError']> {
    return this.state.setOnFormatjsError(...args);
  }

  setOnMissingTranslation(
    ...args: Parameters<IntlState['setOnMissingTranslation']>
  ): ReturnType<IntlState['setOnMissingTranslation']> {
    return this.state.setOnMissingTranslation(...args);
  }

  t(...args: Parameters<IntlState['t']>): ReturnType<IntlState['t']> {
    return this.state.t(...args);
  }

  private updateDocumentLanguage(): void {
    const html = getHtmlElement(this);

    if (!html) {
      return;
    }

    html.setAttribute('lang', this.primaryLocale);
  }

  willDestroy(): void {
    super.willDestroy();

    // eslint-disable-next-line ember/no-runloop
    cancel(this._timer);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    intl: IntlService;
  }
}
