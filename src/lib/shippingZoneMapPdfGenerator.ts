import jsPDF from "jspdf";
import {
  NAVY, ORANGE, LIGHT, MUTED, TEXT, MARGIN, CONTENT_W, PAGE_W,
  loadImage, drawHeader, drawSectionTitle, drawParagraph, drawFooters, ensureSpace, money, PdfParty,
} from "./pdfBrand";
import { ZONE_MILES } from "@/data/uspsZoneReference";

export interface ZonePackage {
  label: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  rates: (number | null)[]; // index 0 = zone 1
}

export interface ShippingZoneMapPDFData extends PdfParty {
  date: string;
  carrier: string;
  packages: ZonePackage[];
  handlingNote?: string;
  comments?: string;
}

export async function generateShippingZoneMapPDF(data: ShippingZoneMapPDFData, logoSrc: string): Promise<jsPDF> {
  const doc = new jsPDF();
  const logo = await loadImage(logoSrc);

  let y = drawHeader(doc, logo, "SHIPPING ZONE MAP", "Westfield Prep Center  |  Los Angeles, CA", data, [
    { label: "Date", value: data.date },
    { label: "Origin", value: "Los Angeles, CA 91010" },
    { label: "Carrier / Service", value: data.carrier || "USPS" },
    { label: "Package sizes", value: String(data.packages.length) },
  ]);

  // Zone legend
  y = drawSectionTitle(doc, y, "Zone Overview");
  const cols = 4;
  const gap = 3;
  const boxW = (CONTENT_W - gap * (cols - 1)) / cols;
  const boxH = 14;
  for (let z = 1; z <= 8; z++) {
    const i = z - 1;
    const x = MARGIN + (i % cols) * (boxW + gap);
    const by = y + Math.floor(i / cols) * (boxH + gap);
    doc.setFillColor(LIGHT.r, LIGHT.g, LIGHT.b);
    doc.roundedRect(x, by, boxW, boxH, 1.5, 1.5, "F");
    doc.setFillColor(ORANGE.r, ORANGE.g, ORANGE.b);
    doc.roundedRect(x + 3, by + 3, 8, 8, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(String(z), x + 7, by + 8.4, { align: "center" });
    doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
    doc.text(`Zone ${z}`, x + 14, by + 6.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text(ZONE_MILES[z] || "", x + 14, by + 10.8);
  }
  y += 2 * boxH + gap + 10;

  // Rate table
  y = ensureSpace(doc, y, 30);
  y = drawSectionTitle(doc, y, "Rates by Zone");
  const pkgColW = 50;
  const zoneColW = (CONTENT_W - pkgColW) / 8;
  const headH = 9;
  doc.setFillColor(NAVY.r, NAVY.g, NAVY.b);
  doc.rect(MARGIN, y, CONTENT_W, headH, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("PACKAGE", MARGIN + 4, y + 6);
  for (let z = 1; z <= 8; z++) {
    doc.text(`Z${z}`, MARGIN + pkgColW + zoneColW * (z - 0.5), y + 6, { align: "center" });
  }
  y += headH;

  data.packages.forEach((p, idx) => {
    const rowH = 14;
    if (y + rowH > 272) {
      doc.addPage();
      y = 20;
    }
    if (idx % 2 === 0) {
      doc.setFillColor(LIGHT.r, LIGHT.g, LIGHT.b);
      doc.rect(MARGIN, y, CONTENT_W, rowH, "F");
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
    doc.text(doc.splitTextToSize(p.label || `Package ${idx + 1}`, pkgColW - 6)[0], MARGIN + 4, y + 5.8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text(`${p.length} x ${p.width} x ${p.height} in  |  ${p.weight} lb`, MARGIN + 4, y + 10.5);
    doc.setFontSize(8.5);
    doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
    for (let z = 0; z < 8; z++) {
      const r = p.rates[z];
      doc.text(r == null || isNaN(r) ? "-" : money(r), MARGIN + pkgColW + zoneColW * (z + 0.5), y + 8.3, { align: "center" });
    }
    doc.setDrawColor(228, 230, 236);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y + rowH, PAGE_W - MARGIN, y + rowH);
    y += rowH;
  });
  y += 8;

  if (data.handlingNote) {
    y = ensureSpace(doc, y, 14);
    y = drawSectionTitle(doc, y, "Handling & Markup");
    y = drawParagraph(doc, y, data.handlingNote) + 3;
  }
  if (data.comments) {
    y = ensureSpace(doc, y, 14);
    y = drawSectionTitle(doc, y, "Additional Comments");
    y = drawParagraph(doc, y, data.comments) + 2;
  }

  y = ensureSpace(doc, y, 11);
  doc.setDrawColor(225, 227, 233);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 5;
  drawParagraph(
    doc,
    y,
    "Rates shown are estimates based on the package dimensions and weights listed, shipped from Los Angeles, CA 91010. Final postage may vary with carrier rate changes, dimensional weight, surcharges and destination. Zones are based on USPS distance bands.",
    7.5,
    true,
  );

  drawFooters(doc);
  return doc;
}
