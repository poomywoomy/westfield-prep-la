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
}

const DOCUMENT_CONTENT = {
  master_agreement: {
    title: "CLIENT SERVICE AGREEMENT (MASTER AGREEMENT)",
    content: `This Client Service Agreement (the "Agreement") is entered into as of the Effective Date by and between Sathatham LLC dba Westfield Prep Center, a California limited liability company with its principal place of business in Los Angeles, California ("Westfield," "Service Provider," or "Company"), and the undersigned client ("Client").

Westfield and Client may be referred to individually as a "Party" and collectively as the "Parties."

1. SERVICES

1.1 Scope of Services
Westfield provides third-party logistics services strictly as requested by Client, which may include receiving, visual inspection, labeling, bundling, kitting, polybagging, storage, outbound fulfillment, preparation and forwarding of inventory to third-party fulfillment centers or carriers, and other ancillary logistics services agreed to in writing (collectively, the "Services").

1.2 No Fiduciary Relationship
The Parties acknowledge that Westfield acts solely as an independent logistics service provider. Nothing in this Agreement creates a partnership, joint venture, bailment beyond that imposed by law, or fiduciary relationship.

1.3 Written Instructions Required
All Services, shipping requests, and changes must be confirmed in writing and accepted by Westfield prior to performance. Verbal or informal instructions are not binding unless confirmed in writing by both Parties.

2. QUALITY CONTROL (COMPLIMENTARY)

2.1 Courtesy Quality Checks
Westfield may, at its discretion, perform complimentary visual and procedural checks during receiving, preparation, or outbound handling. Such checks are limited to external condition, labeling presence, carton counts where visible, and apparent conformity with written Client instructions.

2.2 QC Limitations
Quality control checks do not constitute product testing, internal quantity verification, regulatory compliance review, safety testing, or certification of merchantability, fitness for a particular purpose, or legal compliance.

2.3 No Expansion of Liability
Client acknowledges that complimentary quality checks are provided as a courtesy only and do not alter the allocation of risk, limitation of liability, or indemnification obligations under this Agreement.

3. CLIENT RESPONSIBILITIES AND REPRESENTATIONS

3.1 Accuracy of Information
Client represents and warrants that all product data, labeling information, SKU data, dimensions, weights, classifications, safety disclosures, and regulatory representations provided to Westfield are complete, accurate, and current.

3.2 Reliance
Westfield relies entirely on information supplied by Client and shall not be responsible for errors, delays, penalties, enforcement actions, losses, or damages arising from inaccurate, incomplete, or misleading information provided by Client.

3.3 Regulatory Compliance
Client retains sole responsibility for compliance with all applicable laws and regulations, including but not limited to FDA, USDA, FTC, CPSC, DOT, OSHA, state regulations, and marketplace requirements.

4. REGULATED AND HIGH-RISK GOODS

Client acknowledges that Westfield does not manufacture, formulate, test, certify, approve, or warrant Client products for regulatory or safety compliance. Services are strictly logistical in nature.

This provision applies without limitation to food, dietary supplements, cosmetics, hazardous materials, and any regulated or restricted goods.

5. FEES AND PAYMENT

5.1 Account Setup Fee
Prior to commencement of Services, Client shall pay a one-time, non-refundable account setup fee of Five Hundred U.S. Dollars ($500), which covers WMS account creation, system configuration, training, and ongoing technical support.

5.2 Invoices
All invoices are due upon receipt unless otherwise stated in writing.

5.3 Late Payments
Late payments accrue a five percent (5%) per-day late fee, capped at fifteen percent (15%) of the outstanding balance.

5.4 Suspension of Services
Westfield may suspend Services or withhold release of inventory until all outstanding balances are paid in full.

6. STORAGE AND ABANDONMENT

6.1 Storage Rates
Storage rates are quoted in writing and may vary based on volume, duration, or warehouse availability.

6.2 Excess Inventory
Client agrees to pay additional storage fees if inventory exceeds quoted volume.

6.3 Abandonment
If Client fails to pay outstanding balances or provide shipping instructions, Westfield shall provide written notice of intent to dispose. If Client fails to cure within thirty (30) calendar days, Westfield may dispose of, liquidate, or repurpose inventory without liability to Client.

7. RISK OF LOSS AND CARRIERS

7.1 Risk Transfer
Title and risk of loss transfer to Client upon carrier pickup from Westfield's facility.

7.2 Third-Party Carriers and Platforms
Westfield bears no responsibility for loss, damage, delays, misdelivery, or discrepancies occurring after goods leave its custody, including discrepancies reported by Amazon, TikTok, Walmart, Shopify, or other platforms.

8. INSURANCE

Client is solely responsible for maintaining any desired cargo, inventory, product liability, recall, or regulatory insurance coverage applicable to its goods. Westfield strongly encourages Client to maintain such insurance throughout the term of this Agreement.

Proof of insurance may be requested upon reasonable notice.

9. LIMITATION OF LIABILITY

9.1 Liability Cap
To the maximum extent permitted by law, Service Provider's total cumulative liability arising out of or relating to this Agreement or the Services shall not exceed the total fees actually paid by Client to Service Provider for Services rendered during the sixty (60) days immediately preceding the event giving rise to the claim.

9.2 Excluded Damages
In no event shall Service Provider be liable for indirect, incidental, consequential, special, or lost-profit damages.

9.3 Negligence Standard
This limitation applies to all claims except to the extent caused by Service Provider's gross negligence or willful misconduct.

10. ASSUMPTION OF RISK AND RELEASE

Client acknowledges that logistics services involve inherent risks of delay, loss, damage, miscounts, and platform discrepancies. Client voluntarily assumes all such risks.

Client releases and waives all claims against Westfield arising from the Services, except as prohibited by law.

11. INDEMNIFICATION

Client agrees to indemnify, defend, and hold harmless Westfield and its owners, members, employees, and agents from all claims, damages, liabilities, costs, and expenses (including attorneys' fees) arising from:

- Client's products
- Regulatory non-compliance
- Intellectual property claims
- Inaccurate information provided by Client
- Client's breach of this Agreement

This obligation survives termination.

12. BAILMENT LIMITATION

To the extent any bailment is deemed to exist by operation of law, such bailment shall be limited solely to the exercise of reasonable care consistent with generally accepted third-party logistics industry standards.

13. DISPUTE RESOLUTION

13.1 Governing Law
This Agreement is governed by the laws of the State of California.

13.2 Arbitration
Any dispute shall be resolved by binding arbitration in Los Angeles County, California.

13.3 Class Action Waiver
All claims must be brought on an individual basis only. Class, collective, representative, or private attorney general actions are expressly waived.

14. TERM AND TERMINATION

This Agreement remains in effect until terminated by either Party upon thirty (30) days' written notice. Westfield may terminate or suspend Services immediately for non-payment or material breach.

15. MISCELLANEOUS

15.1 Independent Contractor
Westfield is an independent contractor.

15.2 No Oral Modifications
No oral statements or course of dealing shall modify this Agreement.

15.3 Severability
If any provision is unenforceable, the remainder remains in effect.

15.4 Entire Agreement
This Agreement constitutes the entire agreement between the Parties and supersedes all prior agreements.

16. EXECUTION

This Agreement may be executed electronically and in counterparts.`
  }
};

