---
"ember-intl": minor
"test-app-for-ember-intl": minor
"docs-app-for-ember-intl": minor
---

Extracted the service's state into `IntlState`, and added `IntlService.from(state)` so that apps can share one state between the service and plain functions. Added `IntlState#reset()` for tests.

The service now delegates its methods to `this.state`. If your app extends the service and overrides a method that other methods called, such as `getTranslation()`, the override no longer changes the result of `t()` or `exists()`.
