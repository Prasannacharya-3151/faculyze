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


// import { useState, useRef, useEffect } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import { Button } from "../../components/ui/button";
// import { Loader2, FileText, X} from "lucide-react";
// import { toast } from "react-toastify";

// // Fix worker configuration
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString();

// interface PreviewModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   pdfUrl: string | null;
//   currentPreviewNote: {
//     title: string;
//   } | null;
// }

// export default function PreviewModal({
//   isOpen,
//   onClose,
//   pdfUrl,
//   // currentPreviewNote
// }: PreviewModalProps) {
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(0);
//   const [containerWidth, setContainerWidth] = useState<number>(0);

//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const resizeObserver = new ResizeObserver(entries => {
//       const width = entries[0].contentRect.width;
//       setContainerWidth(width);
//     });

//     resizeObserver.observe(containerRef.current);
//     return () => resizeObserver.disconnect();
//   }, []);

//   // PRODUCTION-LEVEL RESPONSIVE WIDTH - ZOOMED FOR CLARITY
//   const getPageWidth = () => {
//     if (containerWidth === 0) return 420;
    
//     // Mobile Portrait (< 640px): MAXIMUM width for clarity and zoom
//     if (containerWidth < 640) {
//       return Math.min(containerWidth - 16, 450);
//     }
    
//     // Tablet (640px - 1024px): Scale proportionally but cap at 420
//     if (containerWidth < 1024) {
//       return Math.min(containerWidth * 0.75, 420);
//     }
    
//     // Desktop/Laptop (>= 1024px): FIXED 420px - your perfect size
//     return 420;
//   };

//   // Reset state when PDF URL changes
//   useEffect(() => {
//     setPage(1);
//     setPages(0);
//   }, [pdfUrl]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
//       <div className="bg-white dark:bg-gray-900 w-full max-w-[98vw] sm:max-w-2xl lg:max-w-2xl h-[94vh] sm:h-[100vh] rounded-lg sm:rounded-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl">
        
//         {/* Header */}
//         <div className="flex items-center justify-end p-1.5 sm:p-0">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onClose}
//             className="h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 rounded-full"
//           >
//             <X className="w-4 h-4 sm:w-5 sm:h-5" />
//           </Button>
//         </div>

//         {/* PDF Content */}
//         <div 
//           ref={containerRef}
//           className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950/50"
//         >
//           {pdfUrl ? (
//             <div className="flex flex-col items-center w-full min-h-full py-1 sm:py-6 px-1 sm:px-2">
//               <Document
//                 file={pdfUrl}
//                 onLoadSuccess={({ numPages }) => {
//                   console.log('PDF loaded successfully, pages:', numPages);
//                   setPages(numPages);
//                   setPage(1);
//                   toast.success('PDF loaded successfully');
//                 }}
//                 loading={
//                   <div className="flex flex-col items-center justify-center py-8 sm:py-12">
//                     <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 animate-spin text-blue-600 dark:text-blue-400 mb-3 sm:mb-4" />
//                     <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Loading document...</p>
//                   </div>
//                 }
//                 onLoadError={(error) => {
//                   console.error("PDF load error:", error);
//                   toast.error("Failed to load PDF. Please try downloading the file instead.");
//                 }}
//                 onSourceError={(error) => {
//                   console.error("PDF source error:", error);
//                   toast.error("Invalid PDF source");
//                 }}
//                 error={
//                   <div className="flex flex-col items-center justify-center py-8 sm:py-12">
//                     <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mb-3 sm:mb-4" />
//                     <p className="text-sm sm:text-base text-red-600 dark:text-red-400 font-medium mb-2">Failed to load PDF</p>
//                     <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">The PDF preview is not available.</p>
//                   </div>
//                 }
//               >
//                 <div className="relative">
//                   <Page
//                     key={`page_${page}`}
//                     pageNumber={page}
//                     width={getPageWidth()}
//                     renderTextLayer={false}
//                     renderAnnotationLayer={false}
//                     className="shadow-md sm:shadow-xl rounded-lg mx-auto mb-16 sm:mb-20"
//                     loading={
//                       <div className="flex justify-center p-6 sm:p-8">
//                         <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600 dark:text-blue-400" />
//                       </div>
//                     }
//                   />
//                 </div>
//               </Document>
              
//               {/* Page Navigation - Fixed at bottom */}
//               {pages > 0 && (
//                 <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-4 bg-white dark:bg-gray-800 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 z-10">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     disabled={page <= 1}
//                     onClick={() => setPage(p => p - 1)}
//                     className="h-7 w-7 sm:h-9 sm:w-9 p-0 rounded-full disabled:opacity-30 text-base sm:text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                   >
//                     ←
//                   </Button>
//                   <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 min-w-[60px] sm:min-w-[85px] text-center font-semibold">
//                     {page} / {pages}
//                   </span>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     disabled={page >= pages}
//                     onClick={() => setPage(p => p + 1)}
//                     className="h-7 w-7 sm:h-9 sm:w-9 p-0 rounded-full disabled:opacity-30 text-base sm:text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                   >
//                     →
//                   </Button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-full">
//               <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-3 sm:mb-4" />
//               <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No PDF URL available</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }