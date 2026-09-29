import jsPDF from "jspdf";

export const NAVY = { r: 10, g: 10, b: 35 };
export const ORANGE = { r: 255, g: 122, b: 0 };
export const LIGHT = { r: 245, g: 246, b: 249 };
export const MUTED = { r: 115, g: 118, b: 130 };
export const TEXT = { r: 40, g: 42, b: 52 };

export const PAGE_W = 210;
export const MARGIN = 15;
export const CONTENT_W = PAGE_W - MARGIN * 2;
export const BOTTOM_LIMIT = 278;

export interface PdfParty {
  clientName: string;
  contactName?: string;
  email?: string;
  phone?: string;
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = src;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });
  return img;
}

export function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > BOTTOM_LIMIT) {
    doc.addPage();
    return 20;
  }
  return y;
}

/** Navy header + From/To info cards. Returns the next y position. */
export function drawHeader(
  doc: jsPDF,
  logo: HTMLImageElement,
  title: string,
  subtitle: string,
  party: PdfParty,
  meta: { label: string; value: string }[],
): number {
  doc.setFillColor(NAVY.r, NAVY.g, NAVY.b);
  doc.rect(0, 0, PAGE_W, 38, "F");
  doc.setFillColor(ORANGE.r, ORANGE.g, ORANGE.b);
  doc.rect(0, 38, PAGE_W, 1.2, "F");

  const logoW = 26;
  const logoH = Math.min((logo.height / logo.width) * logoW, 26);
  doc.addImage(logo, "JPEG", MARGIN, (38 - logoH) / 2, logoW, logoH);

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, PAGE_W - MARGIN, 18, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(200, 205, 220);
  doc.text(subtitle, PAGE_W - MARGIN, 25, { align: "right" });

  // Info cards
  const top = 46;
  const gap = 6;
  const cardW = (CONTENT_W - gap) / 2;
  const toLines = [party.clientName || "Prospective Client", party.contactName, party.email, party.phone].filter(Boolean) as string[];
  const fromLines = ["Westfield Prep Center", "Los Angeles, CA", "info@westfieldprepcenter.com", "818-935-5478"];
  const cardH = 10 + Math.max(toLines.length, fromLines.length) * 5 + 3;

  const drawCard = (x: number, label: string, lines: string[]) => {
    doc.setFillColor(LIGHT.r, LIGHT.g, LIGHT.b);
    doc.roundedRect(x, top, cardW, cardH, 2, 2, "F");
    doc.setFillColor(ORANGE.r, ORANGE.g, ORANGE.b);
    doc.rect(x, top, 1.2, cardH, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text(label, x + 6, top + 7);
    lines.forEach((l, i) => {
      doc.setFont("helvetica", i === 0 ? "bold" : "normal");
      doc.setFontSize(i === 0 ? 10 : 9);
      doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
      const fitted = doc.splitTextToSize(l, cardW - 12)[0];
      doc.text(fitted, x + 6, top + 13 + i * 5);
    });
  };
  drawCard(MARGIN, "PREPARED BY", fromLines);
  drawCard(MARGIN + cardW + gap, "PREPARED FOR", toLines);

  // Meta row
  let y = top + cardH + 7;
  doc.setFontSize(8);
  let x = MARGIN;
  meta.forEach((m) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text(m.label.toUpperCase(), x, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(TEXT.r, TEXT.g, TEXT.b);
    doc.setFontSize(9);
    doc.text(m.value, x, y + 5);
    doc.setFontSize(8);
    x += CONTENT_W / Math.max(meta.length, 1);
  });
  y += 10;
  doc.setDrawColor(225, 227, 233);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  return y + 8;
}

export function drawSectionTitle(doc: jsPDF, y: number, title: string): number {
  doc.setFillColor(ORANGE.r, ORANGE.g, ORANGE.b);
  doc.rect(MARGIN, y - 4, 2.5, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text(title, MARGIN + 5, y + 0.5);
  return y + 8;
}

export function drawParagraph(doc: jsPDF, y: number, text: string, size = 9, italic = false): number {
  doc.setFont("helvetica", italic ? "italic" : "normal");
  doc.setFontSize(size);
  doc.setTextColor(italic ? MUTED.r : TEXT.r, italic ? MUTED.g : TEXT.g, italic ? MUTED.b : TEXT.b);
  const lines = doc.splitTextToSize(text, CONTENT_W);
  const lh = size * 0.45;
  for (const line of lines) {
    y = ensureSpace(doc, y, lh);
    doc.text(line, MARGIN, y);
    y += lh;
  }
  return y + 3;
}

export function drawFooters(doc: jsPDF) {
  const n = doc.getNumberOfPages();
  for (let i = 1; i <= n; i++) {
    doc.setPage(i);
    doc.setDrawColor(NAVY.r, NAVY.g, NAVY.b);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, 281, PAGE_W - MARGIN, 281);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text("Westfield Prep Center  |  Los Angeles, CA  |  info@westfieldprepcenter.com  |  818-935-5478", MARGIN, 286);
    doc.text(`Page ${i} of ${n}`, PAGE_W - MARGIN, 286, { align: "right" });
  }
}

export const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
