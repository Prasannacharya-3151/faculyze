// import React, { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";

// import acharyaPDF from "../../assets/sample.pdf";

// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// export default function UploadedNotes() {
  
//   const uploadedNotes = [
//     {
//       id: 1,
//       title: "Physics Mechanics Notes",
//       subject: "Physics",
//       group: "Science",
//       type: "Notes",
//       year: "1st PUC",
//       date: "2024-01-15",
//       file: acharyaPDF,
//     },
//     {
//       id: 2,
//       title: "Organic Chemistry Assignment",
//       subject: "Chemistry",
//       group: "Science",
//       type: "Assignment",
//       year: "2nd PUC",
//       date: "2024-01-14",
//       file: acharyaPDF,
//     },
//   ];

//   // Modal State
//   const [isOpen, setIsOpen] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);
//   const [numPages, setNumPages] = useState(0);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [pdfError, setPdfError] = useState(false);

//   // Open Preview
//   const openPreview = (file: string) => {
//     setPdfUrl(file);
//     setIsOpen(true);
//     setPageNumber(1);
//     setPdfError(false);
//   };

//   // Close Preview
//   const closePreview = () => {
//     setIsOpen(false);
//     setPdfUrl(null);
//   };

//   return (
//     <div className="w-full p-6">
//       <h1 className="text-2xl font-bold mb-6">Uploaded Notes</h1>

//       {/* Notes Table */}
//       <div className="bg-white rounded-xl border overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b">
//             <tr>
//               <th className="py-4 px-6 text-left font-semibold">Title</th>
//               <th className="py-4 px-6 text-left font-semibold">Subject</th>
//               <th className="py-4 px-6 text-left font-semibold">Group</th>
//               <th className="py-4 px-6 text-left font-semibold">Type</th>
//               <th className="py-4 px-6 text-left font-semibold">Year</th>
//               <th className="py-4 px-6 text-left font-semibold">Date</th>
//               <th className="py-4 px-6 text-left font-semibold">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {uploadedNotes.map((note) => (
//               <tr key={note.id} className="border-b hover:bg-gray-50">
//                 <td className="py-4 px-6">{note.title}</td>
//                 <td className="py-4 px-6">{note.subject}</td>
//                 <td className="py-4 px-6">{note.group}</td>
//                 <td className="py-4 px-6">{note.type}</td>
//                 <td className="py-4 px-6">{note.year}</td>
//                 <td className="py-4 px-6">{note.date}</td>
//                 <td className="py-4 px-6">
//                   <button
//                     onClick={() => openPreview(note.file)}
//                     className="text-blue-600 font-medium hover:text-blue-800"
//                   >
//                     Preview
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

    
//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
//           <div className="bg-white w-full max-w-5xl h-[90vh] rounded-xl shadow-xl flex flex-col">
            
//             {/* Header */}
//             <div className="flex justify-between p-5 border-b">
//               <h2 className="text-lg font-semibold">Document Preview</h2>
//               <button
//                 onClick={closePreview}
//                 className="text-red-500 hover:text-red-700 text-lg font-semibold"
//               >
//                 ✕
//               </button>
//             </div>

           
//             <div className="flex-1 overflow-auto p-4 bg-gray-100 flex justify-center">
//               {!pdfError ? (
//                 <Document
//                   file={pdfUrl!}
//                   onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//                   onLoadError={() => setPdfError(true)}
//                   loading={
//                     <div className="flex flex-col items-center mt-10">
//                       <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full mb-3"></div>
//                       <p className="text-gray-600">Loading PDF...</p>
//                     </div>
//                   }
//                 >
//                   <Page
//                     pageNumber={pageNumber}
//                     width={Math.min(800, window.innerWidth - 100)}
//                   />
//                 </Document>
//               ) : (
//                 <div className="text-center mt-20 text-red-500">
//                   ⚠ Failed to load PDF
//                 </div>
//               )}
//             </div>

          
//             {numPages > 0 && !pdfError && (
//               <div className="flex justify-between items-center p-4 border-t bg-gray-50">
//                 <button
//                   onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
//                   disabled={pageNumber <= 1}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
//                 >
//                   Previous
//                 </button>

//                 <span className="text-gray-700 font-medium">
//                   Page {pageNumber} of {numPages}
//                 </span>

//                 <button
//                   onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
//                   disabled={pageNumber >= numPages}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  FileText,
  Download,
  Share2,
  Trash2,
  MoreVertical,
  Search,
  LayoutGrid,
  List,
  Eye,
  Calendar,
  BookOpen,
  Users,
  X
} from "lucide-react";

import {
  Card,
  CardContent,
} from "../../components/ui/card";
import {
  Button
} from "../../components/ui/button";
import {
  Input
} from "../../components/ui/input";
import {
  Badge
} from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";

import samplePDF from "../../assets/sample.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

/* ================= TYPES ================= */

