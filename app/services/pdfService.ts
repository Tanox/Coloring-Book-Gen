/* app/services/pdfService.ts v0.5.14 */
import { jsPDF } from "jspdf";
import { GeneratedPage } from "../types";
import { getCachedFont, cacheFont } from "./storageService";

// 使用更完整的 TTF 字体链接，确保中日韩文字支持
const FONT_URL = "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-sc@5.0.18/files/noto-sans-sc-latin-400-normal.woff"; 
const FONT_NAME = "NotoSansSC-Regular.ttf";

export const generateBookPDF = async (
  pages: GeneratedPage[], 
  title: string, 
  authorName: string,
  coverSubtitle: string,
  footerTemplate: string
): Promise<void> => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - (margin * 2);
  const contentHeight = pageHeight - (margin * 2);

  try {
    let fontBase64 = await getCachedFont(FONT_NAME);
    if (!fontBase64) {
      const response = await fetch(FONT_URL);
      if (response.ok) {
        const blob = await response.blob();
        const reader = new FileReader();
        fontBase64 = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        if (fontBase64) await cacheFont(FONT_NAME, fontBase64 as string);
      }
    }
    
    if (fontBase64) {
        const parts = (fontBase64 as string).split(',');
        const cleanBase64 = parts.length > 1 ? parts[1] : parts[0];
        doc.addFileToVFS(FONT_NAME, cleanBase64);
        doc.addFont(FONT_NAME, "CustomFont", "normal");
        doc.setFont("CustomFont");
    }
  } catch (e) {
    console.warn("Font loading optimization failed, falling back to standard fonts", e);
  }

  const safeTitle = title.replace(/[^\w\s\u4e00-\u9fa5]/gi, '').replace(/\s+/g, '_');

  pages.forEach((page, index) => {
    if (index > 0) doc.addPage();
    
    doc.setFont("CustomFont", "normal");

    if (index === 0) {
      doc.setFontSize(28); 
      doc.setTextColor(0, 0, 0);
      const splitTitle = doc.splitTextToSize(title, contentWidth);
      doc.text(splitTitle, pageWidth / 2, 40, { align: "center" });
      
      const titleHeight = splitTitle.length * 12; 
      const imageStartY = 45 + titleHeight;
      const availableHeight = pageHeight - imageStartY - 40; 
      
      doc.addImage(page.imageUrl, "PNG", margin, imageStartY, contentWidth, availableHeight, undefined, 'FAST');
      
      doc.setFontSize(16);
      doc.setTextColor(60, 60, 60); 
      doc.text(coverSubtitle, pageWidth / 2, pageHeight - 20, { align: "center" });
    } else {
      const storyHeight = page.storyText ? 30 : 0;
      const displayHeight = contentHeight - storyHeight - 10;
      
      doc.addImage(page.imageUrl, "PNG", margin, margin, contentWidth, displayHeight, undefined, 'FAST');
      
      if (page.storyText) {
          doc.setFontSize(14);
          doc.setTextColor(30, 30, 30);
          const splitStory = doc.splitTextToSize(page.storyText, contentWidth - 20);
          const storyY = margin + displayHeight + 12;
          doc.text(splitStory, pageWidth / 2, storyY, { align: "center" });
      }
      
      const footerText = footerTemplate
        .replace('{page}', String(index)) 
        .replace('{theme}', title)
        .replace('{name}', authorName);
        
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(footerText, pageWidth / 2, pageHeight - 8, { align: "center" });
    }
  });
  
  doc.save(`${safeTitle || 'Coloring_Book'}.pdf`);
};