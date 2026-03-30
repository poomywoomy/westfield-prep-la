

## Plan: Revamp Lead Analyzer Output

### Changes

**1. Update AI system prompt (`supabase/functions/analyze-lead/index.ts`)**

Replace the current 5-section output format with a simpler 2-section format:

- **Section 1: Quick Summary** — 3-4 sentences covering who the lead is, what they need, volume, and any notable details
- **Section 2: Acceptance Response** — A ready-to-copy professional message (2-3 paragraphs) that leads with how Westfield can serve them, mentions relevant capabilities naturally without bragging, and ends with a soft next-step invite. Tone: service-oriented, confident but not self-congratulatory.

Update the prompt instructions to emphasize: "Do not brag or list awards. Focus on how you can help them specifically. Be warm, professional, and solution-focused."

**2. Update UI to visually separate the response (`src/components/admin/LeadsTab.tsx`)**

- Parse the AI output to split the summary and the copy-paste response into two distinct sections
- Render the **summary** in a normal card
- Render the **acceptance response** in a visually distinct block with a colored background (e.g., `bg-emerald-50 border-emerald-200` or similar green-tinted card) and a dedicated "Copy Response" button on that section only
- This makes it immediately obvious where to start copy-pasting

### Technical Details

- The edge function prompt will instruct the AI to use a `---RESPONSE---` separator between summary and response sections
- The frontend splits on that separator to render two distinct UI blocks
- The "Copy" button on the response section copies only the acceptance message (plain text, no markdown)
- Keep the existing history table and view dialog unchanged

