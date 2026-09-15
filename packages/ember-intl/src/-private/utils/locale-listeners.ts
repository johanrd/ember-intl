import type { Locales } from './locale.ts';

type Listener = (locales: Locales) => void;

const registry = new WeakMap<
  object,
  { listeners: Set<Listener>; locales?: Locales }
>();

function entryFor(state: object): {
  listeners: Set<Listener>;
  locales?: Locales;
} {
  let entry = registry.get(state);

  if (!entry) {
    entry = { listeners: new Set() };
    registry.set(state, entry);
  }

  return entry;
}

/**
 * @private
 *
 * Called by the state when its locales change, or with `undefined`
 * when it forgets them.
 */
export function notifyLocaleChange(
  state: object,
  locales: Locales | undefined,
): void {
  const entry = entryFor(state);

  entry.locales = locales;

  if (locales) {
    entry.listeners.forEach((listener) => {
      listener(locales);
    });
  }
}

/**
 * @private
 *
 * Calls the listener with the state's locales, now if they are set, and
 * again whenever they change. Returns a function that stops listening.
 */
export function onLocaleChange(state: object, listener: Listener): () => void {
  const entry = entryFor(state);

  entry.listeners.add(listener);

  if (entry.locales) {
    listener(entry.locales);
  }

  return () => {
    entry.listeners.delete(listener);
  };
}
