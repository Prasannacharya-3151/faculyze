import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { cn } from "../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  FileText,
  RefreshCw,
  Trash2,
  MoreVertical,
  Search,
  Eye,
  Calendar,
  X,
  Loader2,
  Users,
  Tag,
  Book,
  School,
  Clock,
  User,
  FolderOpen,
  FileType,
  Filter,
  FileUp,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  Card,
  CardContent,
} from "../../components/ui/card";
import {
  Button
} from "../../components/ui/button";

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
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../lib/api";
import PreviewModal from "./PreviewModal";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

/* ================= TYPES ================= */

type Note = {
  id: string;
  title: string;
  description?: string;
  grade: string;
  subject: string;
  category: string;
  faculty_name: string;
  group_allowed: string;
  file_type: string;
  uploaded_at: string;
  file_size?: string;
  file_name?: string;
  signed_url?: string;
  url?: string;
};

/* ================= INPUT COMPONENT ================= */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // You can add custom props if needed
}

const Input = ({ className = "", ...props }: InputProps) => {
  return (
    <input
      className={`
        h-11 w-full pl-12 pr-10 rounded-full
        bg-transparent border border-border
        outline-none focus:border-primary focus:ring-1 focus:ring-ring
        placeholder:text-muted-foreground
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        ${className}
      `}
      {...props}
    />
  );
};

/* ================= CUSTOM SCROLLBAR STYLES ================= */

const customScrollbarStyles = `
  /* Hide scrollbar for Chrome, Safari and Opera */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

  /* Custom scrollbar styling using your variables */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgb(var(--muted));
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgb(var(--muted-foreground));
  }
`;

/* ================= CATEGORY MAPPING ================= */

const CATEGORY_OPTIONS = [
  "Notes",
  "Exam Papers", 
  "Other Study Materials"
];

const getCategoryIcon = (category: string) => {
  if (category.toLowerCase().includes("exam")) {
    return <FileText className="w-3 h-3 mr-1" />;
  } else if (category.toLowerCase().includes("notes")) {
    return <Book className="w-3 h-3 mr-1" />;
  } else {
    return <FolderOpen className="w-3 h-3 mr-1" />;
  }
};

/* ================= DELETE MODAL COMPONENT ================= */

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  documentName: string;
  loading: boolean;
}

const DeleteModal = ({ isOpen, onClose, onConfirm, documentName, loading }: DeleteModalProps) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for deletion");
      return;
    }
    
    await onConfirm(reason);
    setReason("");
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-destructive/10 p-2">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h2 className="font-semibold text-xl text-foreground">Delete File</h2>
              <p className="text-sm text-muted-foreground">Request file deletion</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-foreground mb-2">
              Are you sure you want to delete <span className="font-semibold">"{documentName}"</span>?
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Please provide a reason for deletion. This will create a delete request that needs admin approval.
            </p>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Reason for deletion *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why you want to delete this file..."
                className="w-full min-h-[100px] p-3 rounded-xl border border-border bg-transparent focus:border-primary focus:ring-1 focus:ring-ring outline-none resize-none placeholder:text-muted-foreground"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Note: File will be permanently deleted after admin approval.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                setReason("");
              }}
              disabled={loading}
              className="flex-1 rounded-full border-border hover:bg-accent/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !reason.trim()}
              className="flex-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Request Delete"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN ================= */

