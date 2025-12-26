import { useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  FileText,
  Book,
  Languages,
  FolderOpen,
  Upload,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

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

/* ================= MAIN ================= */

export default function UploadNotes() {
  const [formData, setFormData] = useState({
    courseTitle: "",
    description: "",
    pucYear: "",
    subject: "",
    language: "",
  });

  const [file, setFile] = useState<UploadFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------- HANDLERS ---------- */

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.courseTitle ||
      !formData.pucYear ||
      !formData.subject ||
      !formData.language
    ) {
      toast.error("Fill all required fields");
      return;
    }

    if (!file) {
      toast.error("Upload one file");
      return;
    }

    // 🔴 API CALL (ADD LATER)
    /*
    const form = new FormData();
    Object.entries(formData).forEach(([k, v]) => form.append(k, v));
    form.append("file", file.file);

    apiRequest("/notes/upload", "POST", form);
    */

    toast.success("Notes uploaded successfully");
    setFile(null);
  };

  /* ================= UI ================= */

  return (
    <div className="h-[calc(100vh-64px)]  sm:overflow-auto bg-background p-4 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto"
      >
        {/* LEFT FORM */}
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
          />

          <div className="space-y-1">
            <label className="block w-full px-3 py-1 rounded-md text-xs font-semibold">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full h-28 px-4 py-2 rounded-xl bg-transparent border border-muted outline-none focus:border-primary focus:ring-1 focus:ring-ring resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
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
            Only one file allowed
          </p>

          {/* UPLOAD BOX (ALWAYS VISIBLE) */}
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept=".pdf,.doc,.docx,.ppt,.pptx,.image/*,.photo/*"
            onChange={(e) =>
              e.target.files && handleFileSelect(e.target.files[0])
            }
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary transition"
          >
            <Upload className="mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Click to upload</p>
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
                  <button onClick={() => setFile(null)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="h-2 bg-muted/40 rounded-full mt-2">
                  <div
                    className="h-2 bg-primary rounded-full transition-all"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>

                <p className="text-xs text-right mt-1">
                  {file.progress}%
                </p>
              </div>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="mt-auto py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
          >
            Upload Notes
          </button>
        </div>
      </form>
    </div>
  );
}

/* ================= REUSABLE ================= */

function InputField({
  id,
  label,
  placeholder,
  value,
  onChange,
  icon,
  type = "text",
}: InputFieldProps) {
  return (
    <div className="space-y-1 group">
      <label className="block w-full px-3 py-1 rounded-md text-xs font-semibold ">
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
          {icon}
        </span>

        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-3 py-2 text-sm rounded-full bg-transparent border border-muted outline-none focus:border-primary focus:ring-1 focus:ring-ring"
        />
      </div>
    </div>
  );
}

/* ---------- DROPDOWN ---------- */
function DropdownBlock({
  label,
  current,
  icon,
  onSelect,
  options,
}: DropdownBlockProps) {
  return (
    <div className="space-y-1 group">
      {/* LABEL */}
      <label className="text-xs font-semibold text-foreground">
        {label}
      </label>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="
              relative w-full pl-10 pr-10 py-2 rounded-full
              text-left text-sm
              bg-transparent border border-muted
              outline-none transition
              focus:border-primary focus:ring-1 focus:ring-ring
            "
          >
            {/* ICON */}
            <span
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                text-muted transition-colors
                group-focus-within:text-primary
              "
            >
              {icon}
            </span>

            {/* VALUE */}
            <span
              className={
                current.startsWith("Select")
                  ? "text-muted-foreground"
                  : "text-foreground"
              }
            >
              {current}
            </span>

            {/* CHEVRON */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
              ▼
            </span>
          </button>
        </DropdownMenuTrigger>

        {/* DROPDOWN CONTENT */}
        <DropdownMenuContent
          className="
            w-[var(--radix-dropdown-menu-trigger-width)]
            bg-background border border-muted
            rounded-xl shadow-lg
          "
        >
          {options.map((o) => (
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
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
