import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { usePDFExport } from "@/hooks/use-pdf-export";

interface PDFExportButtonsProps {
  title: string;
  station: string;
  timePeriod: string;
  elementId: string;
}

export const PDFExportButtons = ({ title, station, timePeriod, elementId }: PDFExportButtonsProps) => {
  const { exportPDF, previewPDF } = usePDFExport();

  const handlePreview = () => {
    previewPDF({ title, station, timePeriod, elementId });
  };

  const handleExport = () => {
    exportPDF({ title, station, timePeriod, elementId });
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handlePreview}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Preview PDF
      </Button>
      <Button 
        variant="default" 
        size="sm" 
        onClick={handleExport}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export PDF
      </Button>
    </div>
  );
};