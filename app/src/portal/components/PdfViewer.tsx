import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PdfViewerProps {
  fileUrl: string;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  overlay?: React.ReactNode;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export function PdfViewer({
  fileUrl,
  onPageChange,
  currentPage: controlledPage,
  overlay,
  containerRef,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [internalPage, setInternalPage] = useState(1);
  const [scale, setScale] = useState(1.0);

  const pageNum = controlledPage ?? internalPage;

  const onDocumentLoadSuccess = useCallback(
    ({ numPages: n }: { numPages: number }) => {
      setNumPages(n);
    },
    [],
  );

  const goToPage = (p: number) => {
    const clamped = Math.max(1, Math.min(p, numPages));
    setInternalPage(clamped);
    onPageChange?.(clamped);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(pageNum - 1)}
          disabled={pageNum <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Page {pageNum} of {numPages || "..."}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(pageNum + 1)}
          disabled={pageNum >= numPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="ml-4 flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center text-sm">{Math.round(scale * 100)}%</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setScale((s) => Math.min(3, s + 0.25))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF page with overlay */}
      <div className="relative inline-block" ref={containerRef}>
        <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess} loading={<div className="h-[792px] w-[612px] animate-pulse bg-muted" />}>
          <Page pageNumber={pageNum} scale={scale} />
        </Document>
        {overlay}
      </div>
    </div>
  );
}
