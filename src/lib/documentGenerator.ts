import jsPDF from "jspdf";
import westfieldLogo from "@/assets/westfield-logo-pdf.jpg";

export interface ClientDetails {
  companyName: string;
  contactName: string;
  contactTitle?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  email?: string;
  phone?: string;
  contactName2?: string;
  contactTitle2?: string;
  minimumSpendTier?: string;
  setupFeeRefundable?: boolean;
}

// ---------------- Number → Words helpers ----------------
const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function chunkToWords(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
  return ONES[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + chunkToWords(n % 100) : "");
}

function numberToWords(n: number): string {
  if (n === 0) return "Zero";
  const parts: string[] = [];
  const million = Math.floor(n / 1_000_000);
  const thousand = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;
  if (million) parts.push(chunkToWords(million) + " Million");
  if (thousand) parts.push(chunkToWords(thousand) + " Thousand");
  if (rest) parts.push(chunkToWords(rest));
  return parts.join(" ").trim();
}

// ---------------- Tier parsing ----------------
interface ParsedTier {
  raw: string;
  base: string; // tier portion without "|fee:..."
  setupFeeAmount: number; // dollars
  // Minimum-spend resolved values:
  introAmount?: number;
  ongoingAmount?: number;
  introMonths?: number;
  flatAmount?: number;
}

export function parseTier(raw: string | undefined | null, defaultFee = 500): ParsedTier {
  const r = (raw || "").trim();
  let base = r;
  let setupFeeAmount = defaultFee;
  const feeIdx = r.indexOf("|fee:");
  if (feeIdx !== -1) {
    base = r.slice(0, feeIdx);
    const feeRaw = r.slice(feeIdx + 5);
    const f = parseInt(feeRaw, 10);
    if (f && f >= 1) setupFeeAmount = f;
  }

  const out: ParsedTier = { raw: r, base, setupFeeAmount };

  if (base === "250_then_500") {
    out.introAmount = 250;
    out.ongoingAmount = 500;
    out.introMonths = 3;
  } else if (base === "500_flat" || base === "500") {
    out.flatAmount = 500;
  } else if (base === "1000_flat" || base === "1000") {
    out.flatAmount = 1000;
  } else if (base.startsWith("custom:")) {
    const payload = base.slice(7);
    // custom:<intro>_then_<ongoing>_for_<months>
    const fullMatch = payload.match(/^(\d+)_then_(\d+)_for_(\d+)$/);
    if (fullMatch) {
      out.introAmount = parseInt(fullMatch[1], 10);
      out.ongoingAmount = parseInt(fullMatch[2], 10);
      out.introMonths = parseInt(fullMatch[3], 10);
    } else if (payload.includes("_then_")) {
      const [introStr, ongoingStr] = payload.split("_then_");
      const intro = parseInt(introStr, 10);
      const ongoing = parseInt(ongoingStr, 10);
      if (intro >= 1 && ongoing >= 1) {
        out.introAmount = intro;
        out.ongoingAmount = ongoing;
        out.introMonths = 3; // legacy default
      }
    } else {
      const amt = parseInt(payload, 10);
      if (amt && amt >= 1) out.flatAmount = amt;
    }
  }

  return out;
}

// ---------------- Dynamic Section Builders ----------------
const getSection5_1 = (refundable: boolean, fee: number): string => {
  const words = numberToWords(fee);
  const formatted = fee.toLocaleString("en-US");
  if (refundable) {
    return `5.1 Account Setup Fee
Prior to commencement of Services, Client shall pay a one-time account setup fee of ${words} U.S. Dollars ($${formatted}), which covers WMS account creation, system configuration, training, and ongoing technical support. This setup fee is fully refundable and will be wired back to Client upon the closure of Client's account and settlement of all outstanding balances.`;
  }
  return `5.1 Account Setup Fee
Prior to commencement of Services, Client shall pay a one-time, non-refundable account setup fee of ${words} U.S. Dollars ($${formatted}), which covers WMS account creation, system configuration, training, and ongoing technical support.`;
};

