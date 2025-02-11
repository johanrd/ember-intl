import { getOwner } from '@ember/application';
import Helper from '@ember/component/helper';
import { isEmpty } from '@ember/utils';

import type IntlService from '../services/intl';

type Params = Parameters<IntlService['t']>;
type Value = string | null | undefined;
type Options = Params[1];

interface TSignature {
  Args: {
    Named?: Options & { allowEmpty?: boolean };
    Positional: [Value] | [Value, Options];
  };
  Return: string;
}

export default class THelper extends Helper<TSignature> {
  intl?: IntlService;
  unsubscribeLocaleChanged?: () => void;

  constructor() {
    // eslint-disable-next-line prefer-rest-params
    super(...arguments);

    this.intl = getOwner(this).lookup('service:intl');
    
    // @ts-expect-error: Property 'onLocaleChanged' is private and only accessible within class 'IntlService'.
    this.unsubscribeLocaleChanged = this.intl.onLocaleChanged(
      this.recompute,
      this,
    );
  }

  compute(
    [value, positionalOptions]: TSignature['Args']['Positional'],
    namedOptions: TSignature['Args']['Named'],
  ) {
    const options = positionalOptions
      ? Object.assign({}, positionalOptions, namedOptions)
      : namedOptions;

    if (isEmpty(value)) {
      if (options?.allowEmpty ?? this.allowEmpty) {
        return '';
      }

      if (typeof value === 'undefined') {
        throw new Error('{{t}} helper requires a value.');
      }
    }

    return this.intl.t(value!, options) as unknown as string;
  }

  willDestroy() {
    super.willDestroy();
    this.unsubscribeLocaleChanged();
  }
}
