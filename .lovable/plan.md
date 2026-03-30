

## Plan: Fix False-Positive EDI Detection

### Problem
The EDI keyword `'edi'` matches any text containing those 3 letters (e.g., "credit", "medium", "immediately", "editing"). This causes the red EDI warning to trigger on nearly every lead.

### Fix

**File: `supabase/functions/analyze-lead/index.ts`**

Change `detectEDI` to use word-boundary regex matching instead of simple `includes()`:

```typescript
function detectEDI(text: string): boolean {
  const lower = text.toLowerCase();
  return EDI_KEYWORDS.some(kw => {
    const pattern = new RegExp(`\\b${kw.replace(/\s+/g, '\\s+')}\\b`, 'i');
    return pattern.test(lower);
  });
}
```

This ensures `'edi'` only matches the standalone word "EDI", not substrings inside other words. All multi-word keywords like "edi integration" and "sps commerce" continue to work as before.

Single file change, edge function redeploy only.