const getSection5_5 = (parsed: ParsedTier): string => {
  const palletPrefix = `The minimum monthly payment is dictated by the stored pallet amount.`;
  const exclusion = `For the avoidance of doubt, shipping fees, carton usage fees, and polybag usage fees are not inclusive of, and shall not be credited toward, the minimum monthly payment requirement. These charges are billed separately based on actual usage.`;
  const shortfall = `If the actual fees for Services rendered in any given month fall below the applicable minimum threshold, Client will be billed the difference to satisfy this minimum requirement.`;

  let tierText = "";
  if (parsed.introAmount && parsed.ongoingAmount && parsed.introMonths) {
    const m = parsed.introMonths;
    const monthsWords = numberToWords(m).toLowerCase();
    tierText = `Client agrees to a minimum monthly payment requirement for the Services. For the first ${monthsWords} (${m}) month${m === 1 ? "" : "s"} following the Effective Date, the minimum payment shall be ${numberToWords(parsed.introAmount)} U.S. Dollars ($${parsed.introAmount.toLocaleString("en-US")}) per month. Following this initial ${monthsWords}-month period, the minimum payment requirement shall increase to ${numberToWords(parsed.ongoingAmount)} U.S. Dollars ($${parsed.ongoingAmount.toLocaleString("en-US")}) per month.`;
  } else if (parsed.flatAmount) {
    tierText = `Client agrees to a minimum monthly payment of ${numberToWords(parsed.flatAmount)} U.S. Dollars ($${parsed.flatAmount.toLocaleString("en-US")}) per month for the Services.`;
  }

  return `5.5 Minimum Monthly Payments
${palletPrefix} ${tierText} ${exclusion} ${shortfall}`;
};

const getSection14 = (refundable: boolean, fee: number): string => {
  const words = numberToWords(fee);
  const formatted = fee.toLocaleString("en-US");
  const refundSentence = refundable
    ? ` The Post-Termination Removal Fee and any accrued additional storage fees must be paid in full prior to the release of the remaining inventory. Upon satisfaction of all outstanding balances, the full ${words} U.S. Dollar ($${formatted}) account setup fee shall be refunded and wired back to Client.`
    : ` The Post-Termination Removal Fee and any accrued additional storage fees must be paid in full prior to the release of the remaining inventory.`;

  return `14. TERM AND TERMINATION

14.1 Notice and Breach
This Agreement remains in effect until terminated by either Party upon thirty (30) days' written notice. Westfield may terminate or suspend Services immediately for non-payment or material breach.

14.2 Post-Termination Removal Fee
Upon termination of this Agreement for any reason, Client's remaining inventory shall be removed from Westfield's facility on an ad-hoc basis at a flat rate of One Hundred Twenty-Five U.S. Dollars ($125.00) per pallet. Client is solely responsible for arranging and scheduling pickup of the removed inventory with a carrier of Client's choosing.

If Client's products are not already stored on pallets at the time of removal, Westfield shall consolidate, palletize, and stage the products for transport, and the per-pallet removal fee shall be applied to the total number of pallets rounded up to the nearest whole pallet.

Client must coordinate pickup of the staged inventory within a reasonable timeframe mutually agreed upon by both Parties. If Client fails to arrange pickup within the agreed timeframe, Westfield reserves the right to assess additional storage fees at Westfield's then-current storage rates for each day the inventory remains at the facility, until pickup is completed.${refundSentence}`;
};

