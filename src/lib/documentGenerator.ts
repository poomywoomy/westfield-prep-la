import jsPDF from "jspdf";
import westfieldLogo from "@/assets/westfield-logo-pdf.jpg";

const DOCUMENT_CONTENT = {
  csa: {
    title: "CLIENT SERVICE AGREEMENT (CSA)",
    content: `This Client Service Agreement ("Agreement") is entered into by and between:

Sathatham LLC dba Westfield Prep Center, a California limited liability company with its principal place of business located at 1801 Flower Ave, Duarte, CA 91010, hereinafter referred to as "Service Provider," "Westfield," or "Company", and the undersigned client, hereinafter referred to as "Client."

Collectively, the Company and Client may be referred to as the "Parties" and individually as a "Party."

1. RECITALS

WHEREAS, Westfield is engaged in the business of receiving, inspecting, labeling, bundling, packaging, storing, and forwarding products to fulfillment centers and/or end customers;
WHEREAS, Client desires to engage Westfield to perform such services under the terms and conditions set forth herein;
NOW, THEREFORE, in consideration of the mutual covenants, obligations, and undertakings set forth herein, the Parties agree as follows:

2. SERVICES PROVIDED

Westfield shall provide, as requested by Client, one or more of the following services ("Services"):
(a) Receiving of cartons, pallets, or other shipments;
(b) Inspection and quality verification;
(c) FNSKU labeling, polybagging, kitting, or bundling;
(d) Storage of goods, by shelf or cubic-foot basis;
(e) Self-fulfillment handling and outbound shipments;
(f) Preparation and forwarding of inventory to third-party fulfillment centers (including but not limited to Amazon, TikTok, Walmart, Shopify, or similar platforms);
(g) Other ancillary services as may be mutually agreed upon in writing.

All Services shall be rendered at the discretion of Westfield and in accordance with its internal operational policies and the attached Terms and Conditions Addendum (Exhibit A).

3. PAYMENT TERMS

3.1 Invoices and Deposit.
Client shall be invoiced on a pay-as-you-go basis, with a non-refundable deposit due at the start of each month. All invoices are due upon receipt unless otherwise stated in writing.

3.2 Late Payment.
Late payments shall accrue a 5% per day late fee, capped at 15% of the total outstanding balance, until payment is received in full.

3.3 Method of Payment.
Payments shall be made in U.S. dollars via approved methods (ACH, wire, Zelle, or such other method designated by Westfield).

3.4 Chargebacks and Returns.
Client shall be solely responsible for all return costs, FBA removal order costs, and chargebacks associated with inventory shipped or fulfilled under this Agreement.

4. TERM AND TERMINATION

4.1 Term.
This Agreement shall commence upon execution by both Parties and remain in full force and effect unless terminated in accordance with Section 4.2.

4.2 Termination.
Either Party may terminate this Agreement with sixty (60) days' prior written notice. Termination shall not relieve Client of any outstanding financial obligations, including unpaid invoices or storage fees.

4.3 Early Termination by Westfield.
Westfield reserves the right to suspend or terminate Services immediately if Client fails to pay, violates operational procedures, or engages in conduct deemed harmful to Westfield's business interests.

5. STORAGE AND INVENTORY

5.1 Storage Charges.
Storage fees shall be based on the rate quoted at the time of agreement. Client agrees to pay for any additional cubic-foot or shelf space required if inventory exceeds the allocated volume.

5.2 Quote Adjustment.
All storage quotes are subject to change based on volume, duration, or warehouse availability. Client may request a quote reevaluation when increasing storage volume.

5.3 Abandonment and Disposal.
In the event of nonpayment or failure to retrieve inventory, Westfield shall issue a written notice of intent to dispose. Fifteen (15) days after such notice, if unresolved, Westfield may dispose of, liquidate, or repurpose the goods without liability to Client.

6. LIMITATION OF LIABILITY

6.1 Risk of Loss.
Title and risk of loss shall pass to Client once inventory leaves Westfield's possession or control. Westfield shall bear no liability for damage, delay, or loss occurring during transit handled by third-party carriers.

6.2 Insurance.
Westfield maintains internal insurance coverage; however, Client acknowledges and agrees that Westfield shall have no obligation to disclose policy details, nor shall such coverage extend to Client's inventory or claims.

6.3 No Liability for Amazon or Platform Discrepancies.
Client acknowledges that fulfillment platforms (including Amazon) frequently record receiving discrepancies. Westfield assumes no responsibility or liability for such discrepancies once inventory has left its facility.

7. CONFIDENTIALITY

Both Parties agree to maintain confidentiality regarding each other's business operations, supplier information, pricing, and related data. Such obligations survive termination of this Agreement.

8. INDEPENDENT CONTRACTOR STATUS

Westfield is and shall remain an independent contractor. Nothing herein shall be construed as creating a partnership, joint venture, or employment relationship.

9. GOVERNING LAW AND DISPUTE RESOLUTION

9.1 Governing Law.
This Agreement shall be governed by and construed under the laws of the State of California.

9.2 Venue.
Exclusive venue and jurisdiction shall lie in Los Angeles County, California.

9.3 Arbitration.
Any dispute or claim arising out of or relating to this Agreement shall be resolved by binding arbitration in Los Angeles County, pursuant to the rules of the American Arbitration Association. Judgment upon the arbitration award may be entered in any court of competent jurisdiction.

10. ENTIRE AGREEMENT

This Agreement, together with the Terms & Conditions Addendum (Exhibit A) and the Liability Waiver & Hold Harmless Agreement (Exhibit B), constitutes the entire understanding between the Parties and supersedes any prior representations, discussions, or agreements.

11. EXECUTION AND ELECTRONIC SIGNATURES

This Agreement may be executed in counterparts and by electronic means, including digital or typed signature. Each executed counterpart shall be deemed an original, and all together shall constitute one and the same instrument.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the dates set forth below.

SERVICE PROVIDER:
Sathatham LLC dba Westfield Prep Center
1801 Flower Ave, Duarte, CA 91010
Email: info@westfieldprepcenter.com
Phone: (818) 935-5478`
  },
  exhibit_a: {
    title: "EXHIBIT A — TERMS AND CONDITIONS ADDENDUM",
    content: `This Terms and Conditions Addendum ("Addendum") is incorporated by reference into and made part of the Client Service Agreement ("Agreement") executed between Sathatham LLC dba Westfield Prep Center ("Westfield" or "Service Provider") and the Client.
Capitalized terms not otherwise defined herein shall have the meaning assigned in the Agreement.

1. SCOPE OF SERVICES

1.1 Westfield shall furnish only those Services expressly requested and accepted in writing by Westfield.
1.2 Client acknowledges that all handling, storage, and forwarding are performed solely for logistical convenience and do not constitute bailment, warehouse receipt, or fiduciary obligation beyond those expressly stated herein.
1.3 Any modification or additional task must be confirmed by written instruction from Client and written acceptance by Westfield prior to performance.

2. RECEIVING AND INSPECTION

2.1 Client shall ensure all inbound shipments include clear purchase order numbers, SKU lists, and carton counts.
2.2 Westfield will visually inspect received goods for external damage only; no guarantee of internal condition, quantity, or conformity is made absent a separately purchased quality-control service.
2.3 Westfield may reject any shipment that arrives damaged, improperly labeled, or otherwise non-compliant with its facility standards. Rejected shipments shall be held or returned at Client's sole expense.

3. LABELING AND PREPARATION

3.1 Client shall supply accurate product data for FNSKU labeling, bundling, and polybagging.
3.2 Westfield shall not be liable for rejection, penalty, or performance issues resulting from incorrect, incomplete, or outdated information supplied by Client.
3.3 Where Client elects to provide pre-printed labels, Westfield shall have no duty to verify label accuracy.

4. SHIPPING AND CARRIERS

4.1 All outbound shipping labels must either be (a) generated through Client's authorized shipping account with user access granted to Westfield, or (b) transmitted electronically by Client to Westfield prior to dispatch.
4.2 Client assumes full responsibility for payment of postage, carrier charges, and surcharges.
4.3 Risk of loss transfers to Client upon carrier pickup from Westfield's facility.
4.4 Westfield shall not be responsible for any delay, misdelivery, damage, or loss occurring while goods are in the possession of any carrier, including but not limited to UPS, FedEx, USPS, or Amazon Partnered Carrier.

5. STORAGE TERMS

5.1 Storage rates are established by written quote at the time of engagement and may vary by shelf, pallet, or cubic-foot measurement.
5.2 Client expressly agrees to pay the rate stated on the current quote; rates are subject to reasonable revision upon thirty (30) days' written notice.
5.3 If Client's inventory exceeds the volume originally contracted, Client shall pay the additional cubic-foot storage required unless separate storage space is prepaid.
5.4 If Client requests "exclusive shelf" or "permanent" storage, such space shall remain reserved only while Client maintains a positive account balance and current deposit.

6. PAYMENT AND FEES

6.1 Invoices are payable upon receipt.
6.2 A 5 percent (5%) per-day late fee shall accrue on overdue balances, capped at fifteen percent (15%) of the total outstanding amount.
6.3 Westfield may suspend performance or withhold release of inventory until all outstanding sums are paid in full.
6.4 Returned-payment or chargeback fees shall be borne entirely by Client.

7. ABANDONMENT AND DISPOSAL

7.1 Should Client fail to pay outstanding balances or provide shipping instructions, Westfield shall issue a Written Notice of Intent to Dispose via electronic mail to the Client's last known address.
7.2 If Client fails to cure default or retrieve goods within fifteen (15) calendar days of such notice, Westfield may, in its sole discretion, dispose of, liquidate, or repurpose the inventory.
7.3 Client waives any claim for damages or proceeds arising from such disposition.

8. LIMITATION OF LIABILITY

8.1 Except for gross negligence or willful misconduct, Westfield's aggregate liability under this Addendum and the Agreement shall not exceed the lesser of (a) the amount actually paid by Client for the specific Service giving rise to the claim, or (b) one hundred U.S. dollars ($100).
8.2 Westfield shall not be liable for indirect, incidental, consequential, or special damages, including lost profits or marketplace penalties.
8.3 Client acknowledges the inherent risk of inventory count discrepancies at fulfillment centers and agrees that Westfield bears no responsibility once shipments depart its facility.

9. COMMUNICATION AND APPROVALS

9.1 All service orders, shipment requests, and changes must be confirmed in writing (email or approved portal message).
9.2 Verbal or text-message instructions shall not bind Westfield unless confirmed in writing by both Parties.
9.3 Westfield shall not be deemed in breach for any delay arising from incomplete or ambiguous Client instructions.

10. CONFIDENTIALITY AND DATA PROTECTION

10.1 Each Party shall hold the other's confidential or proprietary information in strict confidence and use it solely for purposes of performance under the Agreement.
10.2 Westfield shall take commercially reasonable steps to safeguard Client information stored electronically or physically within its facility.
10.3 This duty survives termination for a period of five (5) years.

11. FORCE MAJEURE

Neither Party shall be liable for failure or delay in performance due to causes beyond its reasonable control, including but not limited to natural disasters, labor strikes, governmental actions, pandemics, power failures, transportation disruptions, or system outages. Performance shall resume as soon as practicable following cessation of the force-majeure event.

12. NO GUARANTEE OF PLATFORM PERFORMANCE

Client acknowledges that Westfield provides logistical support only and does not guarantee any particular sales result, listing approval, or account status with Amazon, TikTok, Walmart, or any other e-commerce platform. Westfield shall not be responsible for enforcement actions, suspensions, or metrics resulting from Client's listings or fulfillment data.

13. NOTICES

All notices required or permitted hereunder shall be in writing and deemed duly given (a) upon personal delivery, (b) three (3) days after mailing by certified mail, return receipt requested, or (c) upon confirmation of transmission by electronic mail to: info@westfieldprepcenter.com (Service Provider) and to the Client's last known email address of record.

14. SEVERABILITY AND SURVIVAL

If any provision of this Addendum is held invalid or unenforceable, the remaining provisions shall continue in full force and effect. Sections concerning payment obligations, limitation of liability, confidentiality, and dispute resolution shall survive termination.

15. INCORPORATION BY REFERENCE

This Addendum forms an integral part of the Agreement. In the event of conflict, the terms of the Agreement shall govern, except where this Addendum expressly provides a more specific operational rule.

EXECUTION

IN WITNESS WHEREOF, the Parties acknowledge and accept these Terms and Conditions as of the Effective Date of the Agreement.

SERVICE PROVIDER:
Sathatham LLC dba Westfield Prep Center
1801 Flower Ave, Duarte, CA 91010
info@westfieldprepcenter.com
(818) 935-5478`
  },
  exhibit_b: {
    title: "EXHIBIT B — LIABILITY WAIVER AND HOLD HARMLESS AGREEMENT",
    content: `This Liability Waiver and Hold Harmless Agreement ("Agreement") is entered into as of the Effective Date of the Client Service Agreement by and between:

Sathatham LLC dba Westfield Prep Center, a California limited liability company, with its principal place of business located at 1801 Flower Ave, Duarte, CA 91010 (hereinafter referred to as "Westfield" or "Service Provider"), and the undersigned client ("Client"), individually and collectively referred to as the "Parties."

1. PURPOSE AND SCOPE

This Agreement supplements the Client Service Agreement and Terms and Conditions Addendum, and is intended to release, indemnify, and hold harmless Westfield, its owners (Navapoom Sathatham and Yessica Michell Chiguichon), employees, agents, and subcontractors from and against any and all claims, demands, losses, liabilities, damages, or causes of action, whether known or unknown, arising from or related to the handling, storage, preparation, shipment, or other treatment of Client's goods, except to the limited extent expressly stated herein.

2. ASSUMPTION OF RISK

2.1 Client expressly acknowledges that inventory handling, third-party fulfillment, and shipping carry inherent risks of delay, loss, damage, or misdelivery, and that fulfillment platforms (including but not limited to Amazon, TikTok, Walmart, and similar entities) may record inventory discrepancies not attributable to Westfield.
2.2 Client voluntarily assumes all such risks and agrees that Westfield shall bear no responsibility for any loss occurring after goods have left Westfield's physical custody or control.

3. RELEASE AND WAIVER OF CLAIMS

3.1 Client hereby irrevocably releases, waives, and discharges Westfield, Sathatham LLC, Navapoom Sathatham, Yessica Michell Chiguichon, and their respective officers, members, employees, contractors, and assigns (collectively, "Released Parties") from any and all claims, demands, causes of action, damages, or liabilities of any kind, whether in contract, tort, or otherwise, arising out of or relating to:

(a) loss, theft, damage, or destruction of goods while stored, processed, or in transit;

(b) delays in shipment or delivery;

(c) mislabeling, miscounts, or discrepancies reported by fulfillment platforms;

(d) loss of profits, revenue, or business opportunities;

(e) product defects or manufacturing issues beyond Westfield's control; and

(f) any indirect, incidental, consequential, or special damages whatsoever.

3.2 This waiver shall apply whether caused by negligence (ordinary, passive, or active) or otherwise of the Released Parties, to the fullest extent permitted by California law.

4. INDEMNIFICATION

Client agrees to indemnify, defend, and hold harmless the Released Parties from and against any and all claims, damages, expenses, or liabilities (including reasonable attorney's fees and costs) arising out of or connected with:

(a) Client's breach of the Client Service Agreement or this Agreement;

(b) Client's failure to comply with applicable shipping, labeling, or marketplace regulations;

(c) third-party claims relating to Client's products, intellectual property, or business operations; and

(d) injuries or damages to persons or property caused by Client's products or conduct.

This obligation shall survive termination of the Agreement.

5. LIMITATION OF LIABILITY

5.1 Notwithstanding any provision to the contrary, the total cumulative liability of Westfield and all Released Parties for any and all claims arising under this Agreement shall not exceed the lesser of:

(a) the total amount paid by Client for the specific service giving rise to such claim; or

(b) one hundred U.S. dollars ($100).

5.2 Westfield expressly disclaims all implied warranties, including any implied warranty of merchantability, fitness for a particular purpose, or non-infringement.

6. THIRD-PARTY CARRIERS AND PLATFORM DISCREPANCIES

Client acknowledges that Westfield has no control over and assumes no liability for the performance or conduct of third-party carriers or fulfillment platforms. Any claim for loss or damage occurring after the carrier takes possession must be pursued directly with such carrier or platform, and not against Westfield.

7. NO GUARANTEE OR WARRANTY

Client acknowledges that Westfield provides logistics services only and does not guarantee account reinstatement, listing approval, delivery times, or sales performance on any platform. Any reference to "expected delivery" or similar phrase is an estimate only.

8. GOVERNING LAW AND VENUE

This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to conflict-of-laws principles. Venue for any dispute arising hereunder shall lie exclusively in Los Angeles County, California, and the Parties agree to resolve such disputes by binding arbitration as provided in the primary Client Service Agreement.

9. SEVERABILITY

If any provision of this Agreement is held invalid or unenforceable, the remaining provisions shall remain in full force and effect. The invalid provision shall be replaced by a valid one that most closely reflects the Parties' original intent.

10. ENTIRE AGREEMENT

This Agreement, together with the Client Service Agreement and Terms and Conditions Addendum, constitutes the entire understanding between the Parties with respect to the subject matter hereof and supersedes any prior or contemporaneous communications or agreements, whether oral or written.

11. ACKNOWLEDGMENT OF UNDERSTANDING

Client affirms that they have read this entire Agreement, understand its terms, and voluntarily sign it, acknowledging that it is intended to be a legally binding release of liability to the maximum extent permitted by law.

12. EXECUTION

Executed as of the same Effective Date as the Client Service Agreement.

SERVICE PROVIDER:
Sathatham LLC dba Westfield Prep Center
1801 Flower Ave, Duarte, CA 91010
info@westfieldprepcenter.com
(818) 935-5478`
  }
};