type Note = {
  id: string;
  title: string;
  subject: string;
  group: string;
  type: string;
  year: string;
  date: string;
  file: string;
  size?: string;
};

/* ================= MOCK DATA ================= */

const mockNotes: Note[] = [
  {
    id: "1",
    title: "Physics Mechanics Notes",
    subject: "Physics",
    group: "Science",
    type: "Notes",
    year: "1st PUC",
    date: "Jan 15, 2024",
    file: samplePDF,
    size: "2.4 MB"
  },
  {
    id: "2",
    title: "Organic Chemistry Assignment",
    subject: "Chemistry",
    group: "Science",
    type: "Assignment",
    year: "2nd PUC",
    date: "Jan 14, 2024",
    file: samplePDF,
    size: "1.8 MB"
  },
  {
    id: "3",
    title: "Calculus Integration Problems",
    subject: "Mathematics",
    group: "Science",
    type: "Problems",
    year: "1st PUC",
    date: "Jan 12, 2024",
    file: samplePDF,
    size: "3.1 MB"
  },
  {
    id: "4",
    title: "Biology Lab Report",
    subject: "Biology",
    group: "Science",
    type: "Report",
    year: "2nd PUC",
    date: "Jan 10, 2024",
    file: samplePDF,
    size: "4.2 MB"
  },
];

/* ================= MAIN ================= */

export default function UploadedNotes() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState(mockNotes);

  /* ---- PDF PREVIEW ---- */
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);

  const openPreview = (file: string) => {
    setPdfUrl(file);
    setPreviewOpen(true);
    setPage(1);
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setPdfUrl(null);
  };

  /* ---- ACTIONS ---- */
  const handleDownload = (note: Note) => {
    console.log("Download:", note.title);
  };

  const handleShare = (note: Note) => {
    console.log("Share:", note.title);
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotes = notes.filter((n) => {
    return n.title.toLowerCase().includes(search.toLowerCase()) ||
           n.subject.toLowerCase().includes(search.toLowerCase());
  });

  /* ================= UI ================= */

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Uploaded Notes
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {notes.length} documents • {filteredNotes.length} filtered
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-300 rounded-md p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 px-3 rounded"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 px-3 rounded"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 text-base border border-gray-300 rounded-md"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* NOTES GRID/LIST VIEW */}
      {filteredNotes.length === 0 ? (
        <Card className="border border-gray-300">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notes found
            </h3>
            <p className="text-gray-500">
              Try a different search term
            </p>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <Card 
              key={note.id} 
              className="border border-gray-300"
            >
              <CardContent className="p-5 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <FileText className="text-blue-600 w-6 h-6" />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border border-gray-300 w-40">
                      <DropdownMenuItem onClick={() => openPreview(note.file)}>
                        <Eye className="w-4 h-4 mr-2" /> Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(note)}>
                        <Download className="w-4 h-4 mr-2" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(note)}>
                        <Share2 className="w-4 h-4 mr-2" /> Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(note.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-semibold text-gray-900 text-base mb-2">
                    {note.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                      {note.subject}
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                      {note.type}
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                      {note.year}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {note.group}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {note.date}
                      </span>
                    </div>
                    {note.size && (
                      <span className="text-xs font-medium">{note.size}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <Card className="border border-gray-300">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-300">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-center gap-4 p-4"
                >
                  <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                    <FileText className="text-blue-600 w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium text-gray-900 truncate">
                        {note.title}
                      </p>
                      {note.size && (
                        <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                          {note.size}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {note.subject}
                      </span>
                      <span>•</span>
                      <span>{note.type}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {note.year}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {note.date}
                      </span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border border-gray-300 w-40">
                      <DropdownMenuItem onClick={() => openPreview(note.file)}>
                        <Eye className="w-4 h-4 mr-2" /> Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(note)}>
                        <Download className="w-4 h-4 mr-2" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(note)}>
                        <Share2 className="w-4 h-4 mr-2" /> Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(note.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* PDF PREVIEW MODAL */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-xl flex flex-col overflow-hidden border border-gray-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-300">
              <h2 className="font-semibold text-lg text-gray-900">PDF Preview</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closePreview}
                className="h-8 w-8 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* PDF Content */}
            <div className="flex-1 overflow-auto p-4 flex justify-center">
              <Document
                file={pdfUrl!}
                onLoadSuccess={({ numPages }) => setPages(numPages)}
              >
                <Page 
                  pageNumber={page} 
                  width={Math.min(800, window.innerWidth - 64)} 
                />
              </Document>
            </div>

            {/* Footer Controls */}
            <div className="p-4 border-t border-gray-300 flex items-center justify-between">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="border border-gray-300"
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Page <span className="font-medium">{page}</span> of <span className="font-medium">{pages}</span>
                </span>
              </div>
              
              <Button
                variant="outline"
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
                className="border border-gray-300"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}