// ---------------- Full Agreement Body ----------------
const buildAgreementContent = (details: ClientDetails): string => {
  const parsed = parseTier(details.minimumSpendTier, 500);
  const refundable = details.setupFeeRefundable ?? false;
  const section5_1 = getSection5_1(refundable, parsed.setupFeeAmount);
  const section5_5 = parsed.raw ? getSection5_5(parsed) : "";
  const section14 = getSection14(refundable, parsed.setupFeeAmount);

  return `This Client Service Agreement (the "Agreement") is entered into as of the Effective Date by and between Sathatham LLC dba Westfield Prep Center, a California limited liability company with its principal place of business in Los Angeles, California ("Westfield," "Service Provider," or "Company"), and the undersigned client ("Client").

Westfield and Client may be referred to individually as a "Party" and collectively as the "Parties."

1. SERVICES

1.1 Scope of Services
Westfield provides third-party logistics services strictly as requested by Client, which may include receiving, visual inspection, labeling, bundling, kitting, polybagging, storage, outbound fulfillment, preparation and forwarding of inventory to third-party fulfillment centers or carriers, and other ancillary logistics services agreed to in writing (collectively, the "Services").

1.2 No Fiduciary Relationship
The Parties acknowledge that Westfield acts solely as an independent logistics service provider. Nothing in this Agreement creates a partnership, joint venture, bailment beyond that imposed by law, or fiduciary relationship.

1.3 Written Instructions Required
All Services, shipping requests, and changes must be confirmed in writing and accepted by Westfield prior to performance. Verbal or informal instructions are not binding unless confirmed in writing by both Parties.

2. SERVICE LEVEL EXPECTATIONS (SLA)

2.1 Standard Turnaround
Westfield operates with a standard twenty-four (24) hour turnaround for both inbound receiving and outbound shipping, measured from receipt of complete and accurate written instructions during normal business hours.

2.2 Daily Cutoffs
For operational planning, the following standard daily cutoffs apply:
• Shipping cutoff time: 2:00 PM Pacific Time.
• Receiving cutoff time: 5:00 PM Pacific Time.
Requests or deliveries arriving after these cutoffs are processed on the next business day.

3. HANDLING OF OPERATIONAL ERRORS

Westfield stands behind the quality of its work. If an operational error attributable to Westfield occurs (such as a labeling, bundling, or pick-pack error) and is the direct result of Westfield's failure to follow Client's written and confirmed instructions, Westfield will make Client whole. The remedy shall consist of payment to Client of the customer sale price of the affected product (not solely the Cost of Goods Sold), plus an additional two hundred percent (200%) of that sale price as liquidated damages. This remedy is the sole and exclusive remedy for such operational errors.

4. INVOICE DISPUTE & INVENTORY RELEASE

Westfield invoices are generated directly from its Warehouse Management System (WMS) and are intended to be transparent and verifiable. In the event of a good-faith dispute regarding an invoice, Westfield shall not withhold Client's inventory, provided that Client pays no less than fifty percent (50%) of the disputed invoice while the matter is investigated and resolved. Continuing partial payment ensures uninterrupted fulfillment of Client orders.

5. QUALITY CONTROL (COMPLIMENTARY)

5.1 Courtesy Quality Checks
Westfield may, at its discretion, perform complimentary visual and procedural checks during receiving, preparation, or outbound handling. Such checks are limited to external condition, labeling presence, carton counts where visible, and apparent conformity with written Client instructions.

5.2 QC Limitations
Quality control checks do not constitute product testing, internal quantity verification, regulatory compliance review, safety testing, or certification of merchantability, fitness for a particular purpose, or legal compliance.

5.3 No Expansion of Liability
Client acknowledges that complimentary quality checks are provided as a courtesy only and do not alter the allocation of risk, limitation of liability, or indemnification obligations under this Agreement.

6. CLIENT RESPONSIBILITIES AND REPRESENTATIONS

6.1 Accuracy of Information
Client represents and warrants that all product data, labeling information, SKU data, dimensions, weights, classifications, safety disclosures, and regulatory representations provided to Westfield are complete, accurate, and current.

6.2 Reliance
Westfield relies entirely on information supplied by Client and shall not be responsible for errors, delays, penalties, enforcement actions, losses, or damages arising from inaccurate, incomplete, or misleading information provided by Client.

6.3 Regulatory Compliance
Client retains sole responsibility for compliance with all applicable laws and regulations, including but not limited to FDA, USDA, FTC, CPSC, DOT, OSHA, state regulations, and marketplace requirements.

7. REGULATED AND HIGH-RISK GOODS

Client acknowledges that Westfield does not manufacture, formulate, test, certify, approve, or warrant Client products for regulatory or safety compliance. Services are strictly logistical in nature.

This provision applies without limitation to food, dietary supplements, cosmetics, hazardous materials, and any regulated or restricted goods.

8. FEES AND PAYMENT

${section5_1.replace("5.1 ", "8.1 ")}

8.2 Invoices
All invoices are due upon receipt unless otherwise stated in writing.

8.3 Late Payments
Late payments accrue a five percent (5%) per-day late fee, capped at fifteen percent (15%) of the outstanding balance.

8.4 Suspension of Services
Westfield may suspend Services or withhold release of inventory until all outstanding balances are paid in full, subject to Section 4 (Invoice Dispute & Inventory Release).

${section5_5.replace("5.5 ", "8.5 ")}

9. STORAGE, INVENTORY HANDLING & ABANDONMENT

9.1 Storage Rates
Storage rates are quoted in writing and may vary based on volume, duration, or warehouse availability.

9.2 Excess Inventory
Client agrees to pay additional storage fees if inventory exceeds quoted volume.

9.3 Automated Abandonment Notifications
Westfield maintains an automated email notification system to manage potential abandonment scenarios. Client will receive clear and timely notifications throughout the abandonment process.

9.4 Inventory Hold During Abandonment
In the event of an abandonment scenario, Westfield will continue to securely hold Client's inventory; however, no new outbound orders will be fulfilled until the required action is secured and the underlying matter is resolved.

9.5 Final Disposition
If Client fails to pay outstanding balances or provide shipping instructions, Westfield shall provide written notice of intent to dispose. If Client fails to cure within thirty (30) calendar days, Westfield may dispose of, liquidate, or repurpose inventory without liability to Client.

10. RISK OF LOSS AND CARRIERS

10.1 Risk Transfer
Title and risk of loss transfer to Client upon carrier pickup from Westfield's facility.

10.2 Third-Party Carriers and Platforms
Westfield bears no responsibility for loss, damage, delays, misdelivery, or discrepancies occurring after goods leave its custody, including discrepancies reported by Amazon, TikTok, Walmart, Shopify, or other platforms.

11. INSURANCE & PRODUCT HANDLING STANDARDS

11.1 Catastrophic Coverage
Westfield maintains comprehensive insurance coverage for catastrophic damage or failure, with limits of Two Million U.S. Dollars ($2,000,000) per year per client and One Million U.S. Dollars ($1,000,000) per incident. Because this baseline coverage is comprehensive, additional structures are typically not required unless the value of Client's stored inventory approaches or exceeds the One Million U.S. Dollar ($1,000,000) per-incident threshold, in which case the Parties may discuss premium insurance options scaled to inventory value.

11.2 Client Insurance
Client is solely responsible for maintaining any desired cargo, inventory, product liability, recall, or regulatory insurance coverage applicable to its goods. Westfield strongly encourages Client to maintain such insurance throughout the term of this Agreement. Proof of insurance may be requested upon reasonable notice.

11.3 Facility & Product Handling Standards
Westfield treats the handling of pet food, consumables, and regulated goods with the highest level of care. The warehouse is maintained as a strictly dry environment held at approximately sixty-eight degrees Fahrenheit (68°F) year-round. Westfield maintains a pristine pest record, retains a licensed professional for routine pest inspections at least once per month, and conducts a deep cleaning of the entire facility each business day after closing (Monday through Friday).

12. LIABILITY FRAMEWORK

12.1 Operational Errors
Operational errors and ordinary negligence by Westfield are addressed exclusively under Section 3 (Handling of Operational Errors).

12.2 Catastrophic Events
Catastrophic damage or failure is addressed under Section 11.1 (Catastrophic Coverage).

12.3 Liability Cap
To the maximum extent permitted by law, and except as expressly modified by Sections 3 and 11.1, Service Provider's total cumulative liability arising out of or relating to this Agreement or the Services shall not exceed the total fees actually paid by Client to Service Provider for Services rendered during the sixty (60) days immediately preceding the event giving rise to the claim.

12.4 Excluded Damages
In no event shall Service Provider be liable for indirect, incidental, consequential, special, or lost-profit damages.

12.5 Negligence Standard
This limitation applies to all claims except to the extent caused by Service Provider's gross negligence or willful misconduct.

13. ASSUMPTION OF RISK AND RELEASE

Client acknowledges that logistics services involve inherent risks of delay, loss, damage, miscounts, and platform discrepancies. Client voluntarily assumes all such risks. Client releases and waives all claims against Westfield arising from the Services, except as prohibited by law and except for the express remedies set forth in Sections 3 and 11.

${section14}

15. INDEMNIFICATION

Client agrees to indemnify, defend, and hold harmless Westfield and its owners, members, employees, and agents from all claims, damages, liabilities, costs, and expenses (including attorneys' fees) arising from:
• Client's products
• Regulatory non-compliance
• Intellectual property claims
• Inaccurate information provided by Client
• Client's breach of this Agreement

This obligation survives termination.

16. BAILMENT LIMITATION

To the extent any bailment is deemed to exist by operation of law, such bailment shall be limited solely to the exercise of reasonable care consistent with generally accepted third-party logistics industry standards.

17. DISPUTE RESOLUTION

17.1 Governing Law
This Agreement is governed by the laws of the State of California.

17.2 Arbitration
Any dispute shall be resolved by binding arbitration in Los Angeles County, California.

17.3 Class Action Waiver
All claims must be brought on an individual basis only. Class, collective, representative, or private attorney general actions are expressly waived.

18. MISCELLANEOUS

18.1 Independent Contractor
Westfield is an independent contractor.

18.2 No Oral Modifications
No oral statements or course of dealing shall modify this Agreement.

18.3 Severability
If any provision is unenforceable, the remainder remains in effect.

18.4 Entire Agreement
This Agreement constitutes the entire agreement between the Parties and supersedes all prior agreements.

19. EXECUTION

This Agreement may be executed electronically and in counterparts.`;
};

