// File: /app/services/pdfService.ts v1.5.0
import { jsPDF } from 'jspdf';
import { ColoringBook } from '../types';

// Warm Amber accent — the single brand color (oklch(0.55 0.15 75) ≈ #C2410C-ish).
const AMBER: [number, number, number] = [194, 65, 12];
const NEUTRAL_STRONG: [number, number, number] = [60, 60, 60];
const NEUTRAL_MUTED: [number, number, number] = [115, 115, 115];

/** Strip filesystem-unsafe characters and cap length for the download filename. */
export const sanitizeFilename = (value: string): string => {
  const cleaned = (value ?? '')
    .trim()
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100);
  return cleaned || 'coloring-book';
};

export const exportToPdf = async (book: ColoringBook): Promise<void> => {
  const pdf = new jsPDF({
    orientation: book.imageAspectRatio === '16:9' || book.imageAspectRatio === '4:3' ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Add Cover Page
  pdf.setFontSize(24);
  pdf.setTextColor(...AMBER);
  pdf.text(book.theme.toUpperCase(), pageWidth / 2, pageHeight / 3, { align: 'center' });

  pdf.setFontSize(16);
  pdf.setTextColor(...NEUTRAL_MUTED);
  pdf.text(`A Special Coloring Book for ${book.name}`, pageWidth / 2, pageHeight / 3 + 20, { align: 'center' });

  // Add Pages
  for (let i = 0; i < book.pages.length; i++) {
    pdf.addPage();
    const page = book.pages[i];

    const margin = 10;
    try {
      const imgData = page.imageUrl;

      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2 - (page.story ? 30 : 0);

      pdf.addImage(imgData, 'PNG', margin, margin, availableWidth, availableHeight, undefined, 'FAST');

      if (page.story) {
        pdf.setFontSize(12);
        pdf.setTextColor(...NEUTRAL_STRONG);
        const splitStory = pdf.splitTextToSize(page.story, availableWidth);
        pdf.text(splitStory, margin, pageHeight - 25);
      }

      pdf.setFontSize(10);
      pdf.setTextColor(...NEUTRAL_MUTED);
      pdf.text(`Page ${page.pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Error adding page ${i + 1} to PDF:`, error);
      }
      pdf.text(`(Image for page ${i + 1} could not be loaded)`, margin, margin);
    }
  }

  pdf.save(`${sanitizeFilename(book.name)}-${sanitizeFilename(book.theme)}.pdf`);
};
