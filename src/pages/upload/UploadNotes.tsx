import { useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  FileText,
  Book,
  Languages,
  FolderOpen,
} from "lucide-react";
import type { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

/* ---------------- TYPES ---------------- */

interface UploadFile {
  name: string;
  size: string;
  progress: number;
  file: File;
}

interface InputBlockProps {
  label: string;
  children: ReactNode;
}

interface InputFieldProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: ReactNode;
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
}

/* ---------------- MAIN ---------------- */

export default function UploadNotes() {
  const [formData, setFormData] = useState({
    courseTitle: "",
    description: "",
    pucYear: "",
    subject: "",
    language: "",
  });

  const [files, setFiles] = useState<UploadFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDropdown = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (files.length > 0) {
      toast.error("Only one file allowed");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error("Max file size is 25MB");
      return;
    }

    const newFile: UploadFile = {
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      progress: 0,
      file,
    };

    setFiles([newFile]);
    simulateProgress(newFile);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const simulateProgress = (fileData: UploadFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setFiles((prev) =>
        prev.map((f) =>
          f.name === fileData.name ? { ...f, progress } : f
        )
      );
    }, 200);
  };

  const removeFile = () => setFiles([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.courseTitle || !formData.pucYear || !formData.subject || !formData.language) {
      toast.error("Fill all required fields");
      return;
    }

    if (files.length === 0) {
      toast.error("Upload one file");
      return;
    }

    toast.success("Notes uploaded successfully");
    setFiles([]);
  };

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT */}
        <div className="space-y-5">
          <h1 className="text-2xl font-bold text-foreground">Upload Notes</h1>
          <p className="text-xs text-muted-foreground">
            Attach notes for students
          </p>

          <InputBlock label="Course Title *">
            <InputField
              id="courseTitle"
              value={formData.courseTitle}
              onChange={handleChange}
              placeholder="Enter course title"
              icon={<Book className="w-4 h-4" />}
            />
          </InputBlock>

          <InputBlock label="Description">
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write something..."
              className="w-full h-28 px-4 py-2 text-sm rounded-xl
                         border border-muted bg-card
                         outline-none focus:border-primary
                         focus:ring-1 focus:ring-ring
                         transition resize-none
                         placeholder:text-muted-foreground"
            />
          </InputBlock>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DropdownBlock
              label="PUC Year *"
              current={formData.pucYear || "Select Year"}
              icon={<FolderOpen className="w-4 h-4" />}
              onSelect={(v) => handleDropdown("pucYear", v)}
              options={[
                { label: "1st PUC", value: "1st PUC" },
                { label: "2nd PUC", value: "2nd PUC" },
              ]}
            />

            <DropdownBlock
              label="Subject *"
              current={formData.subject || "Select Subject"}
              icon={<FileText className="w-4 h-4" />}
              onSelect={(v) => handleDropdown("subject", v)}
              options={[
                { label: "Physics", value: "Physics" },
                { label: "Chemistry", value: "Chemistry" },
                { label: "Maths", value: "Maths" },
                { label: "Biology", value: "Biology" },
              ]}
            />
          </div>

          <DropdownBlock
            label="Language *"
            current={formData.language || "Select Language"}
            icon={<Languages className="w-4 h-4" />}
            onSelect={(v) => handleDropdown("language", v)}
            options={[
              { label: "English", value: "English" },
              { label: "Kannada", value: "Kannada" },
              { label: "Hindi", value: "Hindi" },
            ]}
          />
        </div>

        {/* RIGHT */}
        <div className="p-6 rounded-3xl border border-muted shadow-lg">
          <h3 className="text-lg font-semibold text-foreground text-center">
            Upload File
          </h3>
          <p className="text-xs text-muted-foreground text-center mb-4">
            Only one file allowed
          </p>

          <label className="block cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="p-10 border-2 border-dashed border-muted
                            rounded-xl text-center hover:border-primary transition">
              <span className="text-primary font-medium">Click to upload</span>
              <p className="text-xs text-muted-foreground">(Max 25MB)</p>
            </div>
          </label>

          {/* RESERVED FILE SPACE */}
          <div className="min-h-[120px] mt-4">
            {files.map((file) => (
              <div
                key={file.name}
                className="p-4 bg-muted/20 rounded-xl border border-muted"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <button onClick={removeFile} className="font-bold">✕</button>
                </div>

                <div className="w-full h-2 bg-muted/50 rounded-full mt-2">
                  <div
                    style={{ width: `${file.progress}%` }}
                    className="h-2 bg-primary rounded-full transition-all"
                  />
                </div>

                <p className="text-xs text-right mt-1">{file.progress}%</p>
              </div>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={removeFile}
              className="w-1/2 py-3 rounded-full bg-muted hover:bg-muted/80 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="w-1/2 py-3 rounded-full bg-primary
                         text-primary-foreground font-semibold
                         hover:bg-primary/90 transition"
            >
              Upload Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- REUSABLE ---------------- */

function InputBlock({ label, children }: InputBlockProps) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold">{label}</label>
      {children}
    </div>
  );
}

function InputField({
  id,
  value,
  onChange,
  placeholder,
  icon,
}: InputFieldProps) {
  const isFilled = value.length > 0;

  return (
    <div className="relative group">
      <span
        className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors
        ${isFilled ? "text-primary/60" : "text-muted"}
        group-focus-within:text-primary`}
      >
        {icon}
      </span>

      <input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-3 py-2 text-sm rounded-full outline-none transition
          ${isFilled ? "border border-primary/40 bg-primary/5" : "border border-muted bg-card"}
          focus:border-primary focus:ring-1 focus:ring-ring`}
      />
    </div>
  );
}

function DropdownBlock({
  label,
  current,
  icon,
  onSelect,
  options,
}: DropdownBlockProps) {
  const isSelected = !current.toLowerCase().startsWith("select");

  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold">{label}</label>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`relative group w-full pl-10 pr-3 py-2 rounded-full text-left text-sm outline-none transition
              ${isSelected ? "border border-primary/40 bg-primary/5" : "border border-muted bg-card"}
              data-[state=open]:border-primary data-[state=open]:ring-1 data-[state=open]:ring-ring`}
          >
            <span
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors
                ${isSelected ? "text-primary/60" : "text-muted"}
                group-data-[state=open]:text-primary`}
            >
              {icon}
            </span>

            <span className={isSelected ? "text-foreground" : "text-muted-foreground"}>
              {current}
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-card border-muted">
          {options.map((o) => (
            <DropdownMenuItem
              key={o.value}
              onClick={() => onSelect(o.value)}
              className="hover:bg-primary/10 cursor-pointer"
            >
              {o.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