export const generateDocumentPDF = async (
  documentType: string,
  clientName1: string,
  clientName2?: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxWidth = pageWidth - 2 * margin;
  
  const content = DOCUMENT_CONTENT[documentType as keyof typeof DOCUMENT_CONTENT];
  if (!content) {
    throw new Error("Invalid document type");
  }

  // Add logo (smaller)
  const logoWidth = 30;
  const logoHeight = 12;
  doc.addImage(westfieldLogo, "JPEG", (pageWidth - logoWidth) / 2, 8, logoWidth, logoHeight);

  // Add title (closer to logo)
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(content.title, maxWidth);
  let yPosition = 25;
  titleLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 6;
  });

  // Add date
  const today = new Date();
  const formattedDate = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  yPosition += 3;
  doc.text(`Date: ${formattedDate}`, pageWidth / 2, yPosition, { align: "center" });

  // Add content (tighter line spacing)
  yPosition += 8;
  doc.setFontSize(9);
  const lines = doc.splitTextToSize(content.content, maxWidth);
  
  lines.forEach((line: string) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = margin;
    }
    doc.text(line, margin, yPosition);
    yPosition += 4;
  });

  // Add signature section on new page
  doc.addPage();
  yPosition = margin + 10;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("SIGNATURES", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 12;

  // Left column - Service Provider signatures
  const leftX = margin;
  const rightX = pageWidth / 2 + 5;
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("SERVICE PROVIDER:", leftX, yPosition);
  yPosition += 8;

  doc.setFont("helvetica", "normal");
  doc.line(leftX, yPosition, leftX + 70, yPosition);
  yPosition += 4;
  doc.text("Navapoom Sathatham", leftX, yPosition);
  yPosition += 3;
  doc.text("Co-Owner, Westfield Prep Center", leftX, yPosition);
  yPosition += 3;
  doc.text("DBA Sathatham LLC", leftX, yPosition);
  yPosition += 12;

  doc.line(leftX, yPosition, leftX + 70, yPosition);
  yPosition += 4;
  doc.text("Yessica Michell Chiguichon", leftX, yPosition);
  yPosition += 3;
  doc.text("Co-Owner, Westfield Prep Center", leftX, yPosition);
  yPosition += 3;
  doc.text("DBA Sathatham LLC", leftX, yPosition);

  // Right column - Client signatures
  yPosition = margin + 22;
  doc.setFont("helvetica", "bold");
  doc.text("CLIENT:", rightX, yPosition);
  yPosition += 8;

  doc.setFont("helvetica", "normal");
  doc.line(rightX, yPosition, rightX + 70, yPosition);
  yPosition += 4;
  doc.text(clientName1, rightX, yPosition);
  yPosition += 12;

  if (clientName2) {
    doc.line(rightX, yPosition, rightX + 70, yPosition);
    yPosition += 4;
    doc.text(clientName2, rightX, yPosition);
  }

  // Save the PDF
  const fileName = `${content.title.replace(/[^a-zA-Z0-9]/g, "_")}_${formattedDate.replace(/\//g, "-")}.pdf`;
  doc.save(fileName);
};