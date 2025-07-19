import { useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFExportOptions {
  title: string;
  station: string;
  timePeriod: string;
  elementId: string;
}

export const usePDFExport = () => {
  const generatePDF = useCallback(async ({ title, station, timePeriod, elementId }: PDFExportOptions) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found');
      return null;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add header information
      pdf.setFontSize(20);
      pdf.text(title, 20, 25);
      
      pdf.setFontSize(12);
      pdf.text(`Station: ${station}`, 20, 35);
      pdf.text(`Time Period: ${timePeriod}`, 20, 42);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 49);
      
      // Add the chart
      const imgWidth = 170;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 20, 60, imgWidth, imgHeight);
      
      return pdf;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    }
  }, []);

  const exportPDF = useCallback(async (options: PDFExportOptions, filename?: string) => {
    const pdf = await generatePDF(options);
    if (pdf) {
      const finalFilename = filename || `${options.title.replace(/\s+/g, '_')}_${options.station}_${Date.now()}.pdf`;
      pdf.save(finalFilename);
    }
  }, [generatePDF]);

  const previewPDF = useCallback(async (options: PDFExportOptions) => {
    const pdf = await generatePDF(options);
    if (pdf) {
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    }
  }, [generatePDF]);

  return {
    exportPDF,
    previewPDF
  };
};