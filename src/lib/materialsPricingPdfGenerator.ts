import jsPDF from "jspdf";
import {
  NAVY, LIGHT, MUTED, TEXT, MARGIN, CONTENT_W, PAGE_W,
  loadImage, drawHeader, drawSectionTitle, drawParagraph, drawFooters, ensureSpace, money, PdfParty,
} from "./pdfBrand";

export interface MaterialLine {
  material: string;
  size?: string;
  unit: string;
  unit_price: number;
  quantity?: number | null;
  notes?: string;
}

export interface MaterialsPricingPDFData extends PdfParty {
  date: string;
  lines: MaterialLine[];
  comments?: string;
}

export async function generateMaterialsPricingPDF(data: MaterialsPricingPDFData, logoSrc: string): Promise<jsPDF> {
  const doc = new jsPDF();
  const logo = await loadImage(logoSrc);
  const hasQty = data.lines.some((l) => l.quantity != null && l.quantity > 0);

  let y = drawHeader(doc, logo, "MATERIALS PRICING", "Westfield Prep Center  |  Los Angeles, CA", data, [
    { label: "Date", value: data.date },
    { label: "Items", value: String(data.lines.length) },
    { label: "Currency", value: "USD" },
  ]);

  y = drawSectionTitle(doc, y, "Packaging Materials");

  // Column x positions (right edges for numeric columns)
  const cMaterial = MARGIN + 4;
  const cSize = MARGIN + 62;
  const cUnit = MARGIN + 104;
  const rPrice = hasQty ? MARGIN + 138 : PAGE_W - MARGIN - 4;
  const rQty = MARGIN + 154;
  const rTotal = PAGE_W - MARGIN - 4;

  const drawHead = () => {
    doc.setFillColor(NAVY.r, NAVY.g, NAVY.b);
    doc.rect(MARGIN, y, CONTENT_W, 9, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("MATERIAL", cMaterial, y + 6);
    doc.text("SIZE", cSize, y + 6);
    doc.text("UNIT", cUnit, y + 6);
    doc.text("UNIT PRICE", rPrice, y + 6, { align: "right" });
    if (hasQty) {
      doc.text("QTY", rQty, y + 6, { align: "right" });
      doc.text("TOTAL", rTotal, y + 6, { align: "right" });
    }
    y += 9;
  };
  drawHead();

  let total = 0;
  data.lines.forEach((l, idx) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    const noteLines = l.notes ? doc.splitTextToSize(l.notes, CONTENT_W - 12) : [];
    doc.setFontSize(9);
    const sizeLines = doc.splitTextToSize(l.size || "-", cUnit - cSize - 4);
    doc.setFont("helvetica", "bold");
    const matLines = doc.splitTextToSize(l.material || "-", cSize - cMaterial - 4);
    const mainLines = Math.max(sizeLines.length, matLines.length);
    const rowH = 5 + mainLines * 5 + (noteLines.length ? noteLines.length * 3.6 + 1.5 : 0) + 2.5;
    if (y + rowH > 272) {
      doc.addPage();
      y = 20;
      drawHead();
    }
    if (idx % 2 === 0) {
      doc.setFillColor(LIGHT.r, LIGHT.g, LIGHT.b);
      doc.rect(MARGIN, y, CONTENT_W, rowH, "F");
    }
    const base = y + 6.5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
    doc.text(matLines, cMaterial, base, { lineHeightFactor: 1.4 });
    doc.setFont("helvetica", "normal");
    doc.text(sizeLines, cSize, base, { lineHeightFactor: 1.4 });
    doc.text(l.unit || "each", cUnit, base);
    doc.text(money(l.unit_price || 0), rPrice, base, { align: "right" });
    if (hasQty) {
      const q = l.quantity && l.quantity > 0 ? l.quantity : 0;
      const lt = q * (l.unit_price || 0);
      total += lt;
      doc.text(q ? q.toLocaleString() : "-", rQty, base, { align: "right" });
      doc.text(q ? money(lt) : "-", rTotal, base, { align: "right" });
    }
    if (noteLines.length) {
      doc.setFontSize(7.5);
      doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
      doc.text(noteLines, cMaterial, base + (mainLines - 1) * 5 + 5, { lineHeightFactor: 1.35 });
    }
    doc.setDrawColor(228, 230, 236);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y + rowH, PAGE_W - MARGIN, y + rowH);
    y += rowH;
  });

  if (hasQty) {
    y = ensureSpace(doc, y + 5, 14);
    doc.setFillColor(NAVY.r, NAVY.g, NAVY.b);
    doc.roundedRect(PAGE_W - MARGIN - 80, y, 80, 11, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("ESTIMATED TOTAL", PAGE_W - MARGIN - 76, y + 7.2);
    doc.text(money(total), PAGE_W - MARGIN - 4, y + 7.2, { align: "right" });
    y += 11;
  }
  y += 10;

  if (data.comments) {
    y = ensureSpace(doc, y, 14);
    y = drawSectionTitle(doc, y, "Additional Comments");
    y = drawParagraph(doc, y, data.comments);
  }

  y = ensureSpace(doc, y, 11);
  doc.setDrawColor(225, 227, 233);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 5;
  drawParagraph(
    doc,
    y,
    "Material pricing is per the unit listed and is subject to supplier cost changes and availability. Custom sizes and specialty materials may require lead time. Materials are billed as used unless otherwise agreed in writing.",
    7.5,
    true,
  );

  drawFooters(doc);
  return doc;
}
