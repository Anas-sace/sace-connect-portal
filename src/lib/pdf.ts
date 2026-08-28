import jsPDF from "jspdf";

import logoAsset from "@/assets/sace-logo.png.asset.json";
import { SACE_SUBLINE, SACE_TAGLINE, formatDateTime, sanitizeFilename } from "@/lib/sace";
import type { ResponseRecord } from "@/lib/sace";

const BRAND: [number, number, number] = [82, 3, 128];
const ACCENT: [number, number, number] = [255, 176, 37];
const TEXT: [number, number, number] = [40, 30, 50];
const MUTED: [number, number, number] = [110, 100, 120];

let logoCache: string | null = null;

async function getLogoDataUrl(): Promise<string | null> {
  if (logoCache) return logoCache;
  try {
    const res = await fetch(logoAsset.url);
    const blob = await res.blob();
    logoCache = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("logo"));
      reader.readAsDataURL(blob);
    });
    return logoCache;
  } catch {
    return null;
  }
}

function drawHeader(doc: jsPDF, logo: string | null, title: string) {
  const width = doc.internal.pageSize.getWidth();
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, width, 34, "F");
  doc.setFillColor(...ACCENT);
  doc.rect(0, 34, width, 2, "F");

  if (logo) {
    doc.addImage(logo, "PNG", 14, 9, 62, 7.6);
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("SACE", 14, 18);
  }
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(SACE_TAGLINE, 14, 25);
  doc.setFontSize(7.5);
  doc.setTextColor(255, 224, 170);
  doc.text(SACE_SUBLINE, 14, 30);

  doc.setTextColor(...BRAND);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(title, 14, 50);
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.8);
  doc.line(14, 54, width - 14, 54);
}

function drawFooter(doc: jsPDF) {
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setDrawColor(225, 218, 232);
    doc.setLineWidth(0.3);
    doc.line(14, height - 16, width - 14, height - 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(`${SACE_TAGLINE} — Response Records`, 14, height - 10);
    doc.text(`Page ${i} of ${pages}`, width - 14, height - 10, { align: "right" });
  }
}

function drawField(doc: jsPDF, label: string, value: string, y: number): number {
  const width = doc.internal.pageSize.getWidth();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(label.toUpperCase(), 18, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...TEXT);
  const lines = doc.splitTextToSize(value || "—", width - 40) as string[];
  doc.text(lines, 18, y + 6.5);
  return y + 6.5 + lines.length * 6 + 6;
}

function responseBlock(doc: jsPDF, record: ResponseRecord, startY: number): number {
  let y = startY;
  const width = doc.internal.pageSize.getWidth();

  doc.setFillColor(247, 243, 250);
  doc.roundedRect(14, y, width - 28, 10, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...BRAND);
  doc.text(record.name, 18, y + 6.8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(record.program_type, width - 18, y + 6.8, { align: "right" });
  y += 18;

  y = drawField(doc, "Program", record.program_type, y);
  y = drawField(doc, "Name", record.name, y);
  y = drawField(doc, "Phone Number (WhatsApp)", record.phone_whatsapp, y);
  y = drawField(doc, "Email", record.email, y);
  y = drawField(doc, "College", record.college, y);
  y = drawField(doc, "Submitted On", formatDateTime(record.submitted_at), y);
  return y;
}

export async function downloadResponsePdf(record: ResponseRecord) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const logo = await getLogoDataUrl();
  drawHeader(doc, logo, "Student Response");
  responseBlock(doc, record, 62);
  drawFooter(doc);
  doc.save(`SACE_Response_${sanitizeFilename(record.name)}.pdf`);
}

export async function downloadAllResponsesPdf(records: ResponseRecord[]) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const logo = await getLogoDataUrl();
  const pageHeight = doc.internal.pageSize.getHeight();
  drawHeader(doc, logo, "All Student Responses");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...MUTED);
  doc.text(
    `${records.length} response${records.length === 1 ? "" : "s"} exported on ${formatDateTime(
      new Date().toISOString(),
    )}`,
    14,
    61,
  );

  let y = 70;
  records.forEach((record, index) => {
    if (y > pageHeight - 90) {
      doc.addPage();
      drawHeader(doc, logo, "All Student Responses");
      y = 62;
    }
    y = responseBlock(doc, record, y);
    if (index < records.length - 1) {
      doc.setDrawColor(225, 218, 232);
      doc.setLineWidth(0.3);
      doc.line(14, y, doc.internal.pageSize.getWidth() - 14, y);
      y += 10;
    }
  });

  drawFooter(doc);
  const stamp = new Date().toISOString().slice(0, 10);
  doc.save(`SACE_All_Responses_${stamp}.pdf`);
}
