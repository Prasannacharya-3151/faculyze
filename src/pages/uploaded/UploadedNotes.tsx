import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import acharyaPDF from "../../assets/sample.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function UploadedNotes() {
  // Sample Notes
  const uploadedNotes = [
    {
      id: 1,
      title: "Physics Mechanics Notes",
      subject: "Physics",
      group: "Science",
      type: "Notes",
      year: "1st PUC",
      date: "2024-01-15",
      file: acharyaPDF,
    },
    {
      id: 2,
      title: "Organic Chemistry Assignment",
      subject: "Chemistry",
      group: "Science",
      type: "Assignment",
      year: "2nd PUC",
      date: "2024-01-14",
      file: acharyaPDF,
    },
  ];

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState(false);

  // Open Preview
  const openPreview = (file: string) => {
    setPdfUrl(file);
    setIsOpen(true);
    setPageNumber(1);
    setPdfError(false);
  };

  // Close Preview
  const closePreview = () => {
    setIsOpen(false);
    setPdfUrl(null);
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6">Uploaded Notes</h1>

      {/* Notes Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-4 px-6 text-left font-semibold">Title</th>
              <th className="py-4 px-6 text-left font-semibold">Subject</th>
              <th className="py-4 px-6 text-left font-semibold">Group</th>
              <th className="py-4 px-6 text-left font-semibold">Type</th>
              <th className="py-4 px-6 text-left font-semibold">Year</th>
              <th className="py-4 px-6 text-left font-semibold">Date</th>
              <th className="py-4 px-6 text-left font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {uploadedNotes.map((note) => (
              <tr key={note.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6">{note.title}</td>
                <td className="py-4 px-6">{note.subject}</td>
                <td className="py-4 px-6">{note.group}</td>
                <td className="py-4 px-6">{note.type}</td>
                <td className="py-4 px-6">{note.year}</td>
                <td className="py-4 px-6">{note.date}</td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => openPreview(note.file)}
                    className="text-blue-600 font-medium hover:text-blue-800"
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PDF Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-xl shadow-xl flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between p-5 border-b">
              <h2 className="text-lg font-semibold">Document Preview</h2>
              <button
                onClick={closePreview}
                className="text-red-500 hover:text-red-700 text-lg font-semibold"
              >
                ✕
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-auto p-4 bg-gray-100 flex justify-center">
              {!pdfError ? (
                <Document
                  file={pdfUrl!}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  onLoadError={() => setPdfError(true)}
                  loading={
                    <div className="flex flex-col items-center mt-10">
                      <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full mb-3"></div>
                      <p className="text-gray-600">Loading PDF...</p>
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    width={Math.min(800, window.innerWidth - 100)}
                  />
                </Document>
              ) : (
                <div className="text-center mt-20 text-red-500">
                  ⚠ Failed to load PDF
                </div>
              )}
            </div>

            {/* Pagination */}
            {numPages > 0 && !pdfError && (
              <div className="flex justify-between items-center p-4 border-t bg-gray-50">
                <button
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  disabled={pageNumber <= 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
                >
                  Previous
                </button>

                <span className="text-gray-700 font-medium">
                  Page {pageNumber} of {numPages}
                </span>

                <button
                  onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                  disabled={pageNumber >= numPages}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
