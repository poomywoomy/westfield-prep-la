import jsPDF from "jspdf";

const NAVY = { r: 13, g: 33, b: 66 };
const ACCENT_GRAY = { r: 245, g: 245, b: 248 };
const MEDIUM_GRAY = { r: 120, g: 120, b: 120 };

export interface OneTimeQuoteLineItem {
  service_name: string;
  quantity: number;
  unit_price: number;
  notes?: string;
}

export interface OneTimeQuotePDFData {
  clientName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  date: string;
  projectName: string;
  projectDescription?: string;
  estimatedStartDate?: string;
  estimatedEndDate?: string;
  lineItems: OneTimeQuoteLineItem[];
  additionalComments?: string;
}

function checkPageBreak(doc: jsPDF, y: number, threshold: number = 270): number {
  if (y > threshold) {
    doc.addPage();
    return 20;
  }
  return y;
}

export async function generateOneTimeQuotePDF(data: OneTimeQuotePDFData, logoSrc: string): Promise<jsPDF> {
  const doc = new jsPDF();

  const img = new Image();
  img.src = logoSrc;
  await new Promise((resolve) => { img.onload = resolve; });

  // Navy header banner
  doc.setFillColor(NAVY.r, NAVY.g, NAVY.b);
  doc.rect(0, 0, 210, 42, 'F');

  const logoWidth = 28;
  const logoHeight = (img.height / img.width) * logoWidth;
  doc.addImage(img, 'JPEG', 16, 7, logoWidth, logoHeight);

  doc.setFontSize(20);
  doc.setFont(undefined!, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text("PROJECT QUOTE", 105, 22, { align: "center" });

  doc.setFontSize(9);
  doc.setFont(undefined!, 'normal');
  doc.setTextColor(200, 210, 230);
  doc.text("Westfield Prep Center  |  Los Angeles, CA", 105, 30, { align: "center" });

  // Info section
  const infoY = 48;
  doc.setFillColor(ACCENT_GRAY.r, ACCENT_GRAY.g, ACCENT_GRAY.b);
  doc.roundedRect(15, infoY, 180, 32, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setFont(undefined!, 'bold');
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text("FROM", 22, infoY + 7);
  doc.setFont(undefined!, 'normal');
  doc.setTextColor(50, 50, 50);
  doc.text("Westfield Prep Center", 22, infoY + 13);
  doc.text("Navapoom Sathatham", 22, infoY + 18);
  doc.text("info@westfieldprepcenter.com", 22, infoY + 23);
  doc.text("818-935-5478", 22, infoY + 28);

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

  doc.setFontSize(8);
  doc.setTextColor(MEDIUM_GRAY.r, MEDIUM_GRAY.g, MEDIUM_GRAY.b);
  doc.text(`Date: ${data.date}`, 22, infoY + 38);

  doc.setDrawColor(NAVY.r, NAVY.g, NAVY.b);
  doc.setLineWidth(0.5);
  doc.line(15, infoY + 42, 195, infoY + 42);

  let y = infoY + 50;

  // Project Details Section
  doc.setFillColor(NAVY.r, NAVY.g, NAVY.b);
  doc.rect(20, y - 1, 3, 8, 'F');
  doc.setFontSize(12);
  doc.setFont(undefined!, 'bold');
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text("Project Details", 26, y + 5);
  y += 12;

  doc.setFontSize(10);
  doc.setFont(undefined!, 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text("Project:", 24, y);
  doc.setFont(undefined!, 'normal');
  doc.text(data.projectName, 50, y);
  y += 6;

  if (data.estimatedStartDate || data.estimatedEndDate) {
    doc.setFont(undefined!, 'bold');
    doc.text("Timeline:", 24, y);
    doc.setFont(undefined!, 'normal');
    const timeline = [data.estimatedStartDate, data.estimatedEndDate].filter(Boolean).join(' → ');
    doc.text(timeline, 50, y);
    y += 6;
  }

  if (data.projectDescription) {
    doc.setFont(undefined!, 'bold');
    doc.text("Description:", 24, y);
    y += 5;
    doc.setFont(undefined!, 'normal');
    doc.setFontSize(9);
    const splitDesc = doc.splitTextToSize(data.projectDescription, 165);
    doc.text(splitDesc, 24, y);
    y += (splitDesc.length * 4) + 6;
  } else {
    y += 4;
  }

  // Line items table
  y = checkPageBreak(doc, y, 240);
  doc.setFillColor(NAVY.r, NAVY.g, NAVY.b);
  doc.rect(20, y - 1, 3, 8, 'F');
  doc.setFontSize(12);
  doc.setFont(undefined!, 'bold');
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text("Line Items", 26, y + 5);
  y += 10;

  // Table header
  doc.setFillColor(ACCENT_GRAY.r, ACCENT_GRAY.g, ACCENT_GRAY.b);
  doc.rect(20, y, 170, 7, 'F');
  doc.setFontSize(8);
  doc.setFont(undefined!, 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text("SERVICE", 24, y + 5);
  doc.text("QTY", 130, y + 5, { align: "right" });
  doc.text("UNIT", 155, y + 5, { align: "right" });
  doc.text("TOTAL", 186, y + 5, { align: "right" });
  y += 10;

  let total = 0;
  for (const item of data.lineItems) {
    y = checkPageBreak(doc, y);
    const lineTotal = item.quantity * item.unit_price;
    total += lineTotal;

    doc.setFontSize(10);
    doc.setFont(undefined!, 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(item.service_name, 24, y);
    doc.setFont(undefined!, 'normal');
    doc.text(item.quantity.toString(), 130, y, { align: "right" });
    doc.text(`$${item.unit_price.toFixed(2)}`, 155, y, { align: "right" });
    doc.text(`$${lineTotal.toFixed(2)}`, 186, y, { align: "right" });
    y += 5;

    if (item.notes) {
      doc.setFontSize(7.5);
      doc.setFont(undefined!, 'normal');
      doc.setTextColor(100, 100, 100);
      const splitNotes = doc.splitTextToSize(item.notes, 145);
      doc.text(splitNotes, 28, y);
      y += (splitNotes.length * 3.5) + 1;
    }

    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.2);
    doc.line(24, y + 1, 186, y + 1);
    y += 4;
  }

  // Total
  y = checkPageBreak(doc, y, 250);
  y += 4;
  doc.setFillColor(NAVY.r, NAVY.g, NAVY.b);
  doc.rect(110, y, 80, 10, 'F');
  doc.setFontSize(11);
  doc.setFont(undefined!, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text("PROJECT TOTAL", 114, y + 6.5);
  doc.text(`$${total.toFixed(2)}`, 186, y + 6.5, { align: "right" });
  y += 16;

  // Additional Comments
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

  // Disclaimer
  y = checkPageBreak(doc, y, 240);
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(20, y, 190, y);
  y += 6;

  doc.setFontSize(7.5);
  doc.setFont(undefined!, 'italic');
  doc.setTextColor(100, 100, 100);
  const disclaimer = "This is a one-time project quote. Pricing is based on the project scope and quantities described above. Should the scope change materially, Westfield Prep Center reserves the right to revise this quote. Please confirm in writing to proceed with the project.";
  const split = doc.splitTextToSize(disclaimer, 170);
  doc.text(split, 20, y);

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
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
