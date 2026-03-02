
# Fix Blank Screen - React Deduplication

## Problem
The app shows a blank screen with zero console logs or errors, meaning React itself isn't mounting. This is a known issue caused by duplicate React instances in the dependency tree. When multiple copies of React exist, hooks receive a null dispatcher and the app silently fails to render.

## Fix
Add a `dedupe` property to the `resolve` section in `vite.config.ts` to force Vite to use a single React instance:

**File: `vite.config.ts`**

Add `dedupe` inside the existing `resolve` block (alongside `alias`):

```typescript
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
  dedupe: ["react", "react-dom", "react/jsx-runtime"],
},
```

This is a one-line addition. No other files need to change.

## Why This Works
Several dependencies (framer-motion, tiptap, radix-ui, etc.) may bundle or resolve their own React copy. The `dedupe` directive forces Vite to resolve all imports of these packages to a single location, preventing the silent crash.