export const generateDocumentPDF = async (
  documentType: string,
  clientDetails: ClientDetails
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

  // Add logo (centered)
  const logoWidth = 40;
  const logoHeight = 16;
  doc.addImage(westfieldLogo, "JPEG", (pageWidth - logoWidth) / 2, 8, logoWidth, logoHeight);

  // Add title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(content.title, maxWidth);
  let yPosition = 30;
  titleLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 6;
  });

  // Add date
  const today = new Date();
  const formattedDate = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  yPosition += 4;
  doc.text(`Effective Date: ${formattedDate}`, pageWidth / 2, yPosition, { align: "center" });

  // Add content with hierarchical font sizes
  yPosition += 10;
  const lines = doc.splitTextToSize(content.content, maxWidth);
  
  // Regex patterns for section detection
  const mainSectionPattern = /^\d+\.\s+[A-Z]/;
  const subsectionPattern = /^\d+\.\d+\s+/;
  
  lines.forEach((line: string) => {
    // Check for page break
    if (yPosition > pageHeight - 25) {
      doc.addPage();
      yPosition = margin;
    }
    
    // Determine line type and apply appropriate styling
    if (mainSectionPattern.test(line)) {
      // Main section header (e.g., "1. SERVICES")
      yPosition += 4; // Extra space before main sections
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(line, margin, yPosition);
      yPosition += 6;
    } else if (subsectionPattern.test(line)) {
      // Subsection header (e.g., "1.1 Scope of Services")
      yPosition += 2; // Small extra space before subsections
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(line, margin, yPosition);
      yPosition += 5;
    } else {
      // Body text
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(line, margin, yPosition);
      yPosition += 4.5;
    }
  });

  // Add signature section
  yPosition += 20;
  
  // Check if we need a new page for signatures
  if (yPosition > pageHeight - 120) {
    doc.addPage();
    yPosition = margin + 10;
  }

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("SIGNATURES", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 15;

  // Store the starting Y position for both columns
  const signatureStartY = yPosition;

  // Left column - Service Provider
  const leftX = margin;
  const rightX = pageWidth / 2 + 10;
  
  let leftY = signatureStartY;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("SERVICE PROVIDER:", leftX, leftY);
  leftY += 6;
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Sathatham LLC dba Westfield Prep Center", leftX, leftY);
  leftY += 12;

  doc.text("Signature:", leftX, leftY);
  doc.line(leftX + 20, leftY, leftX + 80, leftY);
  leftY += 10;

  doc.text("Name:", leftX, leftY);
  doc.line(leftX + 15, leftY, leftX + 80, leftY);
  leftY += 10;

  doc.text("Title:", leftX, leftY);
  doc.line(leftX + 12, leftY, leftX + 80, leftY);
  leftY += 10;

  doc.text("Date:", leftX, leftY);
  doc.line(leftX + 12, leftY, leftX + 80, leftY);

  // Right column - Client
  let rightY = signatureStartY;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENT:", rightX, rightY);
  rightY += 6;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  
  // Display company name
  doc.text(clientDetails.companyName, rightX, rightY);
  rightY += 5;

  // Display address if provided
  if (clientDetails.address) {
    doc.text(clientDetails.address, rightX, rightY);
    rightY += 5;
  }

  // Display city, state, zip if provided
  const cityStateZip = [
    clientDetails.city,
    clientDetails.state,
    clientDetails.zip
  ].filter(Boolean).join(", ");
  if (cityStateZip) {
    doc.text(cityStateZip, rightX, rightY);
    rightY += 5;
  }

  rightY += 7;

  doc.text("Signature:", rightX, rightY);
  doc.line(rightX + 20, rightY, rightX + 80, rightY);
  rightY += 10;

  doc.text("Name:", rightX, rightY);
  // Pre-fill contact name if provided
  if (clientDetails.contactName) {
    doc.text(clientDetails.contactName, rightX + 15, rightY);
  }
  doc.line(rightX + 15, rightY, rightX + 80, rightY);
  rightY += 10;

  doc.text("Title:", rightX, rightY);
  // Pre-fill title if provided
  if (clientDetails.contactTitle) {
    doc.text(clientDetails.contactTitle, rightX + 12, rightY);
  }
  doc.line(rightX + 12, rightY, rightX + 80, rightY);
  rightY += 10;

  // Email line
  if (clientDetails.email) {
    doc.text("Email:", rightX, rightY);
    doc.text(clientDetails.email, rightX + 14, rightY);
    rightY += 10;
  }

  doc.text("Date:", rightX, rightY);
  doc.line(rightX + 12, rightY, rightX + 80, rightY);

  // If there's a second client contact, add another signature block
  if (clientDetails.contactName2) {
    rightY += 20;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("CLIENT (2):", rightX, rightY);
    rightY += 6;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(clientDetails.companyName, rightX, rightY);
    rightY += 12;

    doc.text("Signature:", rightX, rightY);
    doc.line(rightX + 20, rightY, rightX + 80, rightY);
    rightY += 10;

    doc.text("Name:", rightX, rightY);
    doc.text(clientDetails.contactName2, rightX + 15, rightY);
    doc.line(rightX + 15, rightY, rightX + 80, rightY);
    rightY += 10;

    doc.text("Title:", rightX, rightY);
    if (clientDetails.contactTitle2) {
      doc.text(clientDetails.contactTitle2, rightX + 12, rightY);
    }
    doc.line(rightX + 12, rightY, rightX + 80, rightY);
    rightY += 10;

    doc.text("Date:", rightX, rightY);
    doc.line(rightX + 12, rightY, rightX + 80, rightY);
  }

  // Save the PDF
  const fileName = `Client_Service_Agreement_Master_Agreement_${formattedDate.replace(/\//g, "-")}.pdf`;
  doc.save(fileName);
};
