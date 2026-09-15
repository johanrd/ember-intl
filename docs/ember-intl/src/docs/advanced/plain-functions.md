# Plain functions

The `intl` service needs an owner. Code without one, such as a plain function helper, a utility, or an API client, can't inject it.

An app can create the state behind the service itself, in a module, and give it to the service. Plain functions then import the state, while templates and classes keep injecting `intl`. Both read the same locales and translations.

> [!IMPORTANT]
>
> State in a module is created once and shared by everything that imports it. Use this in apps that render one application at a time. See [Limitations](#limitations).


## 1. Create the state {#1-create-the-state}

::: code-group

```ts [app/intl.ts]
import { IntlState } from 'ember-intl/intl-state';

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

`IntlService.from()` returns a subclass of the class that you call it on, so the container creates, owns, and destroys the service as usual. If your app already extends the service, call `from()` on your subclass.

Set up the locale and translations as before, on the service or on the state. Either way, the service updates the `lang` attribute of `<html>`.


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

Call `intl.t()` only after the locale is set, not at the top level of a module. Code that runs when a module loads runs before your app sets the locale.


## Testing {#testing}

Because the state lives in a module, it keeps its locales, translations, formats, and handlers from one test to the next. That includes the stubbed translations and the missing translation handler from [`setupIntl`](../test-helpers/setup-intl). Reset the state after each test:

::: code-group

```ts [tests/helpers/index.ts]
import { intl } from 'my-app/intl';

function setupTest(hooks: NestedHooks, options?: SetupTestOptions): void {
  upstreamSetupTest(hooks, options);

  hooks.afterEach(function () {
    intl.reset();
  });
}
```

:::

Then set up each test as usual, e.g. with `setupIntl`, which writes to the same state through the service.

To test a plain function without the app's state, let it take the state as an argument, and pass a `new IntlState()` in the test.


## Limitations {#limitations}

- **FastBoot:** the server can render many requests with the same modules, so one visitor's locale and translations could reach another. Don't use a module-level state with FastBoot.
- **Engines:** an engine that lists `intl` in its `dependencies.services` shares the host's service, and so the state. An engine that doesn't gets its own service and state, while plain functions imported from the host read the host's state.
- **Addons:** an addon can't create the app's state. Addons should keep injecting the `intl` service, or accept `t` or the state from the app.
