

## Improve Document Generator: Font Hierarchy and Extended Client Fields

### Overview
Enhance the PDF document generator with clear visual hierarchy for section numbering and expand the form to capture all necessary contract details beyond just client names.

---

### Part 1: PDF Font Hierarchy for Section Numbers

**Current Issue:** All sections and subsections use the same 9pt font size, making them blend together.

**Solution:** Implement a three-tier font hierarchy:

| Element | Font Size | Style | Example |
|---------|-----------|-------|---------|
| Main Sections | 12pt | Bold | "1. SERVICES" |
| Subsections | 10pt | Bold | "1.1 Scope of Services" |
| Body Text | 9pt | Normal | Paragraph content |

**Detection Logic:**
```text
Main Section: /^\d+\.\s+[A-Z]/  (e.g., "1. SERVICES")
Subsection: /^\d+\.\d+\s+/      (e.g., "1.1 Scope of Services")
Body: Everything else
```

**Additional spacing:** Add extra vertical space before main sections for better separation.

---

### Part 2: Extended Client Information Fields

**New Form Fields:**

| Field | Required | Purpose |
|-------|----------|---------|
| Company/Business Name | Yes | Legal entity name for the agreement |
| Contact Name | Yes | Primary signer name |
| Title/Position | No | Signer's role (e.g., "Owner", "CEO") |
| Address | No | Business address |
| City, State, ZIP | No | Location details |
| Email | No | Contact email |
| Phone | No | Contact phone |
| Second Contact Name | No | Additional signer if needed |
| Second Contact Title | No | Second signer's role |

---

### Part 3: Database Migration

Add new columns to `generated_documents` table:

```sql
ALTER TABLE generated_documents
ADD COLUMN company_name TEXT,
ADD COLUMN contact_title TEXT,
ADD COLUMN address TEXT,
ADD COLUMN city TEXT,
ADD COLUMN state TEXT,
ADD COLUMN zip TEXT,
ADD COLUMN email TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN contact_title_2 TEXT;
```

Rename existing columns for clarity:
- `client_name_1` stays as primary contact name
- `client_name_2` stays as secondary contact name

---

### Part 4: Updated Signature Section in PDF

**Current:**
```text
CLIENT:
[Client Name]

Signature: _______________
Name: _______________
Title: _______________
Date: _______________
```

**New (with filled data):**
```text
CLIENT:
[Company Name]
[Address]
[City, State ZIP]

Signature: _______________
Name: [Contact Name]
Title: [Contact Title] (or blank line if not provided)
Email: [Email]
Date: _______________
```

---

### Technical Implementation

#### File Changes:

1. **`src/lib/documentGenerator.ts`**
   - Update function signature to accept a client details object instead of separate strings
   - Implement font size switching based on section type
   - Add spacing before main sections
   - Update signature section to display all provided client information

2. **`src/components/admin/DocumentGeneratorTab.tsx`**
   - Replace simple input fields with comprehensive form
   - Group fields logically (Company Info, Contact 1, Contact 2)
   - Update state management for all new fields
   - Update database insert to include all fields
   - Update history display to show company name

3. **Database Migration**
   - Add new columns for extended client information

---

### Form Layout Preview

```text
┌─────────────────────────────────────────────────────────┐
│  COMPANY INFORMATION                                     │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Company/Business Name *                            │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌──────────────────────┐  ┌────────────────────────┐  │
│  │ Address              │  │ City                   │  │
│  └──────────────────────┘  └────────────────────────┘  │
│  ┌────────────┐  ┌──────────────┐                      │
│  │ State      │  │ ZIP          │                      │
│  └────────────┘  └──────────────┘                      │
├─────────────────────────────────────────────────────────┤
│  PRIMARY CONTACT                                         │
│  ┌────────────────────────┐  ┌──────────────────────┐  │
│  │ Contact Name *         │  │ Title                │  │
│  └────────────────────────┘  └──────────────────────┘  │
│  ┌────────────────────────┐  ┌──────────────────────┐  │
│  │ Email                  │  │ Phone                │  │
│  └────────────────────────┘  └──────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│  SECONDARY CONTACT (Optional)                            │
│  ┌────────────────────────┐  ┌──────────────────────┐  │
│  │ Contact Name           │  │ Title                │  │
│  └────────────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

### Summary of Deliverables

1. PDF with clear visual hierarchy (12pt/10pt/9pt fonts)
2. Additional vertical spacing before main sections
3. Extended form with 10+ customizable fields
4. Updated signature block showing all provided client details
5. Database schema update to persist all fields
6. Backward compatible with existing document history

