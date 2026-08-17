import { lazy, type ComponentType } from "react";

const RELOAD_KEY = "chunk-reload-attempt";

/**
 * Wraps React.lazy so that a stale/removed chunk (after a new deploy)
 * triggers one automatic reload instead of a blank screen.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      const mod = await factory();
      window.sessionStorage.removeItem(RELOAD_KEY);
      return mod;
    } catch (error) {
      const alreadyReloaded = window.sessionStorage.getItem(RELOAD_KEY) === "1";
      if (!alreadyReloaded) {
        window.sessionStorage.setItem(RELOAD_KEY, "1");
        window.location.reload();
        // Never resolves; page is reloading.
        return new Promise<{ default: T }>(() => {});
      }
      throw error;
    }
  });
}
