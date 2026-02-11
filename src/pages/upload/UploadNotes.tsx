import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FileText,
  Book,
  FolderOpen,
  X,
  Users,
  Tag,
  Loader2,
  RefreshCw,
  FileUp,
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

interface UploadNotesFormData {
  courseTitle: string;
  description: string;
  grade: string;
  subject: string;
  category: string;
  allowedGroups: string;
}

// Types matching backend structure
interface InitiateUploadPayload {
  file_name: string;
  description: string;
  grade: string;
  subject: string;
  category: string;
  group_allowed: string;
  file_type: string;
    faculty_id: string;
}

interface InitiateUploadResponse {
  upload_url: string;
  file_key: string;
}

interface CompleteUploadPayload extends InitiateUploadPayload {
  file_key: string;
}

const getFacultySubjects = async (token: string): Promise<string[]> => {
  try {
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

// Step 1: Initiate upload - get pre-signed URL from backend
// Using direct fetch since apiRequest might have issues
const initiateUpload = async (payload: InitiateUploadPayload, token: string): Promise<InitiateUploadResponse> => {
  try {
    const response = await fetch(`${API_BASE}/files/upload/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    console.log("Initiate upload response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Initiate upload error response:", errorText);
      
      if (response.status === 404) {
        throw new Error("Upload endpoint not found. Please check backend routes.");
      }
      
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    
   const json = await response.json();

console.log("Full initiate response:", json);

const upload_url = json.data?.upload_url;
const file_key = json.data?.file_key;

if (!upload_url || !file_key) {
  throw new Error("Invalid response: Missing upload_url or file_key");
}

return { upload_url, file_key };

  } catch (error: any) {
    console.error("Initiate upload error:", error);
    throw new Error(error.message || "Failed to initiate upload");
  }
};

// Step 2: Upload file directly to S3
const uploadToS3 = async (uploadUrl: string, file: File, onProgress?: (progress: number) => void) => {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });
    
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`S3 upload failed with status ${xhr.status}`));
      }
    });
    
    xhr.addEventListener("error", () => {
      reject(new Error("Network error during S3 upload"));
    });
    
    xhr.addEventListener("abort", () => {
      reject(new Error("Upload cancelled"));
    });
    
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
};

// Step 3: Complete upload - notify backend
const completeUpload = async (payload: CompleteUploadPayload, token: string) => {
  try {
    const response = await fetch(`${API_BASE}/files/upload/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    console.log("Complete upload response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Complete upload error response:", errorText);
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Complete upload data:", data);
    
    return data;
  } catch (error: any) {
    console.error("Complete upload error:", error);
    throw new Error(error.message || "Failed to complete upload");
  }
};

export default function UploadNotes() {
  const { token, user } = useAuth();

  const [formData, setFormData] = useState<UploadNotesFormData>({
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
  const [uploadStep, setUploadStep] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null); 

  useEffect(() => {
    if (!token) return;
    fetchFacultySubjects();
  }, [token]);

  const fetchFacultySubjects = async () => {
    setIsLoadingSubjects(true);
    setSubjectError("");
    
    try {
      if (!token) {
        throw new Error("No authentication token available");
      }
      
      const facultySubjects = await getFacultySubjects(token);
      
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
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleDropdown = (field: keyof UploadNotesFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (uploaded: File) => {
    if (file) {
      toast.error("Only one file allowed");
      return;
    }

    if (uploaded.size > 100 * 1024 * 1024) {
      toast.error("Max file size is 100MB");
      return;
    }

    const fileExtension = uploaded.name.split('.').pop()?.toLowerCase() || '';
    if (fileExtension !== 'pdf') {
      toast.error(
        <div>
          Only PDF files are allowed. <br />
          Please convert your file to PDF using an online converter like 
          <a 
            href="https://www.ilovepdf.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 underline ml-1"
          >
            ILovePDF
          </a>
        </div>
      );
      return;
    }

    const newFile: UploadFile = {
      name: uploaded.name,
      size: `${(uploaded.size / (1024 * 1024)).toFixed(1)} MB`,
      progress: 0,
      file: uploaded,
    };

    setFile(newFile);
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

    const requiredFields: (keyof UploadNotesFormData)[] = [
      "courseTitle",
      "grade",
      "subject",
      "category",
      "allowedGroups",
    ];

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

    if (!token) {
      toast.error("Authentication token is missing");
      return;
    }

    setIsUploading(true);
    setUploadStep("Initializing upload...");

    try {
      // Step 1: Prepare payload for initiate upload
      if (!user?.id) {
  toast.error("User ID missing");
  return;
}

const initiatePayload: InitiateUploadPayload = {
  file_name: formData.courseTitle,
  description: formData.description || "",
  grade: formData.grade,
  subject: formData.subject,
  category: formData.category,
  group_allowed: formData.allowedGroups,
  file_type: "pdf",
  faculty_id: user.id, // REQUIRED
};


      console.log("Step 1: Initiating upload with payload:", initiatePayload);
      setUploadStep("Requesting upload URL...");

      // Get pre-signed URL from backend
      let upload_url: string, file_key: string;
      try {
        const result = await initiateUpload(initiatePayload, token);
        upload_url = result.upload_url;
        file_key = result.file_key;
      } catch (initError: any) {
        if (initError.message.includes("404") || initError.message.includes("Not Found")) {
          toast.error("Upload service unavailable. Please contact administrator.");
          throw new Error("Backend upload endpoint not found. Check if routes are properly configured.");
        }
        throw initError;
      }
      
      console.log("Step 1 Complete: Got upload URL and file key", { upload_url, file_key });

      // Step 2: Upload file directly to S3 with real progress tracking
      console.log("Step 2: Uploading file directly to S3...");
      setUploadStep("Uploading file to secure storage...");

      await uploadToS3(upload_url, file.file, (progress) => {
        // Update progress in real-time
        if (file) {
          setFile(prev => prev ? { ...prev, progress } : null);
        }
        setUploadStep(`Uploading... ${progress}%`);
      });

      console.log("Step 2 Complete: File uploaded to S3 successfully");

      // Step 3: Complete upload with backend
      const completePayload: CompleteUploadPayload = {
        ...initiatePayload,
        file_key: file_key,
      };

      console.log("Step 3: Completing upload with backend...");
      setUploadStep("Finalizing upload...");

      const result = await completeUpload(completePayload, token);

      console.log("Step 3 Complete: Backend confirmed upload");

      if (result.success || result.status === "success" || result.message?.toLowerCase().includes("success")) {
        toast.success("Notes uploaded successfully!");
        
        // Reset form
        setFormData({
          courseTitle: "",
          description: "",
          grade: "",
          subject: "",
          category: "",
          allowedGroups: "",
        });
        setFile(null);
        setUploadStep("");
      } else {
        throw new Error("Upload completion failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      
      // Show more specific error messages
      if (error.message.includes("404")) {
        toast.error("Upload endpoint not found. Please check backend configuration.");
      // } else if (error.message.includes("Network error")) {
      //   toast.error("Network error. Please check your internet connection.");
      } else if (error.message.includes("S3 upload failed")) {
        toast.error("Failed to upload to storage. Please try again.");
      } else {
        toast.error(`Upload failed: ${error.message || "Please try again"}`);
      }
    } finally {
      setIsUploading(false);
      setUploadStep("");
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] sm:overflow-auto bg-background p-4 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto"
      >
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            Upload Notes
          </h1>

          <InputField
            id="courseTitle"
            label="Course Title *"
            placeholder="Enter course title"
            value={formData.courseTitle}
            onChange={handleChange}
            icon={<Book className="w-4 h-4" />}
            disabled={isUploading}
          />
          
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
          
          <div className="grid sm:grid-cols-2 gap-4">
            <DropdownBlock
              label="Grade *"
              current={formData.grade || "Select Grade"}
              icon={<FolderOpen className="w-4 h-4" />}
              onSelect={(v) => handleDropdown("grade", v)}
              options={[
                { label: "1PUC", value: "1PUC" },
                { label: "2PUC", value: "2PUC" },
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
          
          {subjectError && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{subjectError}</p>
              <p className="text-xs text-destructive/80 mt-1">
                Please complete your profile setup to select subjects.
              </p>
            </div>
          )}
          
          <DropdownBlock
            label="Category *"
            current={formData.category || "Select Category"}
            icon={<Tag className="w-4 h-4" />}
            onSelect={(v) => handleDropdown("category", v)}
            options={[
              { label: "Notes", value: "Notes" },
              { label: "Exam Papers", value: "Exam Papers" },
              { label: "Other Study Materials", value: "Other Study Materials" },
            ]}
            disabled={isUploading}
          />
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Allowed Groups *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pb-5">
                <Users className="w-4 h-4 text-muted" />
              </div>
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
        
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border border-border rounded-3xl p-6 flex flex-col"
        >
          <h3 className="text-lg font-semibold text-foreground text-center">
            Upload File
          </h3>
          <p className="text-xs text-muted-foreground text-center mb-4">
            Only PDF files allowed (Max 100MB)
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept=".pdf"
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
            <FileUp className={`mx-auto mb-2 ${subjects.length === 0 ? "text-muted" : "text-primary"}`} />
            <p className="text-sm font-medium">
              {subjects.length === 0 ? "Complete profile to upload" : "Click to upload PDF"}
            </p>
            <p className="text-xs text-muted-foreground">(Max 100MB)</p>
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-primary font-medium flex items-center gap-2">
              <FileUp className="w-4 h-4" />
              File not in PDF format?
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Convert your files to PDF using:{" "}
              <a 
                href="https://www.ilovepdf.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline font-semibold text-primary transition-colors"
              >
                ILovePDF Converter
              </a>
            </p>
          </div>
          
          <div className="min-h-[120px] mt-4">
            {file && (
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium truncate">
                      {file.name}
                    </p>
                  </div>
                  <button 
                    onClick={() => setFile(null)}
                    className="hover:bg-muted/20 p-1 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isUploading}
                    type="button"
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
                {uploadStep && (
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    {uploadStep}
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isUploading || !file || subjects.length === 0}
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
              <>
                <FileUp className="w-4 h-4" />
                Upload Notes
              </>
            )}
          </button>
          
          {isUploading && uploadStep && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              {uploadStep}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

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
        <label className="text-xs font-semibold text-foreground truncate">
          {label}
        </label>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading || disabled}
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 flex-shrink-0 ml-2"
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
              relative w-full pl-10 pr-8 py-2.5 rounded-full
              text-left text-sm
              bg-transparent border border-muted
              outline-none transition-all duration-200
              focus:border-primary focus:ring-1 focus:ring-ring
              hover:bg-muted/5
              disabled:opacity-50 disabled:cursor-not-allowed
              group
              min-h-[44px]
              overflow-hidden
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
              className={`
                truncate block w-full pr-5
                ${current.startsWith("Select") 
                  ? "text-muted-foreground" 
                  : "text-foreground"
                }
              `}
              title={current}
            >
              {loading ? "Loading..." : current}
            </span>

            {!loading && !disabled && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs">
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
                    cursor-pointer px-3 py-2
                    text-foreground text-sm
                    hover:bg-primary/10
                    focus:bg-primary/10
                    data-[highlighted]:bg-primary/10
                    data-[highlighted]:text-foreground
                    truncate
                  "
                  title={o.label}
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
// import { useState, useRef, useEffect } from "react";
// import { toast } from "react-toastify";
// import {
//   FileText,
//   Book,
//   FolderOpen,
//   X,
//   Users,
//   Tag,
//   Loader2,
//   RefreshCw,
//   FileUp,
// } from "lucide-react";
// import type { ReactNode } from "react";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "../../components/ui/dropdown-menu";
// import { useAuth } from "../../context/AuthContext";
// import { apiRequest, API_BASE } from "../../lib/api";

// interface UploadFile {
//   name: string;
//   size: string;
//   progress: number;
//   file: File;
// }

// interface InputFieldProps {
//   id: string;
//   label: string;
//   placeholder?: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   icon?: ReactNode;
//   type?: string;
//   disabled?: boolean;
// }

// interface DropdownOption {
//   label: string;
//   value: string;
// }

// interface DropdownBlockProps {
//   label: string;
//   current: string;
//   icon?: ReactNode;
//   onSelect: (value: string) => void;
//   options: DropdownOption[];
//   loading?: boolean;
//   disabled?: boolean;
//   onRefresh?: () => void;
// }

// const getAuthToken = () => {
//   return localStorage.getItem("faculty_token") || "";
// };


// const getFacultySubjects = async (): Promise<string[]> => {
//   try {
//     const token = getAuthToken();
//     const response = await apiRequest(
//       "/faculty/ownedsubjects",
//       "GET",
//       null,
//       token
//     );
    
//     console.log("Faculty subjects response:", response);
    
//     if (response?.data?.subjects && Array.isArray(response.data.subjects)) {
//       return response.data.subjects;
//     } else if (response?.subjects && Array.isArray(response.subjects)) {
//       return response.subjects;
//     } else if (response?.data && Array.isArray(response.data)) {
//       return response.data.map((subject: any) => subject.subject_name || subject.name || subject);
//     }
    
//     return [];
//   } catch (error) {
//     console.error("Error fetching faculty subjects:", error);
//     throw error;
//   }
// };

// const uploadNotes = async (formData: FormData) => {
//   const token = getAuthToken();

//   try {
//     const response = await fetch(`${API_BASE}/files/upload`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     });

//     const data = await response.json();
//     console.log("Upload response:", data);
//     if (data.message?.toLowerCase().includes("success") || data.success === true) {
//       return { success: true, data };
//     }
//     if (!response.ok) {
//       throw new Error(data.message || data.error || "Upload failed");
//     }

//     return { success: true, data };
//   } catch (error: any) {
//     if (error.message?.toLowerCase().includes("success")) {
//       return { success: true, data: { message: error.message } };
//     }
//     throw error;
//   }
// };

// export default function UploadNotes() {
//     const { token, authChecked } = useAuth();
  
//   const [formData, setFormData] = useState({
//     courseTitle: "",
//     description: "",
//     grade: "",
//     subject: "",
//     category: "",
//     allowedGroups: "",
//   });

//   const [file, setFile] = useState<UploadFile | null>(null);
//   const [subjects, setSubjects] = useState<DropdownOption[]>([]);
//   const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [subjectError, setSubjectError] = useState("");
  
//   const fileInputRef = useRef<HTMLInputElement>(null); 

//  useEffect(() => {
//   if (!authChecked) return;

//   if (!token) {
//     return
//   }

//   fetchFacultySubjects();
// }, [token, authChecked]);


// const fetchFacultySubjects = async () => {
//   if (!token) return;

//   setIsLoadingSubjects(true);
//   setSubjectError("");

//   try {
//     const res = await apiRequest(
//       "/faculty/ownedsubjects",
//       "GET",
//       null,
//       token
//     );

//     if (res.status === "success") {
//       const facultySubjects = res.data?.subjects || [];

//       const subjectOptions = facultySubjects.map((subject: string) => ({
//         label: subject.charAt(0).toUpperCase() + subject.slice(1),
//         value: subject,
//       }));

//       setSubjects(subjectOptions);

//       if (subjectOptions.length === 0) {
//         setSubjectError("No subjects assigned by admin.");
//       }
//     } else {
//       throw new Error("Failed to fetch subjects");
//     }
//   } catch (error: any) {
//     setSubjectError(error.message || "Failed to load subjects");
//     toast.error("Failed to load subjects");
//   } finally {
//     setIsLoadingSubjects(false);
//   }
// };


//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleDropdown = (field: keyof typeof formData, value: string) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   const handleFileSelect = (uploaded: File) => {
//     if (file) {
//       toast.error("Only one file allowed");
//       return;
//     }

//     if (uploaded.size > 25 * 1024 * 1024) {
//       toast.error("Max file size is 25MB");
//       return;
//     }

//     const fileExtension = uploaded.name.split('.').pop()?.toLowerCase() || '';
//     if (fileExtension !== 'pdf') {
//       toast.error(
//         <div>
//           Only PDF files are allowed. <br />
//           Please convert your file to PDF using an online converter like 
//           <a 
//             href="https://www.ilovepdf.com" 
//             target="_blank" 
//             rel="noopener noreferrer"
//             className="text-blue-500 underline ml-1"
//           >
//             ILovePDF
//           </a>
//         </div>
//       );
//       return;
//     }

//     const newFile: UploadFile = {
//       name: uploaded.name,
//       size: `${(uploaded.size / (1024 * 1024)).toFixed(1)} MB`,
//       progress: 0,
//       file: uploaded,
//     };

//     setFile(newFile);
//     simulateProgress();
//   };

//   const simulateProgress = () => {
//     let p = 0;
//     const interval = setInterval(() => {
//       p += 10;
//       if (p >= 100) {
//         p = 100;
//         clearInterval(interval);
//       }
//       setFile((prev) => (prev ? { ...prev, progress: p } : prev));
//     }, 120);
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const dropped = e.dataTransfer.files[0];
//     if (dropped) handleFileSelect(dropped);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (subjects.length === 0) {
//       toast.error("No subjects available. Please complete your profile setup first.");
//       return;
//     }

//     const requiredFields = [
//       "courseTitle",
//       "grade",
//       "subject",
//       "category",
//       "allowedGroups",
//     ] as const;

//     const missingFields = requiredFields.filter(
//       (field) => !formData[field]?.trim()
//     );

//     if (missingFields.length > 0) {
//       toast.error(`Fill all required fields: ${missingFields.join(", ")}`);
//       return;
//     }

//     if (!file) {
//       toast.error("Upload one file");
//       return;
//     }

//     if (file.progress < 100) {
//       toast.error("Please wait for file upload to complete");
//       return;
//     }

//     setIsUploading(true);

//     try {
//       const uploadFormData = new FormData();
      
//       uploadFormData.append("title", formData.courseTitle);
//       uploadFormData.append("description", formData.description || "");
//       uploadFormData.append("grade", formData.grade);
//       uploadFormData.append("subject", formData.subject);
//       uploadFormData.append("category", formData.category);
//       uploadFormData.append("group_allowed", formData.allowedGroups);
//       uploadFormData.append("file", file.file);
      
//       // Always set file_type to 'pdf' since we only accept PDF files
//       uploadFormData.append("file_type", "pdf");

//       console.log("Uploading file...");

//       const result = await uploadNotes(uploadFormData);
      
//       if (result.success) {
//         toast.success("Notes uploaded successfully!");
        
//         setFormData({
//           courseTitle: "",
//           description: "",
//           grade: "",
//           subject: "",
//           category: "",
//           allowedGroups: "",
//         });
//         setFile(null);
//       } else {
//         throw new Error("Upload failed");
//       }
//     } catch (error: any) {
//       console.error("Upload error:", error);
//       toast.error(`Upload failed: ${error.message || "Please try again"}`);
//     } finally {
//       setIsUploading(false);
//     }
//   };
//   return (
//     <div className="h-[calc(100vh-64px)] sm:overflow-auto bg-background p-4 sm:p-6">
//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto"
//       >
//         <div className="space-y-4">
//           <h1 className="text-2xl font-bold text-foreground">
//             Upload Notes
//           </h1>

//           <InputField
//             id="courseTitle"
//             label="Course Title *"
//             placeholder="Enter course title"
//             value={formData.courseTitle}
//             onChange={handleChange}
//             icon={<Book className="w-4 h-4" />}
//             disabled={isUploading}
//           />
//           <div className="space-y-1">
//             <label className="text-xs font-semibold text-foreground">
//               Description
//             </label>
//             <textarea
//               id="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Enter course description (optional)"
//               disabled={isUploading}
//               className="w-full h-28 px-4 py-2 rounded-xl bg-transparent border border-muted outline-none focus:border-primary focus:ring-1 focus:ring-ring resize-none disabled:opacity-50 disabled:cursor-not-allowed"
//             />
//           </div>
//           <div className="grid sm:grid-cols-2 gap-4">
//             <DropdownBlock
//               label="Grade *"
//               current={formData.grade || "Select Grade"}
//               icon={<FolderOpen className="w-4 h-4" />}
//               onSelect={(v) => handleDropdown("grade", v)}
//               options={[
//                 { label: "1PUC", value: "1PUC" },
//                 { label: "2PUC", value: "2PUC" },
//               ]}
//               disabled={isUploading}
//             />

//             <DropdownBlock
//               label="Subject *"
//               current={formData.subject || "Select Subject"}
//               icon={<FileText className="w-4 h-4" />}
//               onSelect={(v) => handleDropdown("subject", v)}
//               options={subjects}
//               loading={isLoadingSubjects}
//               disabled={isUploading || subjects.length === 0}
//               onRefresh={fetchFacultySubjects}
//             />
//           </div>
//           {subjectError && (
//             <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
//               <p className="text-sm text-destructive">{subjectError}</p>
//               <p className="text-xs text-destructive/80 mt-1">
//                 Please complete your profile setup to select subjects.
//               </p>
//             </div>
//           )}
//           <DropdownBlock
//             label="Category *"
//             current={formData.category || "Select Category"}
//             icon={<Tag className="w-4 h-4" />}
//             onSelect={(v) => handleDropdown("category", v)}
//             options={[
//               { label: "Notes", value: "Notes" },
//               { label: "Exam Papers", value: "Exam Papers" },
//               { label: "Other Study Materials", value: "Other Study Materials" },
//             ]}
//             disabled={isUploading}
//           />
//           <div className="space-y-1">
//             <label className="text-xs font-semibold text-foreground">
//               Allowed Groups *
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pb-5">
//                 <Users className="w-4 h-4 text-muted" />
//               </div>
//               <input
//                 id="allowedGroups"
//                 type="text"
//                 placeholder="Enter group names (comma separated)"
//                 value={formData.allowedGroups}
//                 onChange={handleChange}
//                 disabled={isUploading}
//                 className="w-full pl-10 pr-3 py-2.5 text-sm rounded-full bg-transparent border border-muted outline-none focus:border-primary focus:ring-1 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//               />
//               <p className="text-xs text-muted-foreground mt-1 ml-3">
//                 Example: Group A, Group B, Group C
//               </p>
//             </div>
//           </div>

//         </div>
//         <div
//           onDrop={handleDrop}
//           onDragOver={(e) => e.preventDefault()}
//           className="border border-border rounded-3xl p-6 flex flex-col"
//         >
//           <h3 className="text-lg font-semibold text-foreground text-center">
//             Upload File
//           </h3>
//           <p className="text-xs text-muted-foreground text-center mb-4">
//             Only PDF files allowed (Max 25MB)
//           </p>
//           <input
//             ref={fileInputRef}
//             type="file"
//             hidden
//             accept=".pdf"
//             onChange={(e) =>
//               e.target.files && handleFileSelect(e.target.files[0])
//             }
//             disabled={isUploading || subjects.length === 0}
//           />

//           <div
//             onClick={() => !isUploading && subjects.length > 0 && fileInputRef.current?.click()}
//             className={`border-2 border-dashed border-border rounded-xl p-10 text-center transition ${
//               isUploading || subjects.length === 0 
//                 ? "opacity-50 cursor-not-allowed" 
//                 : "cursor-pointer hover:border-primary"
//             }`}
//           >
//             <FileUp className={`mx-auto mb-2 ${subjects.length === 0 ? "text-muted" : "text-primary"}`} />
//             <p className="text-sm font-medium">
//               {subjects.length === 0 ? "Complete profile to upload" : "Click to upload PDF"}
//             </p>
//             <p className="text-xs text-muted-foreground">(Max 25MB)</p>
//           </div>
//          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
//   <p className="text-sm text-primary font-medium flex items-center gap-2">
//     <FileUp className="w-4 h-4" />
//     File not in PDF format?
//   </p>
//   <p className="text-xs text-muted-foreground mt-1">
//     Convert your files to PDF using:{" "}
//     <a 
//       href="https://www.ilovepdf.com" 
//       target="_blank" 
//       rel="noopener noreferrer"
//       className="underline font-semibold text-primary transition-colors"
//     >
//       ILovePDF Converter
//     </a>
//   </p>
// </div>
//           <div className="min-h-[120px] mt-4">
//             {file && (
//               <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center gap-2">
//                     <FileText className="w-4 h-4 text-primary" />
//                     <p className="text-sm font-medium truncate">
//                       {file.name}
//                     </p>
//                   </div>
//                   <button 
//                     onClick={() => setFile(null)}
//                     className="hover:bg-muted/20 p-1 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
//                     disabled={isUploading}
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>

//                 <div className="h-2 bg-muted/40 rounded-full mt-2">
//                   <div
//                     className="h-2 bg-primary rounded-full transition-all"
//                     style={{ width: `${file.progress}%` }}
//                   />
//                 </div>

//                 <div className="flex justify-between text-xs">
//                   <span>{file.size}</span>
//                   <span>{file.progress}%</span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* SUBJECTS INFO */}
//           {/* <div className="space-y-2"> */}
//             {/* {subjects.length > 0 && ( */}
//               {/* // <div className="p-3 rounded-lg bg-primary/5 border border-primary/20"> */}
//                 {/* <div className="flex items-center gap-2 mb-2">
//                   <FileText className="w-4 h-4 text-primary" />
//                   <p className="text-sm font-medium text-foreground">
//                     Your Selected Subjects ({subjects.length})
//                   </p>
//                 </div> */}
//                 {/* <div className="flex flex-wrap gap-1">
//                   {subjects.slice(0, 3).map((subject, index) => (
//                     <span
//                       key={index}
//                       className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary flex items-center gap-1"
//                     >
//                       <FileText className="w-3 h-3" />
//                       {subject.label}
//                     </span>
//                   ))}
//                   {subjects.length > 3 && (
//                     <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
//                       +{subjects.length - 3} more
//                     </span>
//                   )}
//                 </div> */}
//               {/* // </div> */}
//             {/* )} */}
            
//             {/* {subjects.length === 0 && !isLoadingSubjects && (
//               <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
//                 <p className="text-sm text-destructive">
//                   No subjects available
//                 </p>
//                 <p className="text-xs text-destructive/80 mt-1">
//                   Please complete your profile setup to select subjects.
//                 </p>
//               </div>
//             )}
//           </div> */}

//           <button
//             type="submit"
//             disabled={isUploading || !file || file.progress < 100 || subjects.length === 0}
//             className="mt-auto py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             {isUploading ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 Uploading...
//               </>
//             ) : subjects.length === 0 ? (
//               "Complete Profile First"
//             ) : (
//               <>
//                 <FileUp className="w-4 h-4" />
//                 Upload Notes
//               </>
//             )}
//           </button>
          
//           {isUploading && (
//             <p className="text-xs text-muted-foreground text-center mt-2">
//               Please wait while we upload your file...
//             </p>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }
// function InputField({
//   id,
//   label,
//   placeholder,
//   value,
//   onChange,
//   icon,
//   type = "text",
//   disabled = false,
// }: InputFieldProps) {
//   return (
//     <div className="space-y-1">
//       <label htmlFor={id} className="text-xs font-semibold text-foreground">
//         {label}
//       </label>

//       <div className="relative group">
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//           <span className="text-muted group-focus-within:text-primary transition-colors duration-200">
//             {icon}
//           </span>
//         </div>
//         <input
//           id={id}
//           type={type}
//           placeholder={placeholder}
//           value={value}
//           onChange={onChange}
//           disabled={disabled}
//           className="w-full pl-10 pr-3 py-2.5 text-sm rounded-full bg-transparent border border-muted outline-none focus:border-primary focus:ring-1 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//         />
//       </div>
//     </div>
//   );
// }

// function DropdownBlock({
//   label,
//   current,
//   icon,
//   onSelect,
//   options,
//   loading = false,
//   disabled = false,
//   onRefresh,
// }: DropdownBlockProps) {
//   return (
//     <div className="space-y-1">
//       <div className="flex items-center justify-between">
//         <label className="text-xs font-semibold text-foreground truncate">
//           {label}
//         </label>
//         {onRefresh && (
//           <button
//             onClick={onRefresh}
//             disabled={loading || disabled}
//             className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 flex-shrink-0 ml-2"
//             type="button"
//           >
//             <RefreshCw className="w-3 h-3" />
//             Refresh
//           </button>
//         )}
//       </div>

//       <DropdownMenu>
//         <DropdownMenuTrigger asChild disabled={loading || disabled}>
//           <button
//             type="button"
//             disabled={loading || disabled}
//             className="
//               relative w-full pl-10 pr-8 py-2.5 rounded-full
//               text-left text-sm
//               bg-transparent border border-muted
//               outline-none transition-all duration-200
//               focus:border-primary focus:ring-1 focus:ring-ring
//               hover:bg-muted/5
//               disabled:opacity-50 disabled:cursor-not-allowed
//               group
//               min-h-[44px]
//               overflow-hidden
//             "
//           >
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <span className="text-muted group-focus-within:text-primary transition-colors duration-200">
//                 {loading ? (
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                 ) : (
//                   icon
//                 )}
//               </span>
//             </div>

//             <span
//               className={`
//                 truncate block w-full pr-5
//                 ${current.startsWith("Select") 
//                   ? "text-muted-foreground" 
//                   : "text-foreground"
//                 }
//               `}
//               title={current}
//             >
//               {loading ? "Loading..." : current}
//             </span>

//             {!loading && !disabled && (
//               <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs">
//                 ▼
//               </span>
//             )}
//           </button>
//         </DropdownMenuTrigger>

//         {!loading && !disabled && (
//           <DropdownMenuContent
//             className="
//               w-[var(--radix-dropdown-menu-trigger-width)]
//               bg-background border border-muted
//               rounded-xl shadow-lg max-h-60 overflow-auto
//             "
//           >
//             {options.length === 0 ? (
//               <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
//                 No options available
//               </div>
//             ) : (
//               options.map((o) => (
//                 <DropdownMenuItem
//                   key={o.value}
//                   onClick={() => onSelect(o.value)}
//                   className="
//                     cursor-pointer px-3 py-2
//                     text-foreground text-sm
//                     hover:bg-primary/10
//                     focus:bg-primary/10
//                     data-[highlighted]:bg-primary/10
//                     data-[highlighted]:text-foreground
//                     truncate
//                   "
//                   title={o.label}
//                 >
//                   {o.label}
//                 </DropdownMenuItem>
//               ))
//             )}
//           </DropdownMenuContent>
//         )}
//       </DropdownMenu>
//     </div>
//   );
// }