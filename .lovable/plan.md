Update `src/pages/TOS.tsx` Section 3 (Pricing & Payment):

1. Change payment due language from "Payment is due upon receipt of invoice" to **"Payment is due within 7 days of invoice receipt."**

2. Add a new sentence in the payment terms paragraph: **"Credit card payments processed via Stripe are subject to an additional 3% processing surcharge."**

3. Bump "Last Updated" date to today (May 19, 2026).

All copy wrapped in `<TranslatedText>` per existing pattern. No other sections, components, or backend logic touched.

Note: If the contract is also generated as a PDF elsewhere (e.g. master agreement generator in `src/lib/documentGenerator.ts`), I'll check and mirror the same two changes there. Otherwise this is a TOS-only edit.