// ---------------- Appendix: Fee Schedule / Pilot Terms ----------------
const APPENDIX_TITLE = "APPENDIX A — FEE SCHEDULE & PILOT TERMS";

const APPENDIX_BODY = `A.1 Inbound Receiving — Palletized Shipments
For palletized inbound shipments, Client shall be charged the applicable pallet receiving fee only. Palletized shipments are not subject to additional carton receiving fees; the pallet receiving fee is inclusive of standard intake handling for the cartons contained on each pallet.

A.2 Inbound Receiving — Loose Carton (Floor-Loaded) Shipments
Loose, floor-loaded carton shipments are billed at the per-carton receiving rate.

A.3 Pilot Terms
Where a pilot or trial period has been agreed to in writing by the Parties, the pricing and minimum-monthly terms set forth in the body of this Agreement shall govern unless expressly modified by a written pilot addendum signed by both Parties.

A.4 Post-Termination Removal
Ad-hoc removal of remaining inventory upon termination is billed at $125.00 per pallet, rounded up to the nearest whole pallet where products are not already palletized. Client arranges and schedules carrier pickup. Additional storage fees at Westfield's then-current rates may apply if pickup is not coordinated within the timeframe mutually agreed upon by the Parties.

A.5 Pricing Updates
Specific per-unit, per-pallet, per-order, and storage rates are documented separately in Client's active pricing schedule on file with Westfield, and may be updated from time to time pursuant to Section 18 (Miscellaneous).`;

