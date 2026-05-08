## Fixes for Document Generator Tab

**File:** `src/components/admin/DocumentGeneratorTab.tsx`

### 1. Fix Agreement Options disappearing after generation
The Agreement Options block is conditionally rendered with `{selectedDocument && ...}`. After a successful generate, the reset code sets `setSelectedDocument("")`, which hides the section even though Master Agreement is the only/default document.

**Fix:** Reset `selectedDocument` back to `"master_agreement"` (the default) instead of `""` so the Agreement Options panel stays visible.

### 2. Remove address inputs from Company Information
Remove the Address, City, State, and ZIP input fields from the Company Information section. Keep Company Name and Phone.

**Sub-changes:**
- Remove the Address + City row.
- Remove the State + ZIP fields; keep Phone (make it span full width or pair appropriately).
- Remove `address`, `city`, `state`, `zip` from the `setClientDetails` reset object.
- Leave the underlying `ClientDetails` type and DB columns untouched (they remain optional/nullable). The generator and history table continue to work; address-related fields will simply be sent as empty strings / null.

### Out of scope
- No changes to PDF generation logic.
- No DB schema changes.
- No changes to history table display.
