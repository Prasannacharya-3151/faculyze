import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  
  FileText,
  Book,
  
  Languages,
  FolderOpen,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

interface UploadFile {
  name: string;
  size: string;
  progress: number;
  file: File;
}

export default function UploadNotes() {
  const [formData, setFormData] = useState({
    courseTitle: "",
    description: "",
    pucYear: "",
    subject: "",
    groups: "",
    types: "",
    language: "",
  });

  const [files, setFiles] = useState<UploadFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDropdown = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (files.length > 0) {
      toast.error("Only one file is allowed");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error("File size must be under 25MB");
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
    toast.success("File selected successfully");

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

  const removeFile = () => {
    setFiles([]);
    toast.info("File removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.courseTitle || !formData.pucYear || !formData.subject || !formData.language) {
      toast.error("Please fill all required fields");
      return;
    }

    if (files.length === 0) {
      toast.error("Please upload one file");
      return;
    }

    try {
      toast.info("Uploading notes...");

      // 🔥 BACKEND API (READY – UNCOMMENT LATER)
      /*
      const payload = new FormData();
      payload.append("courseTitle", formData.courseTitle);
      payload.append("description", formData.description);
      payload.append("pucYear", formData.pucYear);
      payload.append("subject", formData.subject);
      payload.append("group", formData.groups);
      payload.append("type", formData.types);
      payload.append("language", formData.language);
      payload.append("file", files[0].file);

      await fetch("/api/notes/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer YOUR_TOKEN_HERE`,
        },
        body: payload,
      });
      */

      toast.success("Notes uploaded successfully");
      setFiles([]);

    } catch (err) {
      toast.error("Upload failed. Try again.");
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT FORM */}
        <div className="space-y-5">
          <h1 className="text-2xl font-bold text-gray-900">Upload Notes</h1>
          <p className="text-xs text-gray-600">
            Share learning resources with students
          </p>

          <InputBlock label="Course Title *">
            <InputFull
              id="courseTitle"
              value={formData.courseTitle}
              onChange={handleChange}
              placeholder="Enter course title"
              icon={<Book className="w-4 h-4 text-gray-400" />}
            />
          </InputBlock>

          <InputBlock label="Description">
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-2xl p-3 h-28 border border-gray-300 text-sm outline-none
                         focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              placeholder="Write something..."
            />
          </InputBlock>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DropdownBlock
              label="PUC Year *"
              current={formData.pucYear || "Select Year"}
              icon={<FolderOpen className="w-4 h-4 text-gray-400" />}
              onSelect={(v) => handleDropdown("pucYear", v)}
              options={[
                { label: "1st PUC", value: "1st" },
                { label: "2nd PUC", value: "2nd" },
              ]}
            />

            <DropdownBlock
              label="Subject *"
              current={formData.subject || "Select Subject"}
              icon={<FileText className="w-4 h-4 text-gray-400" />}
              onSelect={(v) => handleDropdown("subject", v)}
              options={[
                { label: "Physics", value: "physics" },
                { label: "Chemistry", value: "chemistry" },
                { label: "Maths", value: "maths" },
                { label: "Biology", value: "biology" },
              ]}
            />
          </div>

          <DropdownBlock
            label="Language *"
            current={formData.language || "Select Language"}
            icon={<Languages className="w-4 h-4 text-gray-400" />}
            onSelect={(v) => handleDropdown("language", v)}
            options={[
              { label: "English", value: "english" },
              { label: "Kannada", value: "kannada" },
              { label: "Hindi", value: "hindi" },
            ]}
          />
        </div>
        <div className="bg-white rounded-2xl p-6 border shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Upload File</h3>
          <p className="text-xs text-gray-500 mb-4">Only one file allowed</p>

          <label className="cursor-pointer block">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
            />
            <div className="p-10 border-2 border-dashed rounded-xl text-center hover:border-purple-600 transition">
              <p className="font-medium text-gray-600">Click to upload</p>
              <p className="text-xs text-gray-400">Max 25MB</p>
            </div>
          </label>

          {files.map((file) => (
            <div key={file.name} className="mt-4 p-4 bg-gray-50 rounded-xl border">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <button onClick={removeFile} className="text-red-500 font-bold">✕</button>
              </div>

              <div className="w-full h-2 bg-gray-300 rounded-full mt-2">
                <div
                  style={{ width: `${file.progress}%` }}
                  className="h-2 bg-purple-600 rounded-full transition-all"
                />
              </div>

              <p className="text-xs text-right mt-1">{file.progress}%</p>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={() => setFiles([])}
              className="w-full sm:w-1/2 py-3 rounded-full bg-gray-200 text-gray-700"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="w-full sm:w-1/2 py-3 rounded-full text-white font-semibold
                         bg-gradient-to-r from-purple-600 to-purple-900 shadow-lg"
            >
              Upload Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- REUSABLE COMPONENTS -------------------- */

function InputBlock({ label, children }: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function InputFull({ id, value, onChange, placeholder, icon }: any) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        {icon}
      </div>
      <input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2 text-sm rounded-full border border-gray-300
                   focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
      />
    </div>
  );
}

function DropdownBlock({ label, current, icon, onSelect, options }: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-700">{label}</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full pl-10 pr-3 py-2 rounded-full border text-left text-sm relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
            {current}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {options.map((o: any) => (
            <DropdownMenuItem key={o.value} onClick={() => onSelect(o.value)}>
              {o.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
