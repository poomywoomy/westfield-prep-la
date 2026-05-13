import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { l as useToast, B as Button, s as supabase } from "../main.mjs";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-WfKgKW48.js";
import { I as Input } from "./input-CSM87NBF.js";
import { L as Label } from "./label-B2r_8dgk.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Cb0hy2VC.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DBlWpW0x.js";
import { FileText, Download } from "lucide-react";
import jsPDF from "jspdf";
import { w as westfieldLogo } from "./westfield-logo-pdf-YyCjah_h.js";
import "vite-react-ssg";
import "react-router-dom";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "@supabase/supabase-js";
import "framer-motion";
import "@radix-ui/react-slot";
import "@radix-ui/react-navigation-menu";
import "@radix-ui/react-dialog";
import "@radix-ui/react-accordion";
import "react-icons/si";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
function chunkToWords(n) {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
  return ONES[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + chunkToWords(n % 100) : "");
}
function numberToWords(n) {
  if (n === 0) return "Zero";
  const parts = [];
  const million = Math.floor(n / 1e6);
  const thousand = Math.floor(n % 1e6 / 1e3);
  const rest = n % 1e3;
  if (million) parts.push(chunkToWords(million) + " Million");
  if (thousand) parts.push(chunkToWords(thousand) + " Thousand");
  if (rest) parts.push(chunkToWords(rest));
  return parts.join(" ").trim();
}
function parseTier(raw, defaultFee = 500) {
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
  const out = { raw: r, base, setupFeeAmount };
  if (base === "250_then_500") {
    out.introAmount = 250;
    out.ongoingAmount = 500;
    out.introMonths = 3;
  } else if (base === "500_flat" || base === "500") {
    out.flatAmount = 500;
  } else if (base === "1000_flat" || base === "1000") {
    out.flatAmount = 1e3;
  } else if (base.startsWith("custom:")) {
    const payload = base.slice(7);
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
        out.introMonths = 3;
      }
    } else {
      const amt = parseInt(payload, 10);
      if (amt && amt >= 1) out.flatAmount = amt;
    }
  }
  return out;
}
const getSection5_1 = (refundable, fee) => {
  const words = numberToWords(fee);
  const formatted = fee.toLocaleString("en-US");
  if (refundable) {
    return `5.1 Account Setup Fee
Prior to commencement of Services, Client shall pay a one-time account setup fee of ${words} U.S. Dollars ($${formatted}), which covers WMS account creation, system configuration, training, and ongoing technical support. This setup fee is fully refundable and will be wired back to Client upon the closure of Client's account and settlement of all outstanding balances.`;
  }
  return `5.1 Account Setup Fee
Prior to commencement of Services, Client shall pay a one-time, non-refundable account setup fee of ${words} U.S. Dollars ($${formatted}), which covers WMS account creation, system configuration, training, and ongoing technical support.`;
};
const getSection5_5 = (parsed) => {
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
const getSection14 = (refundable, fee) => {
  const words = numberToWords(fee);
  const formatted = fee.toLocaleString("en-US");
  const refundSentence = refundable ? ` The Post-Termination Removal Fee and any accrued additional storage fees must be paid in full prior to the release of the remaining inventory. Upon satisfaction of all outstanding balances, the full ${words} U.S. Dollar ($${formatted}) account setup fee shall be refunded and wired back to Client.` : ` The Post-Termination Removal Fee and any accrued additional storage fees must be paid in full prior to the release of the remaining inventory.`;
  return `14. TERM AND TERMINATION

14.1 Notice and Breach
This Agreement remains in effect until terminated by either Party upon thirty (30) days' written notice. Westfield may terminate or suspend Services immediately for non-payment or material breach.

14.2 Post-Termination Removal Fee
Upon termination of this Agreement for any reason, Client's remaining inventory shall be removed from Westfield's facility on an ad-hoc basis at a flat rate of One Hundred Twenty-Five U.S. Dollars ($125.00) per pallet. Client is solely responsible for arranging and scheduling pickup of the removed inventory with a carrier of Client's choosing.

If Client's products are not already stored on pallets at the time of removal, Westfield shall consolidate, palletize, and stage the products for transport, and the per-pallet removal fee shall be applied to the total number of pallets rounded up to the nearest whole pallet.

Client must coordinate pickup of the staged inventory within a reasonable timeframe mutually agreed upon by both Parties. If Client fails to arrange pickup within the agreed timeframe, Westfield reserves the right to assess additional storage fees at Westfield's then-current storage rates for each day the inventory remains at the facility, until pickup is completed.${refundSentence}`;
};
const buildAgreementContent = (details) => {
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
const NAVY = [10, 10, 35];
const ORANGE = [255, 122, 0];
const GRAY_DARK = [55, 60, 75];
const GRAY_MED = [110, 115, 130];
const GRAY_LINE = [205, 210, 220];
const generateDocumentPDF = async (documentType, clientDetails) => {
  if (documentType !== "master_agreement") {
    throw new Error("Invalid document type");
  }
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - 2 * margin;
  const today = /* @__PURE__ */ new Date();
  const formattedDate = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;
  const drawHeader = () => {
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, pageWidth, 22, "F");
    const logoW = 34;
    const logoH = 13;
    doc.addImage(westfieldLogo, "JPEG", (pageWidth - logoW) / 2, 4.5, logoW, logoH);
    doc.setFillColor(...ORANGE);
    doc.rect(0, 22, pageWidth, 1.2, "F");
  };
  const drawFooter = (pageNum, totalPages2) => {
    const y2 = pageHeight - 9;
    doc.setDrawColor(...GRAY_LINE);
    doc.setLineWidth(0.2);
    doc.line(margin, y2 - 4, pageWidth - margin, y2 - 4);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY_MED);
    doc.text("Westfield Prep Center  •  Client Service Agreement", margin, y2);
    doc.text(`Effective ${formattedDate}`, pageWidth / 2, y2, { align: "center" });
    doc.text(`Page ${pageNum} of ${totalPages2}`, pageWidth - margin, y2, { align: "right" });
    doc.setTextColor(0, 0, 0);
  };
  const bodyTop = 30;
  const bodyBottom = pageHeight - 16;
  let y = bodyTop;
  let page = 1;
  drawHeader();
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
  doc.setDrawColor(...GRAY_LINE);
  doc.setLineWidth(0.3);
  doc.line(margin + 30, y + 4, pageWidth - margin - 30, y + 4);
  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(...GRAY_DARK);
  doc.text(`Effective Date: ${formattedDate}`, pageWidth / 2, y, { align: "center" });
  doc.setTextColor(0, 0, 0);
  y += 8;
  const ensureSpace = (needed) => {
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
  const renderBlock = (block) => {
    const rawLines = block.split("\n");
    const measureBody = (line) => doc.splitTextToSize(line, contentWidth).length * 4.8;
    const measureBullet = (line) => doc.splitTextToSize(line.replace(/^•\s+/, ""), contentWidth - 6).length * 4.8;
    const measureSubsection = (line) => doc.splitTextToSize(line, contentWidth).length * 5 + 1.5;
    const items = rawLines.map((raw) => {
      const line = raw.trimEnd();
      if (line === "") return { kind: "blank" };
      if (mainSectionPattern.test(line)) return { kind: "main", line };
      if (subsectionPattern.test(line)) return { kind: "sub", line };
      if (bulletPattern.test(line)) return { kind: "bullet", line };
      return { kind: "body", line };
    });
    const renderMain = (line) => {
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
    const renderSub = (line) => {
      y += 1.5;
      doc.setFontSize(9.8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...GRAY_DARK);
      const wrapped = doc.splitTextToSize(line, contentWidth);
      wrapped.forEach((w) => {
        doc.text(w, margin, y);
        y += 5;
      });
      doc.setTextColor(0, 0, 0);
    };
    const renderBullet = (line) => {
      const text = line.replace(/^•\s+/, "");
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...GRAY_DARK);
      const wrapped = doc.splitTextToSize(text, contentWidth - 6);
      wrapped.forEach((w, i) => {
        if (i === 0) doc.text("•", margin + 1, y);
        doc.text(w, margin + 6, y);
        y += 4.8;
      });
      doc.setTextColor(0, 0, 0);
    };
    const renderBody = (line) => {
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...GRAY_DARK);
      const wrapped = doc.splitTextToSize(line, contentWidth);
      wrapped.forEach((w) => {
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
        let needed = 14;
        const next = items[i + 1];
        if (next && next.kind === "sub") needed += measureSubsection(next.line) + 6;
        else if (next && next.kind === "body") needed += Math.min(measureBody(next.line), 14);
        ensureSpace(needed);
        renderMain(item.line);
        continue;
      }
      if (item.kind === "sub") {
        let groupHeight = measureSubsection(item.line);
        let j = i + 1;
        while (j < items.length && items[j].kind !== "blank" && items[j].kind !== "main" && items[j].kind !== "sub") {
          const it = items[j];
          if (it.kind === "body") groupHeight += measureBody(it.line);
          else if (it.kind === "bullet") groupHeight += measureBullet(it.line);
          j++;
        }
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
      const h = measureBody(item.line);
      if (h <= pageHeightAvail) {
        ensureSpace(h);
        renderBody(item.line);
      } else {
        doc.setFontSize(9.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...GRAY_DARK);
        const wrapped = doc.splitTextToSize(item.line, contentWidth);
        wrapped.forEach((w) => {
          ensureSpace(5);
          doc.text(w, margin, y);
          y += 4.8;
        });
        doc.setTextColor(0, 0, 0);
      }
    }
  };
  renderBlock(buildAgreementContent(clientDetails));
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
  const drawSignatureCard = (x, title, lines) => {
    doc.setDrawColor(...GRAY_LINE);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, y, cardW, cardH, 2, 2, "S");
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
    { label: "Date:" }
  ]);
  drawSignatureCard(margin + cardW + 8, `CLIENT — ${clientHeader}`, [
    { label: "Signature:" },
    { label: "Printed Name:", value: clientDetails.contactName || void 0 },
    { label: "Title:", value: clientDetails.contactTitle || void 0 },
    { label: "Date:" }
  ]);
  y += cardH + 6;
  if (clientDetails.contactName2) {
    ensureSpace(cardH + 4);
    drawSignatureCard(margin + cardW + 8, "CLIENT (Authorized Signatory 2)", [
      { label: "Signature:" },
      { label: "Printed Name:", value: clientDetails.contactName2 },
      { label: "Title:", value: clientDetails.contactTitle2 || void 0 },
      { label: "Date:" }
    ]);
    y += cardH + 6;
  }
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
  const totalPages = doc.internal.getNumberOfPages?.() ?? page;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(i, totalPages);
  }
  const fileName = `Client_Service_Agreement_Master_Agreement_${formattedDate.replace(/\//g, "-")}.pdf`;
  doc.save(fileName);
};
const DOCUMENT_TYPES = {
  master_agreement: "Client Service Agreement (Master Agreement)"
};
const MINIMUM_SPEND_TIERS = {
  "250_then_500": "$250/mo for 3 months, then $500/mo",
  "500_flat": "$500/mo flat",
  "1000_flat": "$1,000/mo flat",
  "custom": "Custom Tier (intro + ongoing)"
};
const formatMinimumTierLabel = (tier) => {
  if (!tier) return "N/A";
  const parsed = parseTier(tier);
  if (parsed.introAmount && parsed.ongoingAmount && parsed.introMonths) {
    return `$${parsed.introAmount.toLocaleString("en-US")}/mo for ${parsed.introMonths} mo, then $${parsed.ongoingAmount.toLocaleString("en-US")}/mo`;
  }
  if (parsed.flatAmount) {
    return `$${parsed.flatAmount.toLocaleString("en-US")}/mo flat`;
  }
  return MINIMUM_SPEND_TIERS[parsed.base] || "N/A";
};
const SETUP_FEE_OPTIONS = {
  refundable: "Refundable",
  non_refundable: "Non-Refundable"
};
const DocumentGeneratorTab = () => {
  const [selectedDocument, setSelectedDocument] = useState("master_agreement");
  const [minimumSpendTier, setMinimumSpendTier] = useState("");
  const [customMinimumAmount, setCustomMinimumAmount] = useState("");
  const [customIntroAmount, setCustomIntroAmount] = useState("");
  const [customIntroMonths, setCustomIntroMonths] = useState("3");
  const [setupFeeOption, setSetupFeeOption] = useState("");
  const [setupFeeAmount, setSetupFeeAmount] = useState("500");
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [clientDetails, setClientDetails] = useState({
    companyName: "",
    contactName: "",
    contactTitle: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    phone: "",
    contactName2: "",
    contactTitle2: ""
  });
  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase.from("generated_documents").select("*").order("created_at", { ascending: false }).limit(10);
      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHistory();
  }, []);
  const updateField = (field, value) => {
    setClientDetails((prev) => ({ ...prev, [field]: value }));
  };
  const handleGenerate = async () => {
    if (!minimumSpendTier) {
      toast({ title: "Error", description: "Please select a minimum monthly spend tier", variant: "destructive" });
      return;
    }
    let resolvedMinimumTier = minimumSpendTier;
    if (minimumSpendTier === "custom") {
      const ongoing = parseInt(customMinimumAmount, 10);
      if (!ongoing || ongoing < 1) {
        toast({ title: "Invalid ongoing amount", description: "Enter a whole-dollar ongoing minimum spend (numbers only).", variant: "destructive" });
        return;
      }
      const introRaw = customIntroAmount.trim();
      if (introRaw === "") {
        resolvedMinimumTier = `custom:${ongoing}`;
      } else {
        const intro = parseInt(introRaw, 10);
        if (!intro || intro < 1) {
          toast({ title: "Invalid intro amount", description: "Leave intro blank for no intro period, or enter a whole-dollar amount.", variant: "destructive" });
          return;
        }
        const months = parseInt(customIntroMonths, 10);
        if (!months || months < 1) {
          toast({ title: "Invalid intro length", description: "Enter the intro period length in months (1 or more).", variant: "destructive" });
          return;
        }
        resolvedMinimumTier = `custom:${intro}_then_${ongoing}_for_${months}`;
      }
    }
    if (!setupFeeOption) {
      toast({ title: "Error", description: "Please select a setup fee option", variant: "destructive" });
      return;
    }
    const fee = parseInt(setupFeeAmount, 10);
    if (!fee || fee < 1) {
      toast({ title: "Invalid setup fee", description: "Enter a whole-dollar setup fee amount.", variant: "destructive" });
      return;
    }
    if (!clientDetails.companyName || !clientDetails.contactName) {
      toast({ title: "Error", description: "Please enter company name and contact name", variant: "destructive" });
      return;
    }
    const tierWithFee = `${resolvedMinimumTier}|fee:${fee}`;
    setGenerating(true);
    try {
      const isRefundable = setupFeeOption === "refundable";
      const detailsWithOptions = {
        ...clientDetails,
        minimumSpendTier: tierWithFee,
        setupFeeRefundable: isRefundable
      };
      await generateDocumentPDF(selectedDocument, detailsWithOptions);
      const { error } = await supabase.from("generated_documents").insert({
        document_type: selectedDocument,
        company_name: clientDetails.companyName,
        client_name_1: clientDetails.contactName,
        contact_title: clientDetails.contactTitle || null,
        address: clientDetails.address || null,
        city: clientDetails.city || null,
        state: clientDetails.state || null,
        zip: clientDetails.zip || null,
        email: clientDetails.email || null,
        phone: clientDetails.phone || null,
        client_name_2: clientDetails.contactName2 || null,
        contact_title_2: clientDetails.contactTitle2 || null,
        minimum_spend_tier: tierWithFee,
        setup_fee_refundable: isRefundable
      });
      if (error) throw error;
      toast({ title: "Success", description: "Document generated and downloaded successfully" });
      fetchHistory();
      setClientDetails({
        companyName: "",
        contactName: "",
        contactTitle: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        email: "",
        phone: "",
        contactName2: "",
        contactTitle2: ""
      });
      setSelectedDocument("master_agreement");
      setMinimumSpendTier("");
      setCustomMinimumAmount("");
      setCustomIntroAmount("");
      setCustomIntroMonths("3");
      setSetupFeeOption("");
      setSetupFeeAmount("500");
    } catch (error) {
      console.error("Error generating document:", error);
      toast({ title: "Error", description: error.message || "Failed to generate document", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };
  const handleRegenerate = async (doc) => {
    setGenerating(true);
    try {
      const details = {
        companyName: doc.company_name || doc.client_name_1 || "",
        contactName: doc.client_name_1 || "",
        contactTitle: doc.contact_title || "",
        address: doc.address || "",
        city: doc.city || "",
        state: doc.state || "",
        zip: doc.zip || "",
        email: doc.email || "",
        phone: doc.phone || "",
        contactName2: doc.client_name_2 || "",
        contactTitle2: doc.contact_title_2 || "",
        minimumSpendTier: doc.minimum_spend_tier || "250_then_500",
        setupFeeRefundable: doc.setup_fee_refundable ?? false
      };
      await generateDocumentPDF(doc.document_type, details);
      toast({ title: "Success", description: "Document regenerated and downloaded successfully" });
    } catch (error) {
      console.error("Error regenerating document:", error);
      toast({ title: "Error", description: error.message || "Failed to regenerate document", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  };
  const customAmountValid = minimumSpendTier !== "custom" || parseInt(customMinimumAmount, 10) >= 1;
  const customIntroValid = minimumSpendTier !== "custom" || customIntroAmount.trim() === "" || parseInt(customIntroAmount, 10) >= 1 && parseInt(customIntroMonths, 10) >= 1;
  const setupFeeValid = parseInt(setupFeeAmount, 10) >= 1;
  const isFormValid = selectedDocument && minimumSpendTier && customAmountValid && customIntroValid && setupFeeOption && setupFeeValid && clientDetails.companyName && clientDetails.contactName;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(FileText, { className: "h-6 w-6" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Document Generator" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Generate client service documents with automatic signatures" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
        selectedDocument && /* @__PURE__ */ jsxs("div", { className: "space-y-4 border rounded-lg p-4 bg-muted/30", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-sm uppercase tracking-wide text-muted-foreground", children: "Agreement Options" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Minimum Monthly Spend *" }),
              /* @__PURE__ */ jsxs(Select, { value: minimumSpendTier, onValueChange: (v) => {
                setMinimumSpendTier(v);
                if (v !== "custom") {
                  setCustomMinimumAmount("");
                  setCustomIntroAmount("");
                  setCustomIntroMonths("3");
                }
              }, children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select minimum spend tier" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: Object.entries(MINIMUM_SPEND_TIERS).map(([key, label]) => /* @__PURE__ */ jsx(SelectItem, { value: key, children: label }, key)) })
              ] }),
              minimumSpendTier === "custom" && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Intro Amount ($) — optional" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        placeholder: "e.g. 500",
                        value: customIntroAmount,
                        onChange: (e) => setCustomIntroAmount(e.target.value.replace(/[^0-9]/g, ""))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Intro Length (months)" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        placeholder: "3",
                        value: customIntroMonths,
                        onChange: (e) => setCustomIntroMonths(e.target.value.replace(/[^0-9]/g, "")),
                        disabled: customIntroAmount.trim() === ""
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Leave intro blank for no intro period. Months can be 2, 3, 4, etc." }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Ongoing Amount ($) — required after intro" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      placeholder: "e.g. 1000",
                      value: customMinimumAmount,
                      onChange: (e) => setCustomMinimumAmount(e.target.value.replace(/[^0-9]/g, ""))
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Whole dollars only." })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Account Setup Fee *" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxs(Select, { value: setupFeeOption, onValueChange: setSetupFeeOption, children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Type" }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: Object.entries(SETUP_FEE_OPTIONS).map(([key, label]) => /* @__PURE__ */ jsx(SelectItem, { value: key, children: label }, key)) })
                ] }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    placeholder: "500",
                    value: setupFeeAmount,
                    onChange: (e) => setSetupFeeAmount(e.target.value.replace(/[^0-9]/g, ""))
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Whole-dollar amount (default $500)." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 border rounded-lg p-4 bg-muted/30", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-sm uppercase tracking-wide text-muted-foreground", children: "Company Information" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "companyName", children: "Company/Business Name *" }),
            /* @__PURE__ */ jsx(Input, { id: "companyName", placeholder: "Enter company or business name", value: clientDetails.companyName, onChange: (e) => updateField("companyName", e.target.value) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "phone", children: "Phone" }),
            /* @__PURE__ */ jsx(Input, { id: "phone", placeholder: "(555) 123-4567", value: clientDetails.phone, onChange: (e) => updateField("phone", e.target.value) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 border rounded-lg p-4 bg-muted/30", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-sm uppercase tracking-wide text-muted-foreground", children: "Primary Contact" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "contactName", children: "Contact Name *" }),
              /* @__PURE__ */ jsx(Input, { id: "contactName", placeholder: "Full name of primary signer", value: clientDetails.contactName, onChange: (e) => updateField("contactName", e.target.value) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "contactTitle", children: "Title/Position" }),
              /* @__PURE__ */ jsx(Input, { id: "contactTitle", placeholder: "e.g., Owner, CEO, Manager", value: clientDetails.contactTitle, onChange: (e) => updateField("contactTitle", e.target.value) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
            /* @__PURE__ */ jsx(Input, { id: "email", type: "email", placeholder: "contact@company.com", value: clientDetails.email, onChange: (e) => updateField("email", e.target.value) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 border rounded-lg p-4 bg-muted/30", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-sm uppercase tracking-wide text-muted-foreground", children: "Secondary Contact (Optional)" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "contactName2", children: "Contact Name" }),
              /* @__PURE__ */ jsx(Input, { id: "contactName2", placeholder: "Full name of secondary signer", value: clientDetails.contactName2, onChange: (e) => updateField("contactName2", e.target.value) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "contactTitle2", children: "Title/Position" }),
              /* @__PURE__ */ jsx(Input, { id: "contactTitle2", placeholder: "e.g., Co-Owner, CFO", value: clientDetails.contactTitle2, onChange: (e) => updateField("contactTitle2", e.target.value) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: handleGenerate, disabled: generating || !isFormValid, className: "w-full md:w-auto", children: [
          /* @__PURE__ */ jsx(FileText, { className: "mr-2 h-4 w-4" }),
          generating ? "Generating..." : "Generate PDF"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Document History" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Last 10 generated documents" })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: loading ? /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center py-4", children: "Loading history..." }) : history.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center py-4", children: "No documents generated yet" }) : /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Date" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Document Type" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Company / Contact" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Options" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: history.map((doc) => {
          const parsed = parseTier(doc.minimum_spend_tier);
          return /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { children: formatDate(doc.generated_date) }),
            /* @__PURE__ */ jsx(TableCell, { children: DOCUMENT_TYPES[doc.document_type] }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: doc.company_name || doc.client_name_1 }),
              doc.company_name && doc.client_name_1 && /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: doc.client_name_1 })
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-xs", children: [
              /* @__PURE__ */ jsx("span", { children: formatMinimumTierLabel(doc.minimum_spend_tier) }),
              /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
                "Setup: $",
                parsed.setupFeeAmount.toLocaleString("en-US"),
                " ",
                doc.setup_fee_refundable ? "Refundable" : "Non-Refundable"
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleRegenerate(doc), disabled: generating, children: /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }) }) })
          ] }, doc.id);
        }) })
      ] }) })
    ] })
  ] });
};
export {
  DocumentGeneratorTab as default
};
