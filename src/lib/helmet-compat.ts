// Compat shim for react-helmet-async (CommonJS package).
// Vite SSR cannot resolve named exports from CJS modules directly, so we
// resolve them off the default export when present and re-export them here.
// All app code should import Helmet/HelmetProvider from this module.
import * as helmetModule from "react-helmet-async";

type HelmetModule = typeof import("react-helmet-async");

const resolved: HelmetModule =
  ((helmetModule as unknown as { default?: HelmetModule }).default?.Helmet
    ? (helmetModule as unknown as { default: HelmetModule }).default
    : helmetModule) as HelmetModule;

export const Helmet = resolved.Helmet;
export const HelmetProvider = resolved.HelmetProvider;