// ---------------- Brand colors ----------------
const NAVY: [number, number, number] = [10, 10, 35];        // #0A0A23
const ORANGE: [number, number, number] = [255, 122, 0];     // #FF7A00
const GRAY_DARK: [number, number, number] = [55, 60, 75];
const GRAY_MED: [number, number, number] = [110, 115, 130];
const GRAY_LINE: [number, number, number] = [205, 210, 220];

// ---------------- PDF generation ----------------
export const generateDocumentPDF = async (
  documentType: string,
  clientDetails: ClientDetails
) => {
  if (documentType !== "master_agreement") {
    throw new Error("Invalid document type");
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - 2 * margin;

  const today = new Date();
  const formattedDate = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;

  const drawHeader = () => {
    // Navy band
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, pageWidth, 22, "F");
    // Logo
    const logoW = 34;
    const logoH = 13;
    doc.addImage(westfieldLogo, "JPEG", (pageWidth - logoW) / 2, 4.5, logoW, logoH);
    // Orange accent rule
    doc.setFillColor(...ORANGE);
    doc.rect(0, 22, pageWidth, 1.2, "F");
  };

  const drawFooter = (pageNum: number, totalPages: number) => {
    const y = pageHeight - 9;
    doc.setDrawColor(...GRAY_LINE);
    doc.setLineWidth(0.2);
    doc.line(margin, y - 4, pageWidth - margin, y - 4);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY_MED);
    doc.text("Westfield Prep Center  •  Client Service Agreement", margin, y);
    doc.text(`Effective ${formattedDate}`, pageWidth / 2, y, { align: "center" });
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, y, { align: "right" });
    doc.setTextColor(0, 0, 0);
  };

  const bodyTop = 30;
  const bodyBottom = pageHeight - 16;

  let y = bodyTop;
  let page = 1;

  drawHeader();

  // Title block
  doc.setTextColor(...NAVY);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENT SERVICE AGREEMENT", pageWidth / 2, y + 4, { align: "center" });
  y += 8;
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY_MED);
  doc.text("Master Agreement", pageWidth / 2, y + 2, { align: "center" });
  y += 4;
  // hairline
  doc.setDrawColor(...GRAY_LINE);
  doc.setLineWidth(0.3);
  doc.line(margin + 30, y + 4, pageWidth - margin - 30, y + 4);
  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(...GRAY_DARK);
  doc.text(`Effective Date: ${formattedDate}`, pageWidth / 2, y, { align: "center" });
  doc.setTextColor(0, 0, 0);
  y += 8;

  const ensureSpace = (needed: number) => {
    if (y + needed > bodyBottom) {
      doc.addPage();
      page += 1;
      drawHeader();
      y = bodyTop;
    }
  };

  const mainSectionPattern = /^\d+\.\s+[A-Z]/;
  const subsectionPattern = /^\d+\.\d+\s+/;
  const bulletPattern = /^•\s+/;

  const renderBlock = (block: string) => {
    const rawLines = block.split("\n");

    // Helper: compute wrapped height of a body/bullet/subsection line
    const measureBody = (line: string) => doc.splitTextToSize(line, contentWidth).length * 4.8;
    const measureBullet = (line: string) => doc.splitTextToSize(line.replace(/^•\s+/, ""), contentWidth - 6).length * 4.8;
    const measureSubsection = (line: string) => doc.splitTextToSize(line, contentWidth).length * 5 + 1.5;

    // Pre-group: collapse consecutive non-blank lines into paragraph "groups".
    // A group is a contiguous run of non-blank lines belonging to the same
    // logical block (heading line(s) and following paragraph lines stay together).
    type Item =
      | { kind: "blank" }
      | { kind: "main"; line: string }
      | { kind: "sub"; line: string }
      | { kind: "bullet"; line: string }
      | { kind: "body"; line: string };

    const items: Item[] = rawLines.map((raw) => {
      const line = raw.trimEnd();
      if (line === "") return { kind: "blank" };
      if (mainSectionPattern.test(line)) return { kind: "main", line };
      if (subsectionPattern.test(line)) return { kind: "sub", line };
      if (bulletPattern.test(line)) return { kind: "bullet", line };
      return { kind: "body", line };
    });

    const renderMain = (line: string) => {
      y += 3;
      doc.setFontSize(11.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...NAVY);
      doc.text(line, margin, y);
      const textW = doc.getTextWidth(line);
      doc.setFillColor(...ORANGE);
      doc.rect(margin, y + 1.5, Math.min(textW, 40), 0.8, "F");
      doc.setTextColor(0, 0, 0);
      y += 7;
    };

    const renderSub = (line: string) => {
      y += 1.5;
      doc.setFontSize(9.8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...GRAY_DARK);
      const wrapped = doc.splitTextToSize(line, contentWidth);
      wrapped.forEach((w: string) => {
        doc.text(w, margin, y);
        y += 5;
      });
      doc.setTextColor(0, 0, 0);
    };

    const renderBullet = (line: string) => {
      const text = line.replace(/^•\s+/, "");
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...GRAY_DARK);
      const wrapped = doc.splitTextToSize(text, contentWidth - 6);
      wrapped.forEach((w: string, i: number) => {
        if (i === 0) doc.text("•", margin + 1, y);
        doc.text(w, margin + 6, y);
        y += 4.8;
      });
      doc.setTextColor(0, 0, 0);
    };

    const renderBody = (line: string) => {
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...GRAY_DARK);
      const wrapped = doc.splitTextToSize(line, contentWidth);
      wrapped.forEach((w: string) => {
        doc.text(w, margin, y);
        y += 4.8;
      });
      doc.setTextColor(0, 0, 0);
    };

    const pageHeightAvail = bodyBottom - bodyTop;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.kind === "blank") {
        y += 2.5;
        continue;
      }

      if (item.kind === "main") {
        // Reserve space for heading + first sub/body line so heading is never orphaned
        let needed = 14;
        const next = items[i + 1];
        if (next && next.kind === "sub") needed += measureSubsection(next.line) + 6;
        else if (next && next.kind === "body") needed += Math.min(measureBody(next.line), 14);
        ensureSpace(needed);
        renderMain(item.line);
        continue;
      }

      if (item.kind === "sub") {
        // Group subsection heading with the following paragraph (until next blank/heading)
        let groupHeight = measureSubsection(item.line);
        let j = i + 1;
        while (j < items.length && items[j].kind !== "blank" && items[j].kind !== "main" && items[j].kind !== "sub") {
          const it = items[j];
          if (it.kind === "body") groupHeight += measureBody(it.line);
          else if (it.kind === "bullet") groupHeight += measureBullet(it.line);
          j++;
        }
        // Cap at page height (fall back to natural flow for very long groups)
        if (groupHeight > pageHeightAvail) groupHeight = measureSubsection(item.line) + 14;
        ensureSpace(groupHeight);
        renderSub(item.line);
        continue;
      }

      if (item.kind === "bullet") {
        ensureSpace(measureBullet(item.line));
        renderBullet(item.line);
        continue;
      }

      // Body paragraph: render as a unit when it fits
      const h = measureBody(item.line);
      if (h <= pageHeightAvail) {
        ensureSpace(h);
        renderBody(item.line);
      } else {
        // Paragraph longer than a page: line-by-line fallback
        doc.setFontSize(9.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...GRAY_DARK);
        const wrapped = doc.splitTextToSize(item.line, contentWidth);
        wrapped.forEach((w: string) => {
          ensureSpace(5);
          doc.text(w, margin, y);
          y += 4.8;
        });
        doc.setTextColor(0, 0, 0);
      }
    }
  };

  renderBlock(buildAgreementContent(clientDetails));

  // ---------------- Signatures ----------------
  ensureSpace(80);
  y += 6;
  doc.setDrawColor(...GRAY_LINE);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("SIGNATURES", pageWidth / 2, y, { align: "center" });
  doc.setTextColor(0, 0, 0);
  y += 8;

  const cardW = (contentWidth - 8) / 2;
  const cardH = 70;
  ensureSpace(cardH + 10);

  const drawSignatureCard = (
    x: number,
    title: string,
    lines: { label: string; value?: string }[]
  ) => {
    // Card border
    doc.setDrawColor(...GRAY_LINE);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, y, cardW, cardH, 2, 2, "S");
    // Title strip
    doc.setFillColor(...NAVY);
    doc.rect(x, y, cardW, 7, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(title, x + 4, y + 5);
    doc.setTextColor(0, 0, 0);

    let cy = y + 13;
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY_DARK);
    lines.forEach((row) => {
      doc.text(row.label, x + 4, cy);
      const labelW = doc.getTextWidth(row.label) + 2;
      doc.setDrawColor(...GRAY_LINE);
      doc.setLineWidth(0.25);
      doc.line(x + 4 + labelW, cy + 0.5, x + cardW - 4, cy + 0.5);
      if (row.value) {
        doc.setTextColor(...NAVY);
        doc.setFont("helvetica", "bold");
        doc.text(row.value, x + 4 + labelW + 1, cy - 0.2);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...GRAY_DARK);
      }
      cy += 9;
    });
    doc.setTextColor(0, 0, 0);
  };

  const cityStateZip = [clientDetails.city, clientDetails.state, clientDetails.zip].filter(Boolean).join(", ");
  const clientHeader = clientDetails.companyName + (cityStateZip ? `  —  ${cityStateZip}` : "");

  drawSignatureCard(margin, "SERVICE PROVIDER — Sathatham LLC dba Westfield Prep Center", [
    { label: "Signature:" },
    { label: "Printed Name:" },
    { label: "Title:" },
    { label: "Date:" },
  ]);

  drawSignatureCard(margin + cardW + 8, `CLIENT — ${clientHeader}`, [
    { label: "Signature:" },
    { label: "Printed Name:", value: clientDetails.contactName || undefined },
    { label: "Title:", value: clientDetails.contactTitle || undefined },
    { label: "Date:" },
  ]);

  y += cardH + 6;

  if (clientDetails.contactName2) {
    ensureSpace(cardH + 4);
    drawSignatureCard(margin + cardW + 8, "CLIENT (Authorized Signatory 2)", [
      { label: "Signature:" },
      { label: "Printed Name:", value: clientDetails.contactName2 },
      { label: "Title:", value: clientDetails.contactTitle2 || undefined },
      { label: "Date:" },
    ]);
    y += cardH + 6;
  }

  // ---------------- Appendix ----------------
  doc.addPage();
  page += 1;
  drawHeader();
  y = bodyTop;

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text(APPENDIX_TITLE, pageWidth / 2, y + 4, { align: "center" });
  y += 8;
  doc.setFillColor(...ORANGE);
  doc.rect((pageWidth - 32) / 2, y, 32, 0.8, "F");
  y += 8;
  doc.setTextColor(0, 0, 0);

  renderBlock(APPENDIX_BODY);

  // ---------------- Footers (paint after totals known) ----------------
  const totalPages = (doc as any).internal.getNumberOfPages?.() ?? page;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(i, totalPages);
  }

  const fileName = `Client_Service_Agreement_Master_Agreement_${formattedDate.replace(/\//g, "-")}.pdf`;
  doc.save(fileName);
};
