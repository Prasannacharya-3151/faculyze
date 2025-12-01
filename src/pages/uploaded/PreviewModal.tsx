
// import { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';
// import pdf from "../../assets/acharya.pdf";

// import { useNavigate } from "react-router-dom";

// // PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// interface DocumentType {
//   id: number;
//   name: string;
//   type: string;
//   date: string;
//   faculty?: string;
//   pages?: number;
//   fileUrl?: string;
// }

// interface PdfPreviewModalProps {
//   document: DocumentType;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function PdfPreviewModal({ document, isOpen, onClose }: PdfPreviewModalProps) {
//   const navigate = useNavigate();
//   const [numPages, setNumPages] = useState<number>(0);
//   const [pageNumber, setPageNumber] = useState<number>(1);
//   const [pdfError, setPdfError] = useState<boolean>(false);

//   function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
//     setNumPages(numPages);
//     setPageNumber(1);
//     setPdfError(false);
//   }

//   function onDocumentLoadError(error: Error) {
//     console.error("PDF loading error:", error);
//     setPdfError(true);
//   }

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        
//         {/* Header */}
//         <div className="flex justify-between items-center p-6 border-b">
//           <div>
//             <h3 className="text-xl font-bold">{document.name}</h3>
//             <p className="text-sm text-gray-600">
//               {pdfError ? "Failed to load PDF" : `Page ${pageNumber} of ${numPages || "--"}`}
//             </p>
//           </div>
//           <button 
//             onClick={onClose}
//             className="text-2xl hover:text-red-500 transition"
//           >
//             ✕
//           </button>
//         </div>

//         {/* PDF Viewer */}
//         <div className="flex-1 overflow-auto p-4 flex justify-center items-center bg-gray-100 min-h-[400px]">
//           {pdfError ? (
//             <div className="text-center p-8">
//               <p className="text-red-500 text-lg mb-2">Failed to load PDF document</p>
//               <p className="text-gray-600">The document may be corrupted or unavailable.</p>
//             </div>
//           ) : (
//             <Document
//               file={document.fileUrl || pdf}
//               onLoadSuccess={onDocumentLoadSuccess}
//               onLoadError={onDocumentLoadError}
//             >
//               <div style={{
//                 display: "inline-block",
//                 border: "1px solid #ccc",
//                 borderRadius: "8px",
//                 overflow: "hidden",
//                 boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                 backgroundColor: "white"
//               }}>
//                 <Page
//                   pageNumber={pageNumber}
//                   width={Math.min(600, window.innerWidth - 100)}
//                   renderTextLayer={false}
//                   renderAnnotationLayer={false}
//                   loading={<div style={{ width: 600, height: 400 }}>Loading page...</div>}
//                 />
//               </div>
//             </Document>
//           )}
//         </div>

//         {/* Pagination */}
//         {!pdfError && numPages > 0 && (
//           <div className="flex justify-between items-center p-4 border-t bg-gray-50">
//             <button
//               onClick={() => pageNumber > 1 && setPageNumber(pageNumber - 1)}
//               disabled={pageNumber <= 1}
//               className="px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               ← Previous
//             </button>

//             <span className="text-sm font-medium">
//               Page {pageNumber} of {numPages}
//             </span>

//             <button
//               onClick={() => pageNumber < numPages && setPageNumber(pageNumber + 1)}
//               disabled={pageNumber >= numPages}
//               className="px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               Next →
//             </button>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="flex gap-3 p-4 border-t">
//           <button
//             onClick={onClose}
//             className="flex-1 px-4 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
//           >
//             Close Preview
//           </button>

//           {!pdfError && (
//             <Button
//               onClick={() => navigate("/configuration", { state: { pdfUrl: document.fileUrl || pdf } })}
//             >
//               Print Documents
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
