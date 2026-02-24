// File: /services/pdfService.ts v1.0.2
import { jsPDF } from 'jspdf';
import { ColoringBook } from '../types';

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
  pdf.setTextColor(79, 70, 229); // Indigo-600
  pdf.text(book.theme.toUpperCase(), pageWidth / 2, pageHeight / 3, { align: 'center' });
  
  pdf.setFontSize(16);
  pdf.setTextColor(100, 116, 139); // Slate-500
  pdf.text(`A Special Coloring Book for ${book.name}`, pageWidth / 2, pageHeight / 3 + 20, { align: 'center' });

  // Add Pages
  for (let i = 0; i < book.pages.length; i++) {
    pdf.addPage();
    const page = book.pages[i];

    const margin = 10;
    try {
      // In a real browser environment, we'd need to handle image loading
      // Since we are using base64 data from Gemini, we can add it directly
      // Note: In some cases, we might need to strip the data:image/png;base64, prefix
      const imgData = page.imageUrl;
      
      // Calculate image dimensions to fit page while maintaining aspect ratio
      const availableWidth = pageWidth - (margin * 2);
      const availableHeight = pageHeight - (margin * 2) - (page.story ? 30 : 0);
      
      pdf.addImage(imgData, 'PNG', margin, margin, availableWidth, availableHeight, undefined, 'FAST');

      if (page.story) {
        pdf.setFontSize(12);
        pdf.setTextColor(30, 41, 59); // Slate-800
        const splitStory = pdf.splitTextToSize(page.story, availableWidth);
        pdf.text(splitStory, margin, pageHeight - 25);
      }

      pdf.setFontSize(10);
      pdf.setTextColor(148, 163, 184); // Slate-400
      pdf.text(`Page ${page.pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    } catch (error) {
      console.error(`Error adding page ${i + 1} to PDF:`, error);
      pdf.text(`(Image for page ${i + 1} could not be loaded)`, margin, margin);
    }
  }

  pdf.save(`${book.name}-${book.theme.replace(/\s+/g, '-')}.pdf`);
};
