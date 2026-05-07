## Remove Document Type Selector

Since only one document type exists (Master Service Agreement), the dropdown is unnecessary friction.

### Changes to `src/components/admin/DocumentGeneratorTab.tsx`

1. Remove the "Document Type" label + `<Select>` block (lines ~248–261).
2. Default `selectedDocument` state to the single available key from `DOCUMENT_TYPES` so all downstream conditionals (`{selectedDocument && ...}`) and the generate handler continue to work without changes.
3. Remove the "Please select a document type" toast guard (line 95) since selection is no longer possible.
4. Keep the rest of the form (Agreement Options, intro period, setup fee, generated docs table, etc.) untouched.

No backend, schema, or PDF generator changes.