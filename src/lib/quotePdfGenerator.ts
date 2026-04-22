import jsPDF from "jspdf";

const NAVY = { r: 13, g: 33, b: 66 };
const ACCENT_GRAY = { r: 245, g: 245, b: 248 };
const MEDIUM_GRAY = { r: 120, g: 120, b: 120 };

const STORAGE_BILLING_NOTES: Record<string, string> = {
  "Small Bin Storage": "Per small bin, per month",
  "Medium Bin Storage": "Per medium bin, per month",
  "Large Bin Storage": "Per large bin, per month",
  "Pallet Storage": "Per pallet, per month",
  "Shelf Storage": "Per shelf, per month"
};

const PALLET_PREFIX = "The minimum monthly payment is dictated by the stored pallet amount. ";
const EXCLUSION_SUFFIX = " Shipping costs, carton usage fees, and polybag usage fees are excluded from this calculation.";

const MINIMUM_SPEND_TEXT: Record<string, string> = {
  "250_then_500": "Client agrees to a minimum monthly service spend of $250.00 per month for the first three (3) months, increasing to $500.00 per month thereafter.",
  "500": "Client agrees to a minimum monthly service spend of $500.00 per month.",
  "500_flat": "Client agrees to a minimum monthly service spend of $500.00 per month.",
  "1000": "Client agrees to a minimum monthly service spend of $1,000.00 per month.",
  "1000_flat": "Client agrees to a minimum monthly service spend of $1,000.00 per month.",
};

function getMinimumSpendText(tier: string): string | null {
  if (tier.startsWith("custom:")) {
    const payload = tier.slice(7);
    if (payload.includes("_then_")) {
      const [introStr, ongoingStr] = payload.split("_then_");
      const intro = parseInt(introStr, 10);
      const ongoing = parseInt(ongoingStr, 10);
      if (!intro || intro < 1 || !ongoing || ongoing < 1) return null;
      return `${PALLET_PREFIX}Client agrees to a minimum monthly service spend of $${intro.toLocaleString("en-US")}.00 per month for the first three (3) months, increasing to $${ongoing.toLocaleString("en-US")}.00 per month thereafter.${EXCLUSION_SUFFIX}`;
    }
    const amount = parseInt(payload, 10);
    if (!amount || amount < 1) return null;
    const formatted = amount.toLocaleString("en-US");
    return `${PALLET_PREFIX}Client agrees to a minimum monthly service spend of $${formatted}.00 per month.${EXCLUSION_SUFFIX}`;
  }
  const base = MINIMUM_SPEND_TEXT[tier];
  if (!base) return null;
  return `${PALLET_PREFIX}${base}${EXCLUSION_SUFFIX}`;
}

interface QuotePDFData {
  clientName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  date: string;
  standardOperations?: Array<{ service_name: string; service_price: number; notes?: string }>;
  fulfillmentSections?: Array<{ type: string; items: Array<{ service_name: string; service_price: number; notes?: string }> }>;
  teamQuoteItems?: Array<{ service_name: string; service_price: number; notes?: string }>;
  additionalComments?: string;
  minimumSpendTier?: string;
  isTeamQuote?: boolean;
}

function checkPageBreak(doc: jsPDF, y: number, threshold: number = 270): number {
  if (y > threshold) {
    doc.addPage();
    return 20;
  }
  return y;
}

