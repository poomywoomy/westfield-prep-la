// SSR polyfills — must be the FIRST import in main.tsx.
// The Supabase client reads localStorage at module-init time and
// crashes the Node prerender build otherwise. We DO NOT polyfill
// `window` — that flips vite-react-ssg into the client branch and
// crashes on `document`.

type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  key(index: number): string | null;
  readonly length: number;
};

function createMemoryStorage(): StorageLike {
  const store = new Map<string, string>();
  return {
    getItem: (k) => (store.has(k) ? store.get(k)! : null),
    setItem: (k, v) => {
      store.set(k, String(v));
    },
    removeItem: (k) => {
      store.delete(k);
    },
    clear: () => {
      store.clear();
    },
    key: (i) => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size;
    },
  };
}

const g = globalThis as unknown as {
  localStorage?: StorageLike;
  sessionStorage?: StorageLike;
};

if (typeof g.localStorage === "undefined") {
  g.localStorage = createMemoryStorage();
}
if (typeof g.sessionStorage === "undefined") {
  g.sessionStorage = createMemoryStorage();
}

export {};
