# Westfield Prep Center Brand Design Brief

A polished, shareable brand kit document (PDF, plus a matching DOCX) built from the real design tokens, logo assets, and messaging rules already in the project. Nothing on the site changes; this is a document deliverable only.

## What the document contains

**1. Cover + brand statement**
Logo lock-up on Midnight Navy, positioning line ("Execution > Hype"), one-paragraph description of Westfield as an operational infrastructure partner for LA fulfillment, and the 1,000+ orders/month sweet-spot framing.

**2. Logo usage**
- Primary logo (existing `westfield-logo.png`), plus which file to use where (web, print, PDF).
- Minimum size, clear space rule (equal to the height of the "W"), approved backgrounds (white, Midnight Navy, light stone).
- Do / Don't grid: no recoloring, no stretching, no drop shadows, no placing on busy photos without a scrim.

**3. Color system**
Swatch pages with hex + HSL + token name for every real token in `src/styles.css`:
- Core brand: Midnight Navy `#0A0A23`, Fulfillment Orange `#FF7A00`, Graphite Gray `#4D4D4D`, Secondary BG `#F5F5F7`.
- Semantic UI tokens: background, foreground, primary, secondary, muted, accent, destructive, border, ring.
- Sub-palettes documented as page-family systems: West Coast technical editorial (`--wc-*`), Shopify page (`--shopify-*`), Blog (`--blog-*`), Why Choose Us warm linen/sunset (`--wcu-*`), Bento navy surfaces (`--surface-navy*`).
- Usage ratio guidance (navy dominant, orange as accent only, generous neutral space) and contrast notes.

**4. Typography**
Inter (UI/body), Fraunces (display/serif), JetBrains Mono (data figures) with the type scale used on the site: H1/H2/H3 sizes, weight 600 headings, body sizes, tracking, and the monospace-for-metrics rule.

**5. Voice & messaging**
- Tone: direct, operational, proof-driven; "Execution > Hype".
- Rules: always "Outbound Shipment", location is always "Los Angeles, CA", never "no monthly minimums", built for 1,000+ orders/month without a hard floor.
- Approved boilerplate (short, medium, long), headline patterns, CTA language, and words to avoid.

**6. UI component patterns**
Rendered reference examples: primary/secondary buttons, metric cards, section heading with orange underline accent, hairline dividers, icon badges (orange at 10% on navy ring), and photography/imagery direction (real warehouse operations, natural light, no stock-cliché handshakes).

## Technical notes

- Generated with a Python script using ReportLab (Platypus) at Letter size, writing to `/mnt/documents/westfield-brand-brief.pdf`.
- Fonts embedded from the sandbox (DejaVu registered for Unicode safety; Inter/Fraunces embedded if the TTFs resolve, otherwise closest available substitute, with the real font names stated in the type section).
- Logo pulled from `src/assets/westfield-logo.png`; all color values read directly out of `src/styles.css` so the doc cannot drift from the code.
- Matching DOCX generated with docx-js for editability.
- QA: every page rendered to images and visually inspected for clipping, overlap, contrast, and swatch accuracy before delivery.
