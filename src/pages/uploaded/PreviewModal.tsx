import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "../../components/ui/button";
import { Loader2, FileText, X} from "lucide-react";
import { toast } from "react-toastify";

// Fix worker configuration
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  currentPreviewNote: {
    title: string;
  } | null;
}

export default function PreviewModal({
  isOpen,
  onClose,
  pdfUrl,
  // currentPreviewNote
}: PreviewModalProps) {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Reset state when PDF URL changes
  useEffect(() => {
    setPage(1);
    setPages(0);
  }, [pdfUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl h-[100vh] rounded-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-10 w-10 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 rounded-full right-1"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* PDF Content - Perfectly Centered */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto p-6 flex justify-center bg-gray-50 dark:bg-gray-950/50"
        >
          {pdfUrl ? (
            <div className="flex flex-col items-center w-full">
              <Document
                file={pdfUrl}
                onLoadSuccess={({ numPages }) => {
                  console.log('PDF loaded successfully, pages:', numPages);
                  setPages(numPages);
                  setPage(1);
                  toast.success('PDF loaded successfully');
                }}
                loading={
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Loading document...</p>
                  </div>
                }
                onLoadError={(error) => {
                  console.error("PDF load error:", error);
                  toast.error("Failed to load PDF. Please try downloading the file instead.");
                }}
                onSourceError={(error) => {
                  console.error("PDF source error:", error);
                  toast.error("Invalid PDF source");
                }}
                error={
                  <div className="flex flex-col items-center justify-center py-12">
                    <FileText className="w-16 h-16 text-red-500 mb-4" />
                    <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load PDF</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">The PDF preview is not available.</p>
                  </div>
                }
              >
                <Page
                  key={`page_${page}`}
                  pageNumber={page}
                  width={470}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-xl rounded-lg mx-auto mb-4"
                  loading={
                    <div className="flex justify-center p-8">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
                    </div>
                  }
                />
              </Document>
              
              {/* Page indicator inside scroll area */}
              {pages > 0 && (
                <div className="absolute flex items-center gap-4 mt-142 mb-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    className="h-8 w-8 p-0 rounded-full disabled:opacity-30"
                  >
                    ←
                  </Button>
                  <span className="text-sm text-gray-700 dark:text-gray-300 min-w-[80px] text-center">
                    Page {page} of {pages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page >= pages}
                    onClick={() => setPage(p => p + 1)}
                    className="h-8 w-8 p-0 rounded-full disabled:opacity-30"
                  >
                    →
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <FileText className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No PDF URL available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}