function drawSectionHeader(doc: jsPDF, title: string, subtitle: string, y: number): number {
  y = checkPageBreak(doc, y, 260);

  // Navy accent bar
  doc.setFillColor(NAVY.r, NAVY.g, NAVY.b);
  doc.rect(20, y - 1, 3, 8, 'F');

  doc.setFontSize(12);
  doc.setFont(undefined!, 'bold');
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text(title, 26, y + 5);
  y += 10;

  if (subtitle) {
    doc.setFontSize(8);
    doc.setFont(undefined!, 'normal');
    doc.setTextColor(MEDIUM_GRAY.r, MEDIUM_GRAY.g, MEDIUM_GRAY.b);
    doc.text(subtitle, 26, y);
    y += 5;
  }

  // Table header row
  doc.setFillColor(ACCENT_GRAY.r, ACCENT_GRAY.g, ACCENT_GRAY.b);
  doc.rect(20, y, 170, 7, 'F');
  doc.setFontSize(8);
  doc.setFont(undefined!, 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text("SERVICE", 24, y + 5);
  doc.text("PRICE", 175, y + 5, { align: "right" });
  y += 10;

  return y;
}

function drawServiceItem(doc: jsPDF, item: { service_name: string; service_price: number; notes?: string }, y: number): number {
  y = checkPageBreak(doc, y);

  doc.setFontSize(10);
  doc.setFont(undefined!, 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text(item.service_name, 24, y);
  doc.text(`$${item.service_price.toFixed(2)}`, 175, y, { align: "right" });
  y += 5;

  // Billing note
  const billingNote = STORAGE_BILLING_NOTES[item.service_name];
  if (billingNote) {
    doc.setFontSize(7.5);
    doc.setFont(undefined!, 'normal');
    doc.setTextColor(MEDIUM_GRAY.r, MEDIUM_GRAY.g, MEDIUM_GRAY.b);
    doc.text(billingNote, 28, y);
    y += 4;
  }

  // Notes
  if (item.notes) {
    doc.setFontSize(7.5);
    doc.setFont(undefined!, 'normal');
    doc.setTextColor(100, 100, 100);
    const splitNotes = doc.splitTextToSize(item.notes, 145);
    doc.text(splitNotes, 28, y);
    y += (splitNotes.length * 3.5) + 1;
  }

  // Light separator line
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.2);
  doc.line(24, y + 1, 186, y + 1);
  y += 4;

  return y;
}

export async function generateQuotePDF(data: QuotePDFData, logoSrc: string): Promise<jsPDF> {
  const doc = new jsPDF();

  // Load logo
  const img = new Image();
  img.src = logoSrc;
  await new Promise((resolve) => { img.onload = resolve; });

  // ── Navy header banner ──
  doc.setFillColor(NAVY.r, NAVY.g, NAVY.b);
  doc.rect(0, 0, 210, 42, 'F');

  // Logo on white circle effect - just place it
  const logoWidth = 28;
  const logoHeight = (img.height / img.width) * logoWidth;
  doc.addImage(img, 'JPEG', 16, 7, logoWidth, logoHeight);

  // Title text in banner
  doc.setFontSize(20);
  doc.setFont(undefined!, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text("SERVICE QUOTE", 105, 22, { align: "center" });

  doc.setFontSize(9);
  doc.setFont(undefined!, 'normal');
  doc.setTextColor(200, 210, 230);
  doc.text("Westfield Prep Center  |  Los Angeles, CA", 105, 30, { align: "center" });

  // ── Info section with gray background ──
  const infoY = 48;
  doc.setFillColor(ACCENT_GRAY.r, ACCENT_GRAY.g, ACCENT_GRAY.b);
  doc.roundedRect(15, infoY, 180, 32, 2, 2, 'F');

  // Left - Business info
  doc.setFontSize(9);
  doc.setFont(undefined!, 'bold');
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text("FROM", 22, infoY + 7);
  doc.setFont(undefined!, 'normal');
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(9);
  doc.text("Westfield Prep Center", 22, infoY + 13);
  doc.text("Navapoom Sathatham", 22, infoY + 18);
  doc.text("info@westfieldprepcenter.com", 22, infoY + 23);
  doc.text("818-935-5478", 22, infoY + 28);

  // Right - Customer info
  const rx = 130;
  doc.setFont(undefined!, 'bold');
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text("TO", rx, infoY + 7);
  doc.setFont(undefined!, 'normal');
  doc.setTextColor(50, 50, 50);
  doc.text(data.clientName || 'Prospective Client', rx, infoY + 13);
  let cy = infoY + 18;
  if (data.contactName) { doc.text(data.contactName, rx, cy); cy += 5; }
  if (data.email) { doc.text(data.email, rx, cy); cy += 5; }
  if (data.phone) { doc.text(data.phone, rx, cy); }

  // Date line
  doc.setFontSize(8);
  doc.setTextColor(MEDIUM_GRAY.r, MEDIUM_GRAY.g, MEDIUM_GRAY.b);
  doc.text(`Date: ${data.date}`, 22, infoY + 38);

  // Accent line
  doc.setDrawColor(NAVY.r, NAVY.g, NAVY.b);
  doc.setLineWidth(0.5);
  doc.line(15, infoY + 42, 195, infoY + 42);

  let y = infoY + 50;

  // ── Content sections ──
  if (data.isTeamQuote && data.teamQuoteItems?.length) {
    y = drawSectionHeader(doc, "Team Quote Services", "Custom services and pricing for your team.", y);
    for (const item of data.teamQuoteItems) {
      y = drawServiceItem(doc, item, y);
    }
    y += 5;
  } else {
    if (data.standardOperations?.length) {
      y = drawSectionHeader(doc, "Standard Operations", "Basic warehouse intake and account setup fees.", y);
      for (const item of data.standardOperations) {
        y = drawServiceItem(doc, item, y);
      }
      y += 5;
    }

    if (data.fulfillmentSections?.length) {
      for (const section of data.fulfillmentSections) {
        if (section.items.length > 0) {
          const subtitle = section.type === "Amazon FBA"
            ? "Standard prep services for FBA shipments."
            : section.type === "Self Fulfillment"
            ? "Prep, pack, and ship for non-FBA or DTC orders."
            : `${section.type} fulfillment services.`;
          y = drawSectionHeader(doc, section.type, subtitle, y);
          for (const item of section.items) {
            y = drawServiceItem(doc, item, y);
          }
          y += 5;
        }
      }
    }
  }

  // ── Minimum Monthly Spend callout ──
  const spendText = data.minimumSpendTier ? getMinimumSpendText(data.minimumSpendTier) : null;
  if (spendText) {
    y = checkPageBreak(doc, y, 240);
    
    // Bordered callout box
    doc.setDrawColor(NAVY.r, NAVY.g, NAVY.b);
    doc.setLineWidth(0.8);
    doc.setFillColor(250, 251, 255);
    
    const splitSpend = doc.splitTextToSize(spendText, 155);
    const boxHeight = 12 + (splitSpend.length * 4);
    
    doc.roundedRect(20, y, 170, boxHeight, 2, 2, 'FD');
    
    // Title inside box
    doc.setFontSize(9);
    doc.setFont(undefined!, 'bold');
    doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
    doc.text("MINIMUM MONTHLY SPEND", 28, y + 7);
    
    // Text
    doc.setFontSize(8);
    doc.setFont(undefined!, 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text(splitSpend, 28, y + 14);
    
    y += boxHeight + 8;
  }

  // ── Additional Comments ──
  if (data.additionalComments) {
    y = checkPageBreak(doc, y, 240);
    
    doc.setFillColor(NAVY.r, NAVY.g, NAVY.b);
    doc.rect(20, y - 1, 3, 8, 'F');
    doc.setFontSize(12);
    doc.setFont(undefined!, 'bold');
    doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
    doc.text("Additional Comments", 26, y + 5);
    y += 12;
    
    doc.setFontSize(9);
    doc.setFont(undefined!, 'normal');
    doc.setTextColor(50, 50, 50);
    const splitComments = doc.splitTextToSize(data.additionalComments, 165);
    doc.text(splitComments, 24, y);
    y += (splitComments.length * 4) + 8;
  }

  // ── Disclaimers ──
  y = checkPageBreak(doc, y, 220);

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(20, y, 190, y);
  y += 6;

  doc.setFontSize(7.5);
  doc.setFont(undefined!, 'italic');
  doc.setTextColor(100, 100, 100);

  const disclaimer1 = "All pricing provided in this quote is based on the unit volumes disclosed at the time of issuance. If the number of units received, stored, or processed fluctuates materially (up or down), Westfield Prep Center reserves the right to adjust pricing to reflect the updated volume and service requirements. Please contact us if your monthly inbound or stored unit counts change and you wish to request a re-evaluation of this quote.";
  const split1 = doc.splitTextToSize(disclaimer1, 170);
  doc.text(split1, 20, y);
  y += (split1.length * 3.5) + 4;

  y = checkPageBreak(doc, y, 250);

  const disclaimer2 = "If there are any materials that we are missing that will be used in your brand's shipment operations, or if we are missing anything or made any mistake, please let us know so we can adjust the quote accordingly.";
  const split2 = doc.splitTextToSize(disclaimer2, 170);
  doc.text(split2, 20, y);
  y += (split2.length * 3.5) + 8;

  // ── Footer ──
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    // Top border line
    doc.setDrawColor(NAVY.r, NAVY.g, NAVY.b);
    doc.setLineWidth(0.5);
    doc.line(15, 282, 195, 282);
    
    doc.setFontSize(7);
    doc.setFont(undefined!, 'normal');
    doc.setTextColor(MEDIUM_GRAY.r, MEDIUM_GRAY.g, MEDIUM_GRAY.b);
    doc.text("Westfield Prep Center  |  info@westfieldprepcenter.com  |  818-935-5478", 105, 287, { align: "center" });
    doc.text(`Page ${i} of ${pageCount}`, 105, 291, { align: "center" });
  }

  return doc;
}
