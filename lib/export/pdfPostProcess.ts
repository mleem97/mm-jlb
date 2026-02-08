/**
 * Post-process a PDF blob to add metadata using pdf-lib.
 * This makes PDFs more ATS-friendly by embedding structured metadata.
 */

import { PDFDocument } from "pdf-lib";

export interface PdfMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string[];
  creator: string;
}

/**
 * Add metadata to an existing PDF blob.
 * Returns a new Blob with the metadata embedded.
 */
export async function addPdfMetadata(
  pdfBlob: Blob,
  metadata: PdfMetadata,
): Promise<Blob> {
  const pdfBytes = new Uint8Array(await pdfBlob.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);

  pdfDoc.setTitle(metadata.title);
  pdfDoc.setAuthor(metadata.author);
  pdfDoc.setSubject(metadata.subject);
  pdfDoc.setKeywords(metadata.keywords);
  pdfDoc.setCreator(metadata.creator);
  pdfDoc.setProducer("Job Letter Builder (mm-jlb)");
  pdfDoc.setCreationDate(new Date());
  pdfDoc.setModificationDate(new Date());

  const processedBytes = await pdfDoc.save();
  return new Blob([processedBytes as unknown as BlobPart], { type: "application/pdf" });
}
