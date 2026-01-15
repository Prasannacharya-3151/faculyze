import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FileText,
  Book,
  FolderOpen,
  Upload,
  X,
  Users,
  Tag,
  Loader2,
  RefreshCw,
} from "lucide-react";
import type { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useAuth } from "../../context/AuthContext";
import { apiRequest, API_BASE } from "../../lib/api";

/* ================= TYPES ================= */

interface UploadFile {
  name: string;
  size: string;
  progress: number;
  file: File;
}

interface InputFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  type?: string;
  disabled?: boolean;
}

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownBlockProps {
  label: string;
  current: string;
  icon?: ReactNode;
  onSelect: (value: string) => void;
  options: DropdownOption[];
  loading?: boolean;
  disabled?: boolean;
  onRefresh?: () => void;
}

interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    file_url: string;
    file_id: string;
  };
}

/* ================= NOTES API FUNCTIONS ================= */

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token") || "";
  }
  return "";
};

const getFacultySubjects = async (): Promise<string[]> => {
  try {
    const token = getAuthToken();
    const response = await apiRequest(
      "/faculty/ownedsubjects",
      "GET",
      null,
      token
    );
    
    console.log("Faculty subjects response:", response);
    
    if (response?.data?.subjects && Array.isArray(response.data.subjects)) {
      return response.data.subjects;
    } else if (response?.subjects && Array.isArray(response.subjects)) {
      return response.subjects;
    } else if (response?.data && Array.isArray(response.data)) {
      return response.data.map((subject: any) => subject.subject_name || subject.name || subject);
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching faculty subjects:", error);
    throw error;
  }
};

const uploadNotes = async (formData: FormData): Promise<UploadResponse> => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE}/files/upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading notes:", error);
    throw error;
  }
};

/* ================= MAIN COMPONENT ================= */

