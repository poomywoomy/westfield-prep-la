

## Plan: Lead Analyzer Tab

Build a new "Leads" tab in the admin dashboard where you can paste lead information, and AI generates a personalized "why we're a good fit" response.

### What You'll Get

- A new **Leads** tab in the admin sidebar
- A textarea to paste the raw lead info (like the examples you shared)
- An **Analyze Lead** button that sends the data to AI
- AI generates a structured response covering: why Westfield is a good fit, relevant services, location advantage, scalability, and a recommended acceptance message
- A **Copy to Clipboard** button for the generated response
- A table of past analyzed leads saved to the database for reference

### Technical Changes

**1. Database: `leads` table** (migration)
- Columns: `id`, `company_name`, `raw_data` (text), `ai_analysis` (text), `status` (pending/accepted/rejected), `created_at`, `updated_at`
- RLS: admin-only access

**2. Edge function: `analyze-lead/index.ts`**
- Takes the raw lead text, sends it to Lovable AI with a system prompt that knows Westfield's services (LA location, FBA/FBM/DTC prep, storage, kitting, returns, Shopify fulfillment, etc.)
- Returns a structured "why we're a good fit" analysis with specific talking points matched to the lead's needs

**3. New component: `src/components/admin/LeadsTab.tsx`**
- Paste area for raw lead data
- "Analyze" button → calls edge function → displays AI response
- Copy button for the generated text
- History table showing past leads with company name, date, status
- Click a past lead to view its analysis again

**4. Wire into admin dashboard**
- Add lazy import + `TabsContent` in `AdminDashboard.tsx`
- Add "Leads" menu item with `UserPlus` icon in `app-sidebar-admin.tsx`

### AI System Prompt Will Include
- Westfield Prep Center's location (Los Angeles), services, capabilities
- Instructions to match the lead's specific needs to Westfield's offerings
- Output format: acceptance reason, key selling points, recommended response

