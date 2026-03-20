/**
 * Letter Before Action (LBA) Generator — Priority 8
 *
 * Uses pdf-lib to generate a formal legal demand letter for EC261 claims.
 * Lightweight and serverless-safe (no Puppeteer).
 */

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export interface LBAData {
  claimReference: string;
  date: string;

  // Passenger
  passengerFullName: string;
  passengerAddress: string[];

  // Flight
  flightNumber: string;
  flightDate: string;
  departureAirport: string;
  arrivalAirport: string;
  disruptionType: string;
  delayMinutes: number | null;

  // Compensation
  compensationAmountEur: number;
}

const JET2_LEGAL_ADDRESS = [
  "Jet2.com Ltd",
  "Low Fare Finder House",
  "Leeds Bradford Airport",
  "LS19 7TU",
  "United Kingdom",
];

const JET2_EU261_EMAIL = "eu261@jet2.com";

/**
 * Generate a Letter Before Action PDF.
 * Returns a Buffer containing the PDF.
 */
export async function generateLBA(data: LBAData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4

  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const black = rgb(0, 0, 0);
  const fontSize = 11;
  const lineHeight = 16;
  const margin = 60;
  let y = 780;

  function drawText(text: string, options?: { bold?: boolean; size?: number; indent?: number }) {
    const f = options?.bold ? fontBold : font;
    const s = options?.size ?? fontSize;
    const x = margin + (options?.indent ?? 0);
    page.drawText(text, { x, y, size: s, font: f, color: black });
    y -= lineHeight;
  }

  function drawWrapped(text: string, options?: { bold?: boolean; indent?: number }) {
    const maxWidth = 595.28 - 2 * margin - (options?.indent ?? 0);
    const f = options?.bold ? fontBold : font;
    const words = text.split(" ");
    let line = "";

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const width = f.widthOfTextAtSize(testLine, fontSize);
      if (width > maxWidth && line) {
        drawText(line, options);
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) drawText(line, options);
  }

  function gap(lines = 1) {
    y -= lineHeight * lines;
  }

  // ── Header ─────────────────────────────────────────────────
  drawText("LETTER BEFORE ACTION", { bold: true, size: 16 });
  gap();
  drawText(`Date: ${data.date}`);
  drawText(`Claim Reference: ${data.claimReference}`);
  gap();

  // ── Sender address ─────────────────────────────────────────
  drawText("From:", { bold: true });
  drawText(data.passengerFullName);
  for (const line of data.passengerAddress) {
    drawText(line);
  }
  gap();

  // ── Recipient ──────────────────────────────────────────────
  drawText("To:", { bold: true });
  for (const line of JET2_LEGAL_ADDRESS) {
    drawText(line);
  }
  drawText(`Email: ${JET2_EU261_EMAIL}`);
  gap();

  // ── Subject ────────────────────────────────────────────────
  drawText("RE: COMPENSATION CLAIM UNDER EC REGULATION 261/2004", { bold: true });
  drawText(`Flight ${data.flightNumber} on ${data.flightDate}`, { bold: true });
  gap();

  drawText("Dear Sir/Madam,", { bold: true });
  gap(0.5);

  // ── Body ───────────────────────────────────────────────────
  drawWrapped(
    `I am writing to you in connection with my rights under EC Regulation 261/2004 ` +
    `(as retained in UK law under the UK Air Passenger Rights Regulations 2019, "UK261"). ` +
    `This letter constitutes a formal Letter Before Action.`
  );
  gap(0.5);

  drawText("Flight Details:", { bold: true });
  drawText(`Flight Number: ${data.flightNumber}`, { indent: 16 });
  drawText(`Date: ${data.flightDate}`, { indent: 16 });
  drawText(`Route: ${data.departureAirport} to ${data.arrivalAirport}`, { indent: 16 });
  drawText(`Disruption: ${data.disruptionType.replace(/_/g, " ")}`, { indent: 16 });
  if (data.delayMinutes !== null) {
    const hours = Math.floor(data.delayMinutes / 60);
    const mins = data.delayMinutes % 60;
    drawText(`Delay: ${hours}h ${mins}m (${data.delayMinutes} minutes)`, { indent: 16 });
  }
  gap(0.5);

  drawWrapped(
    `Under Article 7 of EC Regulation 261/2004, I am entitled to fixed compensation of ` +
    `€${data.compensationAmountEur.toFixed(2)} as a result of the above disruption to my flight.`
  );
  gap(0.5);

  drawText("Demand:", { bold: true });
  drawWrapped(
    `I hereby demand payment of €${data.compensationAmountEur.toFixed(2)} within 14 calendar days ` +
    `of the date of this letter.`
  );
  gap(0.5);

  drawText("Consequence of Non-Compliance:", { bold: true });
  drawWrapped(
    `If payment is not received within 14 days, I reserve the right to issue court proceedings ` +
    `without further notice, by way of a claim in the County Court (Money Claims Online — MCOL) ` +
    `or referral to CEDR (Centre for Effective Dispute Resolution), as applicable. ` +
    `The court may order you to pay the compensation claimed, plus court fees, interest, ` +
    `and any additional costs.`
  );
  gap(0.5);

  drawText("Legal Basis:", { bold: true });
  drawWrapped("EC Regulation 261/2004, Article 7 — Right to compensation");
  drawWrapped(
    "UK Air Passenger Rights Regulations 2019 (retained EU law post-Brexit)"
  );
  gap();

  drawWrapped(
    `I trust this matter can be resolved without the need for litigation. ` +
    `Please confirm receipt of this letter and advise when payment will be made.`
  );
  gap();

  drawText("Yours faithfully,");
  gap(2);
  drawText(data.passengerFullName);

  // ── Footer ─────────────────────────────────────────────────
  page.drawText(
    `Generated by Jet2Pay.eu — Ref ${data.claimReference}`,
    { x: margin, y: 30, size: 8, font, color: rgb(0.6, 0.6, 0.6) }
  );

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
