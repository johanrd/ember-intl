# Plain functions

The `intl` service needs an owner. Code without one, such as a plain function helper, a utility, or an API client, can't inject it.

An app can create the state behind the service itself, in a module, and give it to the service. Plain functions then import the state, and templates and classes keep injecting `intl`. Both read the same locales and translations.

> [!IMPORTANT]
>
> State in a module lives as long as the page and is shared by every application instance on it. Use this in apps that render one application per page. Addons should keep injecting the `intl` service.


## 1. Create the state {#1-create-the-state}

::: code-group

```ts [app/intl.ts]
import { IntlState } from 'ember-intl';

export const intl = new IntlState();
```

:::


## 2. Give it to the service {#2-give-it-to-the-service}

::: code-group

```ts [app/services/intl.ts]
import IntlService from 'ember-intl/services/intl';
import { intl } from 'my-app/intl';

export default IntlService.from(intl);
```

:::

`IntlService.from()` returns a service class, so the container creates, owns, and destroys the service as usual. Methods on the service, such as `setLocale()`, update the state that you passed.


## 3. Use it anywhere {#3-use-it-anywhere}

::: code-group

```ts [app/utils/labels.ts]
import { intl } from 'my-app/intl';

export function statusLabel(status: string): string {
  return intl.t(`status.${status}`);
}
```

:::

Reads are autotracked, so a template that calls `statusLabel()` updates when the locale changes.

Set the locale through the service when you can, e.g. in the application route. The service then also updates the `lang` attribute of `<html>`. If you call `intl.setLocale()` on the state directly, update the attribute yourself.


## Testing {#testing}

Because the state lives in a module, it keeps its locale and translations from one test to the next. Set up what a test needs in `beforeEach`, e.g. with [`setupIntl`](../test-helpers/setup-intl), which looks up the service and so writes to the same state.

To test a plain function in isolation, create a separate `IntlState` in the test and pass it to the function instead of importing the app's.