export default function UploadNotes() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    courseTitle: "",
    description: "",
    grade: "",
    subject: "",
    category: "",
    allowedGroups: "",
  });

  const [file, setFile] = useState<UploadFile | null>(null);
  const [subjects, setSubjects] = useState<DropdownOption[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [subjectError, setSubjectError] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------- EFFECTS ---------- */

  useEffect(() => {
    const fetchFacultyData = async () => {
      const token = getAuthToken();
      if (!token) {
        toast.error("Please login to upload notes");
        return;
      }

      await fetchFacultySubjects();
    };

    fetchFacultyData();
  }, []);

  /* ---------- HANDLERS ---------- */

  const fetchFacultySubjects = async () => {
    setIsLoadingSubjects(true);
    setSubjectError("");
    try {
      const facultySubjects = await getFacultySubjects();
      
      const subjectOptions = facultySubjects.map((subject: string) => ({
        label: subject.charAt(0).toUpperCase() + subject.slice(1),
        value: subject,
      }));

      setSubjects(subjectOptions);
      
      if (subjectOptions.length === 1) {
        handleDropdown("subject", subjectOptions[0].value);
      }
      
      if (subjectOptions.length === 0) {
        setSubjectError("No subjects available. Please complete your profile setup first.");
        toast.warning("No subjects found. Please complete your profile to select subjects.");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to load subjects";
      setSubjectError(errorMessage);
      
      if (errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error(`Failed to load subjects: ${errorMessage}`);
      }
      
      console.error("Error loading subjects:", error);
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDropdown = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileSelect = (uploaded: File) => {
    if (file) {
      toast.error("Only one file allowed");
      return;
    }

    if (uploaded.size > 25 * 1024 * 1024) {
      toast.error("Max file size is 25MB");
      return;
    }

    const fileExtension = uploaded.name.split('.').pop()?.toLowerCase() || '';
    const allowedExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif'];
    
    if (!allowedExtensions.includes(fileExtension)) {
      toast.error(`File type not allowed. Allowed types: ${allowedExtensions.join(', ')}`);
      return;
    }

    const newFile: UploadFile = {
      name: uploaded.name,
      size: `${(uploaded.size / (1024 * 1024)).toFixed(1)} MB`,
      progress: 0,
      file: uploaded,
    };

    setFile(newFile);
    simulateProgress();
  };

  const simulateProgress = () => {
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
      }
      setFile((prev) => (prev ? { ...prev, progress: p } : prev));
    }, 120);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (subjects.length === 0) {
      toast.error("No subjects available. Please complete your profile setup first.");
      return;
    }

    const requiredFields = [
      "courseTitle",
      "grade",
      "subject",
      "category",
      "allowedGroups",
    ] as const;

    const missingFields = requiredFields.filter(
      (field) => !formData[field]?.trim()
    );

    if (missingFields.length > 0) {
      toast.error(`Fill all required fields: ${missingFields.join(", ")}`);
      return;
    }

    if (!file) {
      toast.error("Upload one file");
      return;
    }

    if (file.progress < 100) {
      toast.error("Please wait for file upload to complete");
      return;
    }

    setIsUploading(true);

    try {
      const uploadFormData = new FormData();
      
      uploadFormData.append("file_name", formData.courseTitle);
      uploadFormData.append("description", formData.description || "");
      uploadFormData.append("grade", formData.grade);
      uploadFormData.append("subject", formData.subject);
      uploadFormData.append("category", formData.category);
      uploadFormData.append("group_allowed", formData.allowedGroups);
      uploadFormData.append("file", file.file);
      
      const fileExtension = file.file.name.split('.').pop()?.toLowerCase() || '';
      const fileTypeMap: Record<string, string> = {
        'pdf': 'pdf',
        'doc': 'doc',
        'docx': 'docx',
        'ppt': 'ppt',
        'pptx': 'pptx',
        'jpg': 'image',
        'jpeg': 'image',
        'png': 'image',
        'gif': 'image'
      };
      
      uploadFormData.append("file_type", fileTypeMap[fileExtension] || 'document');

      console.log("Uploading file with data:", {
        file_name: formData.courseTitle,
        subject: formData.subject,
        category: formData.category,
        grade: formData.grade,
        group_allowed: formData.allowedGroups,
        file_type: fileTypeMap[fileExtension] || 'document'
      });

      const response = await uploadNotes(uploadFormData);

      if (response.success) {
        toast.success("Notes uploaded successfully!");
        
        setFormData({
          courseTitle: "",
          description: "",
          grade: "",
          subject: "",
          category: "",
          allowedGroups: "",
        });
        setFile(null);
        
        console.log("File uploaded successfully:", response.data);
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error details:", error);
      toast.error(`Upload failed: ${error.message || "Please try again"}`);
    } finally {
      setIsUploading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="h-[calc(100vh-64px)] sm:overflow-auto bg-background p-4 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto"
      >
        {/* LEFT FORM */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            Upload Notes
          </h1>

          {/* Course Title */}
          <InputField
            id="courseTitle"
            label="Course Title *"
            placeholder="Enter course title"
            value={formData.courseTitle}
            onChange={handleChange}
            icon={<Book className="w-4 h-4" />}
            disabled={isUploading}
          />

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter course description (optional)"
              disabled={isUploading}
              className="w-full h-28 px-4 py-2 rounded-xl bg-transparent border border-muted outline-none focus:border-primary focus:ring-1 focus:ring-ring resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Grade and Subject */}
          <div className="grid sm:grid-cols-2 gap-4">
            <DropdownBlock
              label="Grade *"
              current={formData.grade || "Select Grade"}
              icon={<FolderOpen className="w-4 h-4" />}
              onSelect={(v) => handleDropdown("grade", v)}
              options={[
                { label: "1st PUC", value: "1st PUC" },
                { label: "2nd PUC", value: "2nd PUC" },
              ]}
              disabled={isUploading}
            />

            <DropdownBlock
              label="Subject *"
              current={formData.subject || "Select Subject"}
              icon={<FileText className="w-4 h-4" />}
              onSelect={(v) => handleDropdown("subject", v)}
              options={subjects}
              loading={isLoadingSubjects}
              disabled={isUploading || subjects.length === 0}
              onRefresh={fetchFacultySubjects}
            />
          </div>

          {/* Subject Error Message */}
          {subjectError && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{subjectError}</p>
              <p className="text-xs text-destructive/80 mt-1">
                Please complete your profile setup to select subjects.
              </p>
            </div>
          )}

          {/* Category */}
          <DropdownBlock
            label="Category *"
            current={formData.category || "Select Category"}
            icon={<Tag className="w-4 h-4" />}
            onSelect={(v) => handleDropdown("category", v)}
            options={[
              { label: "Toppers", value: "Toppers" },
              { label: "High Achievers", value: "High Achievers" },
              { label: "Medium Students", value: "Medium Students" },
              { label: "Low Students", value: "Low Students" },
              { label: "Beginner Level", value: "Beginner Level" },
              { label: "Intermediate Level", value: "Intermediate Level" },
              { label: "Advanced Level", value: "Advanced Level" },
            ]}
            disabled={isUploading}
          />

          {/* Allowed Groups */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Allowed Groups *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <Users className="w-4 h-4" />
              </span>
              <input
                id="allowedGroups"
                type="text"
                placeholder="Enter group names (comma separated)"
                value={formData.allowedGroups}
                onChange={handleChange}
                disabled={isUploading}
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-full bg-transparent border border-muted outline-none focus:border-primary focus:ring-1 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              />
              <p className="text-xs text-muted-foreground mt-1 ml-3">
                Example: Group A, Group B, Group C
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT UPLOAD (FIXED UI) */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border border-border rounded-3xl p-6 flex flex-col"
        >
          {/* TITLE */}
          <h3 className="text-lg font-semibold text-foreground text-center">
            Upload File
          </h3>
          <p className="text-xs text-muted-foreground text-center mb-4">
            Only one file allowed (PDF, DOC, DOCX, PPT, PPTX, Images)
          </p>

          {/* UPLOAD BOX (ALWAYS VISIBLE) */}
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
            onChange={(e) =>
              e.target.files && handleFileSelect(e.target.files[0])
            }
            disabled={isUploading || subjects.length === 0}
          />

          <div
            onClick={() => !isUploading && subjects.length > 0 && fileInputRef.current?.click()}
            className={`border-2 border-dashed border-border rounded-xl p-10 text-center transition ${
              isUploading || subjects.length === 0 
                ? "opacity-50 cursor-not-allowed" 
                : "cursor-pointer hover:border-primary"
            }`}
          >
            <Upload className={`mx-auto mb-2 ${
              subjects.length === 0 ? "text-muted" : "text-primary"
            }`} />
            <p className="text-sm font-medium">
              {subjects.length === 0 ? "Complete profile to upload" : "Click to upload"}
            </p>
            <p className="text-xs text-muted-foreground">(Max 25MB)</p>
          </div>

          {/* FILE PREVIEW (BELOW BOX) */}
          <div className="min-h-[120px] mt-4">
            {file && (
              <div className="p-4 rounded-xl border border-muted bg-primary/5 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium truncate">
                    {file.name}
                  </p>
                  <button 
                    onClick={() => setFile(null)}
                    className="hover:bg-muted/20 p-1 rounded"
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="h-2 bg-muted/40 rounded-full mt-2">
                  <div
                    className="h-2 bg-primary rounded-full transition-all"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs">
                  <span>{file.size}</span>
                  <span>{file.progress}%</span>
                </div>
              </div>
            )}
          </div>

          {/* SUBJECTS INFO */}
          <div className="mt-4 space-y-2">
            {subjects.length > 0 && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm font-medium text-foreground mb-1">
                  Your Selected Subjects ({subjects.length})
                </p>
                <div className="flex flex-wrap gap-1">
                  {subjects.slice(0, 3).map((subject, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                    >
                      {subject.label}
                    </span>
                  ))}
                  {subjects.length > 3 && (
                    <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                      +{subjects.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {subjects.length === 0 && !isLoadingSubjects && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">
                  No subjects available
                </p>
                <p className="text-xs text-destructive/80 mt-1">
                  Please complete your profile setup to select subjects.
                </p>
              </div>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isUploading || !file || file.progress < 100 || subjects.length === 0}
            className="mt-auto py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : subjects.length === 0 ? (
              "Complete Profile First"
            ) : (
              "Upload Notes"
            )}
          </button>
          
          {isUploading && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Please wait while we upload your file...
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function InputField({
  id,
  label,
  placeholder,
  value,
  onChange,
  icon,
  type = "text",
  disabled = false,
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs font-semibold text-foreground">
        {label}
      </label>

      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-muted group-focus-within:text-primary transition-colors duration-200">
            {icon}
          </span>
        </div>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full pl-10 pr-3 py-2.5 text-sm rounded-full bg-transparent border border-muted outline-none focus:border-primary focus:ring-1 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        />
      </div>
    </div>
  );
}

function DropdownBlock({
  label,
  current,
  icon,
  onSelect,
  options,
  loading = false,
  disabled = false,
  onRefresh,
}: DropdownBlockProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground">
          {label}
        </label>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading || disabled}
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
            type="button"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={loading || disabled}>
          <button
            type="button"
            disabled={loading || disabled}
            className="
              relative w-full pl-10 pr-10 py-2.5 rounded-full
              text-left text-sm
              bg-transparent border border-muted
              outline-none transition-all duration-200
              focus:border-primary focus:ring-1 focus:ring-ring
              hover:bg-muted/5
              disabled:opacity-50 disabled:cursor-not-allowed
              group
            "
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-muted group-focus-within:text-primary transition-colors duration-200">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  icon
                )}
              </span>
            </div>

            <span
              className={
                current.startsWith("Select")
                  ? "text-muted-foreground"
                  : "text-foreground"
              }
            >
              {loading ? "Loading..." : current}
            </span>

            {!loading && !disabled && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                ▼
              </span>
            )}
          </button>
        </DropdownMenuTrigger>

        {!loading && !disabled && (
          <DropdownMenuContent
            className="
              w-[var(--radix-dropdown-menu-trigger-width)]
              bg-background border border-muted
              rounded-xl shadow-lg max-h-60 overflow-auto
            "
          >
            {options.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
                No options available
              </div>
            ) : (
              options.map((o) => (
                <DropdownMenuItem
                  key={o.value}
                  onClick={() => onSelect(o.value)}
                  className="
                    cursor-pointer
                    text-foreground
                    hover:bg-primary/10
                    focus:bg-primary/10
                    data-[highlighted]:bg-primary/10
                    data-[highlighted]:text-foreground
                  "
                >
                  {o.label}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}


// Backend will extract faculty_id from JWT token automatically