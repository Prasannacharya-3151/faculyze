import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "../../components/ui/button";
import { Loader2, FileText, X, Clock } from "lucide-react";
import { toast } from "react-toastify";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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
  currentPreviewNote
}: PreviewModalProps) {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-6xl h-[90vh] rounded-2xl flex flex-col overflow-hidden border border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            <div>
              <h2 className="font-semibold text-xl text-foreground">PDF Preview</h2>
              {currentPreviewNote && (
                <p className="text-sm text-muted-foreground">{currentPreviewNote.title}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-10 w-10 p-0 hover:bg-destructive/10 hover:text-destructive rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 flex justify-center custom-scrollbar bg-background/30">
          {pdfUrl ? (
            <Document
              file={pdfUrl}
              onLoadSuccess={({ numPages }) => setPages(numPages)}
              loading={
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading document...</p>
                </div>
              }
              onLoadError={(error) => {
                console.error("PDF load error:", error);
                toast.error("Failed to load PDF. Please try downloading the file instead.");
              }}
              error={
                <div className="flex flex-col items-center justify-center h-full">
                  <FileText className="w-16 h-16 text-destructive mb-4" />
                  <p className="text-destructive font-medium mb-2">Failed to load PDF</p>
                  <p className="text-muted-foreground text-sm">The PDF preview is not available.</p>
                  <p className="text-muted-foreground text-sm mt-1">Please check if the file exists and try again.</p>
                </div>
              }
            >
              <Page 
                pageNumber={page} 
                width={Math.min(1000, window.innerWidth - 96)} 
                className="shadow-lg rounded-lg bg-white"
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <FileText className="w-16 h-16 text-muted mb-4" />
              <p className="text-muted-foreground">Unable to load document</p>
              <p className="text-muted-foreground text-sm mt-1">No PDF URL available</p>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        {pages > 0 && (
          <div className="p-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/95 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="border-border hover:bg-accent hover:text-accent-foreground px-4"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={page >= pages}
                onClick={() => setPage(p => p + 1)}
                className="border-border hover:bg-accent hover:text-accent-foreground px-4"
              >
                Next
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Page <span className="font-medium text-foreground">{page}</span> of <span className="font-medium text-foreground">{pages}</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Preview expires in 15 minutes
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}