export default function UploadedNotes() {
  const { token } = useAuth();
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /* ---- FILTERS ---- */
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedGrade, setSelectedGrade] = useState<string>("All");

  /* ---- PDF PREVIEW ---- */
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [currentPreviewNote, setCurrentPreviewNote] = useState<Note | null>(null);

  /* ---- DELETE MODAL ---- */
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    noteId: string;
    noteName: string;
  }>({
    open: false,
    noteId: "",
    noteName: "",
  });

  /* ================= API FUNCTIONS ================= */

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("/files/recentfiles", "GET", null, token || "");
      
      if (response?.data && Array.isArray(response.data)) {
        const formattedNotes = response.data.map((note: any) => {
          
          // TITLE: If API returns empty string, use description or create from subject
          let noteTitle = note.title?.trim();
          if (!noteTitle || noteTitle === "") {
            // If description exists and is not empty, use it
            if (note.description?.trim() && note.description.trim() !== "") {
              noteTitle = note.description.trim();
            } else {
              // Create a title from subject and grade
              const subject = note.subject?.trim() || "Unknown";
              const grade = note.grade?.trim() || "";
              noteTitle = `${subject.charAt(0).toUpperCase() + subject.slice(1)} Notes ${grade}`;
            }
          }
          
          // DESCRIPTION: Use description if it's different from title
          let noteDescription = note.description?.trim() || "";
          if (noteDescription === noteTitle) {
            noteDescription = "";
          }
          
          // GRADE: FIXED - Keep as 1PUC/2PUC (don't convert to 1ST PUC/2ND PUC)
          const grade = note.grade?.trim() || "Not specified";
          let formattedGrade = grade;
          // Keep the grade as is from API (1PUC or 2PUC)
          if (grade === "2PUC" || grade === "2puc" || grade === "2ND PUC" || grade === "2nd puc") {
            formattedGrade = "2PUC";
          } else if (grade === "1PUC" || grade === "1puc" || grade === "1ST PUC" || grade === "1st puc") {
            formattedGrade = "1PUC";
          } else {
            // For any other format, keep it as is
            formattedGrade = grade.toUpperCase();
          }
          
          // SUBJECT: Capitalize properly
          const subject = note.subject?.trim() || "General";
          const formattedSubject = subject
            .split(' ')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          
          // CATEGORY: Use from API or default to "Notes"
          let category = note.category?.trim();
          if (!category || category === "" || !CATEGORY_OPTIONS.includes(category)) {
            // Default to "Notes" if category is invalid or empty
            category = "Notes";
          }
          
          // GROUP ALLOWED: Use what's in API or default
          const groupAllowed = note.group_allowed?.trim() || "All Students";
          
          // FILE TYPE: Always PDF since we only accept PDF uploads
          let fileType = "pdf";
          if (note.file_type) {
            // Ensure file_type is lowercase and valid
            const ft = note.file_type.toLowerCase().trim();
            if (ft === "pdf" || ft === "doc" || ft === "docx" || ft === "ppt" || ft === "pptx" || ft === "image") {
              fileType = ft;
            } else {
              // Check if there's a file_url to extract extension
              if (note.file_url) {
                const url = note.file_url.toLowerCase();
                if (url.includes('.pdf')) fileType = 'pdf';
                else if (url.includes('.doc')) fileType = 'doc';
                else if (url.includes('.docx')) fileType = 'docx';
                else if (url.includes('.jpg') || url.includes('.jpeg')) fileType = 'image';
                else if (url.includes('.png')) fileType = 'image';
                else if (url.includes('.ppt') || url.includes('.pptx')) fileType = 'ppt';
                else fileType = 'pdf';
              }
            }
          }
          
          // FILE NAME: Create from title and file type
          const fileName = `${noteTitle.replace(/\s+/g, '_')}.${fileType}`;
          
          // FACULTY NAME
          const facultyName = note.faculty_name?.trim() || "Faculty";
          
          // FILE SIZE
          const fileSize = note.file_size || "0";
          
          // UPLOADED DATE
          const uploadedAt = note.uploaded_at || note.created_at || new Date().toISOString();
          
          return {
            id: note.id || Math.random().toString(),
            title: noteTitle,
            description: noteDescription,
            grade: formattedGrade,
            subject: formattedSubject,
            category: category,
            faculty_name: facultyName,
            group_allowed: groupAllowed,
            file_type: fileType,
            uploaded_at: uploadedAt,
            file_size: fileSize,
            file_name: fileName,
          };
        });
        
        setNotes(formattedNotes);
      } else {
        console.error("Invalid response format:", response);
        toast.error("No notes found");
        setNotes([]);
      }
    } catch (error: any) {
      console.error("Error fetching notes:", error);
      toast.error(error.message || "Failed to load notes");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (noteId: string, reason: string) => {
    setDeletingId(noteId);
    try {
      // Use the new DELETE endpoint with payload
      const payload = { reason };
     const response = await apiRequest(`/faculty/delete/${noteId}`, "PUT", payload, token || "");

      
      if (response.status === "success") {
        toast.success("Delete request submitted successfully");
        // Remove from local state immediately
        setNotes(prev => prev.filter(note => note.id !== noteId));
      } else {
        throw new Error(response.message || "Delete request failed");
      }
    } catch (error: any) {
      console.error("Error deleting note:", error);
      toast.error(error.message || "Failed to submit delete request");
      // Still remove from local state on error? You decide:
      // setNotes(prev => prev.filter(note => note.id !== noteId));
    } finally {
      setDeletingId(null);
      setDeleteModal({ open: false, noteId: "", noteName: "" });
    }
  };

  const openDeleteModal = (note: Note) => {
    setDeleteModal({
      open: true,
      noteId: note.id,
      noteName: note.title,
    });
  };

  const openPreview = async (note: Note) => {
    setPreviewLoading(true);
    setCurrentPreviewNote(note);
    try {
      if (!note.id) {
        toast.error("File ID not available");
        return;
      }

      toast.info("Loading preview...");
      
      const response = await apiRequest(`/files/accessfile/${note.id}`, "GET", null, token || "");
      
      if (response.status === "success" && response.data?.signed_url) {
        setPdfUrl(response.data.signed_url);
        setPreviewOpen(true);
      } else {
        throw new Error(response.message || "Preview URL not available");
      }
    } catch (error: any) {
      console.error("Error opening preview:", error);
      toast.error(error.message || "Failed to open preview");
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setPdfUrl(null);
    setCurrentPreviewNote(null);
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes || bytes === "0") return "Unknown";
    try {
      const size = parseFloat(bytes);
      if (size < 1024) return size + " B";
      if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
      return (size / (1024 * 1024)).toFixed(1) + " MB";
    } catch {
      return "Unknown";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return "Recent";
    }
  };

  const getUniqueSubjects = () => {
    const subjects = notes.map(note => note.subject);
    return Array.from(new Set(subjects)).sort();
  };

  const getUniqueGrades = () => {
    const grades = notes.map(note => note.grade);
    return Array.from(new Set(grades)).sort();
  };

  const getUniqueCategories = () => {
    const categories = notes.map(note => note.category);
    return Array.from(new Set(categories)).sort();
  };

  const filteredNotes = notes.filter((note) => {
    // Search filter
    if (search.trim()) {
      const searchTerm = search.toLowerCase();
      const matchesSearch = 
        note.title?.toLowerCase().includes(searchTerm) ||
        note.subject?.toLowerCase().includes(searchTerm) ||
        note.category?.toLowerCase().includes(searchTerm) ||
        note.description?.toLowerCase().includes(searchTerm) ||
        note.grade?.toLowerCase().includes(searchTerm) ||
        note.group_allowed?.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }
    
    // Category filter
    if (selectedCategory !== "All" && note.category !== selectedCategory) {
      return false;
    }
    
    // Subject filter
    if (selectedSubject !== "All" && note.subject !== selectedSubject) {
      return false;
    }
    
    // Grade filter
    if (selectedGrade !== "All" && note.grade !== selectedGrade) {
      return false;
    }
    
    return true;
  });


  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);


  return (
    <>
      <style>{customScrollbarStyles}</style>
      
      <div className="min-h-screen bg-background p-4 md:p-6 no-scrollbar">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Uploaded Notes
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {notes.length} documents • {filteredNotes.length} filtered
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={fetchNotes}
                    disabled={loading}
                    className="h-10 w-10 p-0 flex items-center justify-center rounded-full border border-muted outline-none transition-all duration-200 hover:border-primary focus:border-primary focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
                  >
                    <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Refresh notes
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* SEARCH BAR & FILTERS - RESPONSIVE */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Left Side - Search */}
              <div className="w-full lg:w-auto lg:flex-1">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  </div>

                  <Input
                    placeholder="Search notes by title, subject, category, or group..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="
                        absolute inset-y-0 right-0 pr-3 flex items-center
                        text-muted-foreground hover:text-foreground hover:bg-accent/10
                        transition-colors rounded-full p-1
                      "
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Side - Filters */}
              <div className="w-full lg:w-auto">
                {/* FILTERS - RIGHT SIDE */}
                {notes.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 sm:mb-0">
                      <Filter className="w-4 h-4" />
                      <span className="hidden sm:inline">Filter by:</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {/* Category Filter */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="h-8 min-w-[140px] px-3 rounded-full border hover:border-2 border-muted outline-none transition-all duration-200 hover:border-primary focus:border-primary focus:ring-1 focus:ring-ring flex items-center justify-between gap-2 text-sm bg-transparent"
                          >
                            <div className="flex items-center gap-2">
                              <Tag className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">
                                {selectedCategory === "All" ? "All Categories" : selectedCategory}
                              </span>
                            </div>
                            <span className="text-xs opacity-60">▼</span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-muted bg-card w-48">
                          <DropdownMenuItem 
                            onClick={() => setSelectedCategory("All")}
                            className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
                          >
                            All Categories
                          </DropdownMenuItem>
                          {getUniqueCategories().map((category) => (
                            <DropdownMenuItem 
                              key={category}
                              onClick={() => setSelectedCategory(category)}
                              className="flex items-center gap-2 hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
                            >
                              {getCategoryIcon(category)}
                              {category}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      {/* Subject Filter */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="h-8 min-w-[140px] px-3 rounded-full border hover:border-2 border-muted outline-none transition-all duration-200 hover:border-primary focus:border-primary focus:ring-1 focus:ring-ring flex items-center justify-between gap-2 text-sm bg-transparent"
                          >
                            <div className="flex items-center gap-2">
                              <Book className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">
                                {selectedSubject === "All" ? "All Subjects" : selectedSubject}
                              </span>
                            </div>
                            <span className="text-xs opacity-60">▼</span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-muted bg-card w-48">
                          <DropdownMenuItem 
                            onClick={() => setSelectedSubject("All")}
                            className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
                          >
                            All Subjects
                          </DropdownMenuItem>
                          {getUniqueSubjects().map((subject) => (
                            <DropdownMenuItem 
                              key={subject}
                              onClick={() => setSelectedSubject(subject)}
                              className="flex items-center gap-2 hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
                            >
                              <Book className="w-3.5 h-3.5" />
                              {subject}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      {/* Grade Filter */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="h-8 min-w-[120px] px-3 rounded-full border hover:border-2 border-muted outline-none transition-all duration-200 hover:border-primary focus:border-primary focus:ring-1 focus:ring-ring flex items-center justify-between gap-2 text-sm bg-transparent"
                          >
                            <div className="flex items-center gap-2">
                              <School className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">
                                {selectedGrade === "All" ? "All Grades" : selectedGrade}
                              </span>
                            </div>
                            <span className="text-xs opacity-60">▼</span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-muted bg-card w-48">
                          <DropdownMenuItem 
                            onClick={() => setSelectedGrade("All")}
                            className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
                          >
                            All Grades
                          </DropdownMenuItem>
                          {getUniqueGrades().map((grade) => (
                            <DropdownMenuItem 
                              key={grade}
                              onClick={() => setSelectedGrade(grade)}
                              className="flex items-center gap-2 hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
                            >
                              <School className="w-3.5 h-3.5" />
                              {grade}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      {/* Clear Filters - Only show when a filter is selected */}
                      {(selectedCategory !== "All" || selectedSubject !== "All" || selectedGrade !== "All") && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory("All");
                            setSelectedSubject("All");
                            setSelectedGrade("All");
                          }}
                          className="h-8 px-3 rounded-full text-sm hover:bg-primary/10 transition-all duration-200 border border-transparent hover:border-primary/30 whitespace-nowrap"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading your notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <Card className="border border-border">
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {notes.length === 0 ? "No notes uploaded yet" : "No notes found"}
              </h3>
              <p className="text-muted-foreground">
                {notes.length === 0 
                  ? "Upload your first note to get started!" 
                  : "Try a different search term or filter"}
              </p>
            </CardContent>
          </Card>
        ) : (
          /* GRID VIEW ONLY - RESPONSIVE */
          <div className="grid gap-6 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {filteredNotes.map((note) => (
              <Card 
                key={note.id} 
                className="border border-border bg-card hover:border-accent/30 transition-all duration-300 hover:shadow-lg group"
              >
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-2 flex-1">
                      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                        {note.file_type === 'pdf' ? (
                          <FileText className="text-primary w-4 h-4" />
                        ) : note.file_type === 'image' ? (
                          <FileType className="text-primary w-4 h-4" />
                        ) : (
                          <FileUp className="text-primary w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
                          {note.title}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs bg-muted/20 text-foreground px-1.5 py-0">
                            {note.file_type.toUpperCase()}
                          </Badge>
                          {note.file_size && note.file_size !== "0" && (
                            <span className="text-xs text-muted-foreground">
                              • {formatFileSize(note.file_size)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-accent/10"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border border-border bg-card w-40">
                        <DropdownMenuItem 
                          onClick={() => openPreview(note)}
                          className="hover:bg-accent/10 focus:bg-accent/10 cursor-pointer text-sm flex items-center"
                          disabled={previewLoading}
                        >
                          {previewLoading && currentPreviewNote?.id === note.id ? (
                            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                          ) : (
                            <Eye className="w-3.5 h-3.5 mr-2" />
                          )}
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openDeleteModal(note)}
                          className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer text-sm flex items-center"
                          disabled={deletingId === note.id}
                        >
                          {deletingId === note.id ? (
                            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5 mr-2" />
                          )}
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Description */}
                  {note.description && note.description.trim() !== "" && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {note.description}
                    </p>
                  )}

                  {/* Info Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary px-2 py-0.5 flex items-center">
                      <School className="w-2.5 h-2.5 mr-1" />
                      {note.grade}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 flex items-center">
                      <Book className="w-2.5 h-2.5 mr-1" />
                      {note.subject}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 flex items-center">
                      {getCategoryIcon(note.category)}
                      {note.category}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-purple-500/10 text-purple-500 px-2 py-0.5 flex items-center">
                      <Users className="w-2.5 h-2.5 mr-1" />
                      {note.group_allowed}
                    </Badge>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="truncate">{note.faculty_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(note.uploaded_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* PDF PREVIEW MODAL */}
        <PreviewModal
          isOpen={previewOpen}
          onClose={closePreview}
          pdfUrl={pdfUrl}
          currentPreviewNote={currentPreviewNote}
        />

        {/* DELETE CONFIRMATION MODAL */}
        <DeleteModal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, noteId: "", noteName: "" })}
          onConfirm={(reason) => handleDeleteRequest(deleteModal.noteId, reason)}
          documentName={deleteModal.noteName}
          loading={deletingId === deleteModal.noteId}
        />
      </div>
    </>
  );
}
// import { useState, useEffect, useRef } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import { cn } from "../../lib/utils";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "../../components/ui/tooltip";
// import {
//   FileText,
//   RefreshCw,
//   Trash2,
//   MoreVertical,
//   Search,
//   Eye,
//   Calendar,
//   X,
//   Loader2,
//   Users,
//   Tag,
//   Book,
//   School,
//   Clock,
//   User,
//   Download,
//   AlertCircle,
//   ExternalLink,
// } from "lucide-react";
// import { toast } from "react-toastify";

// import {
//   Card,
//   CardContent,
// } from "../../components/ui/card";
// import {
//   Button
// } from "../../components/ui/button";

// import {
//   Badge
// } from "../../components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
// } from "../../components/ui/dropdown-menu";
// import { useAuth } from "../../context/AuthContext";
// import { apiRequest } from "../../lib/api";

// // Use a compatible version - v2.16.105 works well with react-pdf@7.7.2
// // Try different CDN options
// const PDF_VERSION = "2.16.105";
// const CDN_URLS = [
//   `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_VERSION}/pdf.worker.min.js`,
//   `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_VERSION}/pdf.worker.min.js`,
//   `https://unpkg.com/pdfjs-dist@${PDF_VERSION}/build/pdf.worker.min.js`,
// ];

// // Function to try different CDNs
// const setupPdfWorker = () => {
//   for (let i = 0; i < CDN_URLS.length; i++) {
//     try {
//       pdfjs.GlobalWorkerOptions.workerSrc = CDN_URLS[i];
//       console.log(`Using PDF worker from: ${CDN_URLS[i]}`);
//       return true;
//     } catch (error) {
//       console.warn(`Failed to load worker from ${CDN_URLS[i]}:`, error);
//     }
//   }
//   console.error("All PDF worker CDNs failed");
//   return false;
// };

// // Initialize PDF worker
// setupPdfWorker();

// /* ================= TYPES ================= */

// type Note = {
//   id: string;
//   title: string;
//   description?: string;
//   grade: string;
//   subject: string;
//   category: string;
//   faculty_name: string;
//   group_allowed: string;
//   file_type: string;
//   uploaded_at: string;
//   file_size?: string;
//   file_name?: string;
//   signed_url?: string;
//   url?: string;
// };

// /* ================= INPUT COMPONENT ================= */

// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   // You can add custom props if needed
// }

// const Input = ({ className = "", ...props }: InputProps) => {
//   return (
//     <input
//       className={`
//         h-11 w-full pl-12 pr-10 rounded-full
//         bg-transparent border border-border
//         outline-none focus:border-primary focus:ring-1 focus:ring-ring
//         placeholder:text-muted-foreground
//         disabled:opacity-50 disabled:cursor-not-allowed
//         transition-all duration-200
//         ${className}
//       `}
//       {...props}
//     />
//   );
// };

// /* ================= CUSTOM SCROLLBAR STYLES ================= */

// const customScrollbarStyles = `
//   /* Hide scrollbar for Chrome, Safari and Opera */
//   .no-scrollbar::-webkit-scrollbar {
//     display: none;
//   }

//   /* Hide scrollbar for IE, Edge and Firefox */
//   .no-scrollbar {
//     -ms-overflow-style: none;  /* IE and Edge */
//     scrollbar-width: none;  /* Firefox */
//   }

//   /* Custom scrollbar styling using your variables */
//   .custom-scrollbar::-webkit-scrollbar {
//     width: 6px;
//     height: 6px;
//   }

//   .custom-scrollbar::-webkit-scrollbar-track {
//     background: transparent;
//   }

//   .custom-scrollbar::-webkit-scrollbar-thumb {
//     background: rgb(var(--muted));
//     border-radius: 3px;
//   }

//   .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//     background: rgb(var(--muted-foreground));
//   }
// `;

// /* ================= MAIN ================= */

// export default function UploadedNotes() {
//   const { token } = useAuth();
//   const [search, setSearch] = useState("");
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState<string | null>(null);

//   /* ---- PDF PREVIEW ---- */
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(0);
//   const [previewLoading, setPreviewLoading] = useState(false);
//   const [currentPreviewNote, setCurrentPreviewNote] = useState<Note | null>(null);
//   const [pdfLoadError, setPdfLoadError] = useState<string | null>(null);
//   const [debugInfo, setDebugInfo] = useState<string>("");
  
//   // Ref to store the PDF URL for debugging
//   const pdfUrlRef = useRef<string | null>(null);

//   /* ================= API FUNCTIONS ================= */

//   const fetchNotes = async () => {
//     setLoading(true);
//     try {
//       const response = await apiRequest("/files/recentfiles", "GET", null, token || "");
      
//       if (response?.data && Array.isArray(response.data)) {
//         const formattedNotes = response.data.map((note: any) => {
          
//           // TITLE: If API returns empty string, use description or create from subject
//           let noteTitle = note.title?.trim();
//           if (!noteTitle || noteTitle === "") {
//             // If description exists and is not empty, use it
//             if (note.description?.trim() && note.description.trim() !== "") {
//               noteTitle = note.description.trim();
//             } else {
//               // Create a title from subject and grade
//               const subject = note.subject?.trim() || "Unknown";
//               const grade = note.grade?.trim() || "";
//               noteTitle = `${subject.charAt(0).toUpperCase() + subject.slice(1)} Notes ${grade}`;
//             }
//           }
          
//           // DESCRIPTION: Use description if it's different from title
//           let noteDescription = note.description?.trim() || "";
//           if (noteDescription === noteTitle) {
//             noteDescription = "";
//           }
          
//           // GRADE: Format properly
//           const grade = note.grade?.trim() || "Not specified";
//           let formattedGrade = grade;
//           if (grade === "2PUC" || grade === "2puc") {
//             formattedGrade = "2ND PUC";
//           } else if (grade === "1PUC" || grade === "1puc") {
//             formattedGrade = "1ST PUC";
//           } else {
//             formattedGrade = grade.toUpperCase().includes("PUC") 
//               ? grade.toUpperCase() 
//               : grade;
//           }
          
//           // SUBJECT: Capitalize properly
//           const subject = note.subject?.trim() || "General";
//           const formattedSubject = subject
//             .split(' ')
//             .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//             .join(' ');
          
//           // CATEGORY: If API returns empty, use a default based on group_allowed or subject
//           let category = note.category?.trim();
//           if (!category || category === "") {
//             // Try to infer category from group_allowed or use default
//             const group = note.group_allowed?.toUpperCase() || "";
//             if (group.includes("A") || group.includes("T") || group.includes("TOPPER")) {
//               category = "Toppers";
//             } else if (group.includes("B") || group.includes("H") || group.includes("HIGH")) {
//               category = "High Achievers";
//             } else if (group.includes("C") || group.includes("M") || group.includes("MEDIUM")) {
//               category = "Medium Students";
//             } else if (group.includes("D") || group.includes("L") || group.includes("LOW")) {
//               category = "Low Students";
//             } else if (group.includes("E") || group.includes("B") || group.includes("BEGINNER")) {
//               category = "Beginner Level";
//             } else if (group.includes("F") || group.includes("I") || group.includes("INTERMEDIATE")) {
//               category = "Intermediate Level";
//             } else if (group.includes("G") || group.includes("A") || group.includes("ADVANCED")) {
//               category = "Advanced Level";
//             } else {
//               category = "Study Material";
//             }
//           }
          
//           // GROUP ALLOWED: Use what's in API or default
//           const groupAllowed = note.group_allowed?.trim() || "All Students";
          
//           // FILE TYPE: If API returns empty, check file_url or use default
//           let fileType = note.file_type?.toLowerCase()?.trim();
//           if (!fileType || fileType === "") {
//             // Check if there's a file_url to extract extension
//             if (note.file_url) {
//               const url = note.file_url.toLowerCase();
//               if (url.includes('.pdf')) fileType = 'pdf';
//               else if (url.includes('.doc')) fileType = 'doc';
//               else if (url.includes('.docx')) fileType = 'docx';
//               else if (url.includes('.jpg') || url.includes('.jpeg')) fileType = 'image';
//               else if (url.includes('.png')) fileType = 'image';
//               else if (url.includes('.ppt') || url.includes('.pptx')) fileType = 'ppt';
//               else fileType = 'pdf';
//             } else {
//               fileType = 'pdf';
//             }
//           }
          
//           // FILE NAME: Create from title and file type
//           const fileName = `${noteTitle.replace(/\s+/g, '_')}.${fileType}`;
          
//           // FACULTY NAME
//           const facultyName = note.faculty_name?.trim() || "Faculty";
          
//           // FILE SIZE
//           const fileSize = note.file_size || "0";
          
//           // UPLOADED DATE
//           const uploadedAt = note.uploaded_at || note.created_at || new Date().toISOString();
          
//           return {
//             id: note.id || Math.random().toString(),
//             title: noteTitle,
//             description: noteDescription,
//             grade: formattedGrade,
//             subject: formattedSubject,
//             category: category,
//             faculty_name: facultyName,
//             group_allowed: groupAllowed,
//             file_type: fileType,
//             uploaded_at: uploadedAt,
//             file_size: fileSize,
//             file_name: fileName,
//             signed_url: note.signed_url || note.file_url || "",
//           };
//         });
        
//         setNotes(formattedNotes);
//       } else {
//         console.error("Invalid response format:", response);
//         toast.error("No notes found");
//         setNotes([]);
//       }
//     } catch (error: any) {
//       console.error("Error fetching notes:", error);
//       toast.error(error.message || "Failed to load notes");
//       setNotes([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteNote = async (id: string) => {
//     if (!window.confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
//       return;
//     }

//     setDeletingId(id);
//     try {
//       const response = await apiRequest(`/files/delete/${id}`, "DELETE", null, token || "");
      
//       if (response.status === "success") {
//         toast.success("Note deleted successfully");
//         setNotes(prev => prev.filter(note => note.id !== id));
//       } else {
//         throw new Error(response.message || "Delete failed");
//       }
//     } catch (error: any) {
//       console.error("Error deleting note:", error);
//       toast.error(error.message || "Failed to delete note");
//       setNotes(prev => prev.filter(note => note.id !== id));
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Test if URL is accessible
//   const testUrlAccessibility = async (url: string): Promise<boolean> => {
//     try {
//       const response = await fetch(url, {
//         method: 'HEAD',
//         mode: 'cors',
//         cache: 'no-cache',
//       });
//       return response.ok;
//     } catch (error) {
//       console.log("URL test failed:", error);
//       return false;
//     }
//   };

//   const openPreview = async (note: Note) => {
//     setPreviewLoading(true);
//     setCurrentPreviewNote(note);
//     setPdfLoadError(null);
//     setDebugInfo("");
    
//     try {
//       if (!note.id) {
//         toast.error("File ID not available");
//         return;
//       }

//       toast.info("Loading preview...");
      
//       const response = await apiRequest(`/files/accessfile/${note.id}`, "GET", null, token || "");
      
//       if (response.status === "success" && response.data?.signed_url) {
//         let signedUrl = response.data.signed_url;
        
//         // Clean up the URL
//         signedUrl = signedUrl.trim();
        
//         // Check if URL is valid
//         if (!signedUrl || signedUrl === "") {
//           throw new Error("Invalid PDF URL - URL is empty");
//         }
        
//         console.log("PDF URL received:", signedUrl);
//         console.log("URL length:", signedUrl.length);
//         console.log("URL starts with http:", signedUrl.startsWith('http'));
        
//         setDebugInfo(`URL: ${signedUrl.substring(0, 100)}...`);
        
//         // Test if the URL is accessible
//         const isAccessible = await testUrlAccessibility(signedUrl);
//         console.log("URL accessible:", isAccessible);
        
//         if (!isAccessible) {
//           console.warn("URL may not be accessible due to CORS or other issues");
//           setDebugInfo(prev => prev + " (CORS/access issue detected)");
//         }
        
//         // Store URL in ref for debugging
//         pdfUrlRef.current = signedUrl;
        
//         setPdfUrl(signedUrl);
//         setPreviewOpen(true);
//         setPage(1);
//         setPages(0);
//       } else {
//         throw new Error(response.message || "Preview URL not available in response");
//       }
//     } catch (error: any) {
//       console.error("Error opening preview:", error);
//       const errorMsg = error.message || "Failed to open preview";
//       toast.error(errorMsg);
//       setPdfLoadError(errorMsg);
//       setPreviewOpen(true); // Still open modal to show error
//     } finally {
//       setPreviewLoading(false);
//     }
//   };

//   const closePreview = () => {
//     setPreviewOpen(false);
//     setPdfUrl(null);
//     setPage(1);
//     setPages(0);
//     setCurrentPreviewNote(null);
//     setPdfLoadError(null);
//     setDebugInfo("");
//     pdfUrlRef.current = null;
//   };

//   const handlePdfLoadSuccess = ({ numPages }: { numPages: number }) => {
//     console.log("✅ PDF loaded successfully, pages:", numPages);
//     setPages(numPages);
//     setPdfLoadError(null);
//   };

//   const handlePdfLoadError = (error: Error) => {
//     console.error("❌ PDF load error:", error);
//     console.error("Error details:", error.message, error.name);
    
//     let errorMsg = "Failed to load PDF. ";
    
//     if (error.message.includes('Failed to fetch')) {
//       errorMsg += "Network error or CORS issue detected. ";
//       errorMsg += "The PDF URL might not be accessible from this domain.";
//     } else if (error.message.includes('Invalid PDF')) {
//       errorMsg += "The file might be corrupted or in an unsupported format.";
//     } else {
//       errorMsg += "Please try downloading the file instead.";
//     }
    
//     setPdfLoadError(errorMsg);
//     toast.error("Failed to load PDF preview");
    
//     // Log the URL that failed
//     if (pdfUrlRef.current) {
//       console.error("Failed URL:", pdfUrlRef.current);
//     }
//   };

//   // Function to open PDF in new tab as fallback
//   const openPdfInNewTab = () => {
//     if (pdfUrlRef.current) {
//       window.open(pdfUrlRef.current, '_blank', 'noopener,noreferrer');
//     } else if (currentPreviewNote?.signed_url) {
//       window.open(currentPreviewNote.signed_url, '_blank', 'noopener,noreferrer');
//     } else {
//       toast.error("No PDF URL available");
//     }
//   };

//   const formatFileSize = (bytes?: string) => {
//     if (!bytes || bytes === "0") return "Unknown";
//     try {
//       const size = parseFloat(bytes);
//       if (size < 1024) return size + " B";
//       if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
//       return (size / (1024 * 1024)).toFixed(1) + " MB";
//     } catch {
//       return "Unknown";
//     }
//   };

//   const formatDate = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric'
//       });
//     } catch {
//       return "Recent";
//     }
//   };

//   /* ================= EFFECTS ================= */

//   useEffect(() => {
//     if (token) {
//       fetchNotes();
//     }
//   }, [token]);

//   const filteredNotes = notes.filter((n) => {
//     if (!search.trim()) return true;
    
//     const searchTerm = search.toLowerCase();
//     return (
//       n.title?.toLowerCase().includes(searchTerm) ||
//       n.subject?.toLowerCase().includes(searchTerm) ||
//       n.category?.toLowerCase().includes(searchTerm) ||
//       n.description?.toLowerCase().includes(searchTerm) ||
//       n.grade?.toLowerCase().includes(searchTerm) ||
//       n.group_allowed?.toLowerCase().includes(searchTerm)
//     );
//   });

//   /* ================= UI ================= */

//   return (
//     <>
//       <style>{customScrollbarStyles}</style>
      
//       <div className="min-h-screen bg-background p-4 md:p-6 no-scrollbar">

//         {/* HEADER */}
//         <div className="mb-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-foreground">
//                 Uploaded Notes
//               </h1>
//               <p className="text-muted-foreground text-sm mt-1">
//                 {notes.length} documents • {filteredNotes.length} filtered
//               </p>
//             </div>

//              <div className="flex items-center gap-3">
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={fetchNotes}
//                     disabled={loading}
//                     className="rounded-full border-border hover:border-primary transition-all"
//                   >
//                     <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   Refresh notes
//                 </TooltipContent>
//               </Tooltip>
//             </div>
//           </div>

//           {/* SEARCH BAR */}
//           <div className="relative w-full max-w-md">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <Search className="w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
//             </div>

//             <Input
//               placeholder="Search notes by title, subject, category, or group..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />

//             {search && (
//               <button
//                 type="button"
//                 onClick={() => setSearch("")}
//                 className="
//                   absolute inset-y-0 right-0 pr-3 flex items-center
//                   text-muted-foreground hover:text-foreground hover:bg-accent/10
//                   transition-colors rounded-full p-1
//                 "
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* CONTENT */}
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
//             <p className="text-muted-foreground">Loading your notes...</p>
//           </div>
//         ) : filteredNotes.length === 0 ? (
//           <Card className="border border-border">
//             <CardContent className="p-12 text-center">
//               <FileText className="w-12 h-12 text-muted mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-foreground mb-2">
//                 {notes.length === 0 ? "No notes uploaded yet" : "No notes found"}
//               </h3>
//               <p className="text-muted-foreground">
//                 {notes.length === 0 
//                   ? "Upload your first note to get started!" 
//                   : "Try a different search term"}
//               </p>
//             </CardContent>
//           </Card>
//         ) : (
//           /* GRID VIEW ONLY */
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {filteredNotes.map((note) => (
//               <Card 
//                 key={note.id} 
//                 className="border border-border bg-card hover:border-accent/30 transition-all duration-300 hover:shadow-lg group"
//               >
//                 <CardContent className="p-4">
//                   {/* Header */}
//                   <div className="flex justify-between items-start mb-3">
//                     <div className="flex items-start gap-2 flex-1">
//                       <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
//                         <FileText className="text-primary w-4 h-4" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
//                           {note.title}
//                         </h3>
//                         <div className="flex items-center gap-1">
//                           <Badge variant="secondary" className="text-xs bg-muted/20 text-foreground px-1.5 py-0">
//                             {note.file_type.toUpperCase()}
//                           </Badge>
//                           {note.file_size && note.file_size !== "0" && (
//                             <span className="text-xs text-muted-foreground">
//                               • {formatFileSize(note.file_size)}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
                    
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button 
//                           variant="ghost" 
//                           size="sm"
//                           className="h-7 w-7 p-0 hover:bg-accent/10"
//                         >
//                           <MoreVertical className="w-3.5 h-3.5" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end" className="border border-border bg-card w-40">
//                         <DropdownMenuItem 
//                           onClick={() => openPreview(note)}
//                           className="hover:bg-accent/10 focus:bg-accent/10 cursor-pointer text-sm"
//                           disabled={previewLoading}
//                         >
//                           {previewLoading && currentPreviewNote?.id === note.id ? (
//                             <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
//                           ) : (
//                             <Eye className="w-3.5 h-3.5 mr-2" />
//                           )}
//                           Preview
//                         </DropdownMenuItem>
//                         <DropdownMenuItem 
//                           onClick={() => {
//                             if (note.signed_url) {
//                               window.open(note.signed_url, '_blank', 'noopener,noreferrer');
//                             } else {
//                               toast.info("Download URL not available");
//                             }
//                           }}
//                           className="hover:bg-accent/10 focus:bg-accent/10 cursor-pointer text-sm"
//                         >
//                           <Download className="w-3.5 h-3.5 mr-2" />
//                           Download
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem
//                           onClick={() => deleteNote(note.id)}
//                           className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer text-sm"
//                           disabled={deletingId === note.id}
//                         >
//                           {deletingId === note.id ? (
//                             <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
//                           ) : (
//                             <Trash2 className="w-3.5 h-3.5 mr-2" />
//                           )}
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>

//                   {/* Description */}
//                   {note.description && note.description.trim() !== "" && (
//                     <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
//                       {note.description}
//                     </p>
//                   )}

//                   {/* Info Badges */}
//                   <div className="flex flex-wrap gap-1.5 mb-3">
//                     <Badge variant="secondary" className="text-xs bg-primary/10 text-primary px-2 py-0.5">
//                       <School className="w-2.5 h-2.5 mr-1" />
//                       {note.grade}
//                     </Badge>
//                     <Badge variant="secondary" className="text-xs bg-muted/20 text-foreground px-2 py-0.5">
//                       <Book className="w-2.5 h-2.5 mr-1" />
//                       {note.subject}
//                     </Badge>
//                     <Badge variant="secondary" className="text-xs bg-muted/20 text-foreground px-2 py-0.5">
//                       <Tag className="w-2.5 h-2.5 mr-1" />
//                       {note.category}
//                     </Badge>
//                     <Badge variant="secondary" className="text-xs bg-muted/20 text-foreground px-2 py-0.5">
//                       <Users className="w-2.5 h-2.5 mr-1" />
//                       {note.group_allowed}
//                     </Badge>
//                   </div>

//                   {/* Footer */}
//                   <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
//                     <div className="flex items-center gap-1">
//                       <User className="w-3 h-3" />
//                       <span>{note.faculty_name}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Calendar className="w-3 h-3" />
//                       <span>{formatDate(note.uploaded_at)}</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}

//         {/* PDF PREVIEW MODAL - FIXED */}
//         {previewOpen && (
//           <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
//             <div className="bg-card w-full max-w-6xl h-[90vh] rounded-2xl flex flex-col overflow-hidden border border-border shadow-2xl">
//               {/* Header */}
//               <div className="flex items-center justify-between p-6 border-b border-border bg-card/95 backdrop-blur-sm">
//                 <div className="flex items-center gap-3">
//                   <FileText className="w-6 h-6 text-primary" />
//                   <div>
//                     <h2 className="font-semibold text-xl text-foreground">PDF Preview</h2>
//                     {currentPreviewNote && (
//                       <p className="text-sm text-muted-foreground">{currentPreviewNote.title}</p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={openPdfInNewTab}
//                     className="gap-2"
//                   >
//                     <ExternalLink className="w-4 h-4" />
//                     Open in new tab
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={closePreview}
//                     className="h-10 w-10 p-0 hover:bg-destructive/10 hover:text-destructive rounded-full"
//                   >
//                     <X className="w-5 h-5" />
//                   </Button>
//                 </div>
//               </div>

//               {/* PDF Content */}
//               <div className="flex-1 overflow-auto p-4 md:p-6 flex justify-center custom-scrollbar bg-background/30">
//                 {pdfLoadError ? (
//                   <div className="flex flex-col items-center justify-center h-full w-full max-w-2xl">
//                     <AlertCircle className="w-16 h-16 text-destructive mb-4" />
//                     <h3 className="text-xl font-semibold text-foreground mb-2">Failed to Load PDF</h3>
//                     <p className="text-muted-foreground text-center mb-4">{pdfLoadError}</p>
                    
//                     {debugInfo && (
//                       <div className="bg-muted/20 p-3 rounded-lg mb-4 w-full">
//                         <p className="text-xs text-muted-foreground font-mono break-all">
//                           {debugInfo}
//                         </p>
//                       </div>
//                     )}
                    
//                     <div className="flex gap-3">
//                       <Button
//                         variant="outline"
//                         onClick={() => currentPreviewNote && openPreview(currentPreviewNote)}
//                         className="gap-2"
//                       >
//                         <RefreshCw className="w-4 h-4" />
//                         Retry Preview
//                       </Button>
//                       <Button
//                         onClick={openPdfInNewTab}
//                         className="gap-2"
//                       >
//                         <ExternalLink className="w-4 h-4" />
//                         Open in New Tab
//                       </Button>
//                     </div>
                    
//                     <div className="mt-6 text-sm text-muted-foreground">
//                       <p className="mb-1">Common issues:</p>
//                       <ul className="list-disc pl-5 text-left space-y-1">
//                         <li>CORS restrictions on the PDF server</li>
//                         <li>PDF URL might have expired or is invalid</li>
//                         <li>Network connectivity issues</li>
//                         <li>PDF file might be corrupted</li>
//                       </ul>
//                     </div>
//                   </div>
//                 ) : pdfUrl ? (
//                   <div className="w-full">
//                     <Document
//                       file={{
//                         url: pdfUrl,
//                         httpHeaders: {
//                           'Authorization': `Bearer ${token}`,
//                           'Accept': 'application/pdf',
//                         },
//                         withCredentials: true,
//                       }}
//                       onLoadSuccess={handlePdfLoadSuccess}
//                       onLoadError={handlePdfLoadError}
//                       loading={
//                         <div className="flex flex-col items-center justify-center h-64">
//                           <div className="relative mb-4">
//                             <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
//                             <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
//                           </div>
//                           <p className="text-muted-foreground">Loading document...</p>
//                           <p className="text-muted-foreground text-xs mt-2">This may take a moment</p>
//                         </div>
//                       }
//                       error={
//                         <div className="flex flex-col items-center justify-center h-64">
//                           <FileText className="w-16 h-16 text-destructive mb-4" />
//                           <p className="text-destructive font-medium mb-2">Failed to load PDF</p>
//                           <p className="text-muted-foreground text-sm">Please try opening in a new tab instead.</p>
//                           <Button
//                             onClick={openPdfInNewTab}
//                             className="mt-4 gap-2"
//                           >
//                             <ExternalLink className="w-4 h-4" />
//                             Open in New Tab
//                           </Button>
//                         </div>
//                       }
//                     >
//                       <Page 
//                         pageNumber={page} 
//                         width={Math.min(1000, window.innerWidth - 96)} 
//                         className="shadow-lg rounded-lg bg-white mx-auto"
//                         renderTextLayer={true}
//                         renderAnnotationLayer={true}
//                       />
//                     </Document>
//                   </div>
//                 ) : (
//                   <div className="flex flex-col items-center justify-center h-full">
//                     <FileText className="w-16 h-16 text-muted mb-4" />
//                     <p className="text-muted-foreground">Unable to load document</p>
//                     <p className="text-muted-foreground text-sm mt-1">No PDF URL available</p>
//                   </div>
//                 )}
//               </div>

//               {/* Footer Controls */}
//               {pages > 0 && !pdfLoadError && (
//                 <div className="p-4 border-t border-border flex items-center justify-between bg-card/95 backdrop-blur-sm">
//                   <div className="flex items-center gap-3">
//                     <Button
//                       variant="outline"
//                       disabled={page <= 1}
//                       onClick={() => setPage(p => p - 1)}
//                       className="border-border hover:bg-accent hover:text-accent-foreground px-4"
//                     >
//                       Previous
//                     </Button>
//                     <Button
//                       variant="outline"
//                       disabled={page >= pages}
//                       onClick={() => setPage(p => p + 1)}
//                       className="border-border hover:bg-accent hover:text-accent-foreground px-4"
//                     >
//                       Next
//                     </Button>
//                   </div>
                  
//                   <div className="flex items-center gap-4">
//                     <span className="text-sm text-muted-foreground">
//                       Page <span className="font-medium text-foreground">{page}</span> of <span className="font-medium text-foreground">{pages}</span>
//                     </span>
//                   </div>
                  
//                   <div className="flex items-center gap-2">
//                     <Clock className="w-4 h-4 text-muted-foreground" />
//                     <span className="text-sm text-muted-foreground">
//                       Preview expires in 15 minutes
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }