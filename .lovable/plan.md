

## Replace Admin Document Generator with New Client Service Agreement

### Overview
Replace the existing three documents (CSA, Exhibit A, Exhibit B) with a single comprehensive "Client Service Agreement (Master Agreement)" document, with proper Westfield branding and signature fields.

### Changes Required

#### 1. Update Document Content (`src/lib/documentGenerator.ts`)

**Remove:**
- `csa` document content
- `exhibit_a` document content  
- `exhibit_b` document content

**Add:**
- New `master_agreement` document with the complete 16-section Client Service Agreement content provided

#### 2. Update Document Generator Tab (`src/components/admin/DocumentGeneratorTab.tsx`)

**Current:**
```javascript
const DOCUMENT_TYPES = {
  csa: "Client Service Agreement (CSA)",
  exhibit_a: "EXHIBIT A — Terms and Conditions Addendum",
  exhibit_b: "EXHIBIT B — Liability Waiver and Hold Harmless Agreement"
};
```

**New:**
```javascript
const DOCUMENT_TYPES = {
  master_agreement: "Client Service Agreement (Master Agreement)"
};
```

#### 3. PDF Formatting Updates

The PDF will include:
- Westfield logo centered at top (existing)
- Title: "CLIENT SERVICE AGREEMENT (MASTER AGREEMENT)"
- Current date
- All 16 sections of the agreement properly formatted
- **Signature Section at End:**
  - SERVICE PROVIDER: Sathatham LLC dba Westfield Prep Center with signature line
  - CLIENT: Dynamic client name(s) with signature line
  - Date field

### Document Structure (16 Sections)

1. Services (Scope, No Fiduciary, Written Instructions Required)
2. Quality Control (Complimentary)
3. Client Responsibilities and Representations
4. Regulated and High-Risk Goods
5. Fees and Payment ($500 setup fee, late fees)
6. Storage and Abandonment (30-day disposal notice)
7. Risk of Loss and Carriers
8. Insurance
9. Limitation of Liability (60-day fee cap)
10. Assumption of Risk and Release
11. Indemnification
12. Bailment Limitation
13. Dispute Resolution (CA law, LA arbitration, class waiver)
14. Term and Termination (30-day notice)
15. Miscellaneous
16. Execution

### Technical Details

- Font: Helvetica (consistent with current)
- Logo: Centered Westfield logo from `westfield-logo-pdf.jpg`
- Page handling: Auto-pagination when content exceeds page
- Signature layout: Two-column format (Service Provider left, Client right)
- File naming: `Client_Service_Agreement_Master_Agreement_MM-DD-YYYY.pdf`

### Database Compatibility

The `generated_documents` table already supports custom document types via `document_type` text field, so no database migration needed. Historical records will reference old document types while new ones use `master_agreement`.

