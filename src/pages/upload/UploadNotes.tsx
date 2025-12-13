import React, { useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { FileUp, FileText, Book, Layers, Languages, FolderOpen } from "lucide-react";

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

  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDropdown = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    selectedFiles.forEach((file) => {
      if (file.size > 25 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 25MB.`);
        return;
      }

      const newFile = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        progress: 0,
        status: "uploading",
        file: file,
        time: "Calculating...",
      };

      setFiles((prev) => [...prev, newFile]);
      simulateFileUpload(newFile);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const simulateFileUpload = (fileData) => {
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 10;

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        setFiles((prev) =>
          prev.map((f) =>
            f.name === fileData.name
              ? { ...f, progress: 100, status: "completed", time: "Completed" }
              : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.name === fileData.name
              ? {
                  ...f,
                  progress,
                  time: `${Math.floor((100 - progress) / 10)} sec left`,
                }
              : f
          )
        );
      }
    }, 200);
  };

  const removeFile = (fileName) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.courseTitle || !formData.pucYear || !formData.subject || !formData.language) {
      alert("Please fill required fields.");
      return;
    }

    if (files.length === 0) {
      alert("Upload at least one file");
      return;
    }

    console.log("Uploading:", formData, files);
    alert("Files would be uploaded in real implementation!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6 flex flex-col gap-8 lg:flex-row">
      {/* LEFT SIDE FORM */}
      <div className="w-full lg:w-1/2 space-y-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900">Upload Notes</h1>
        <p className="text-xs text-gray-600">Share learning resources with students</p>

        {/* COURSE TITLE */}
        <InputBlock label="Course Title *">
          <InputFull
            id="courseTitle"
            placeholder="Enter Course Title"
            value={formData.courseTitle}
            onChange={handleChange}
            icon={<Book className="w-4 h-4 text-gray-400" />}
          />
        </InputBlock>

        {/* DESCRIPTION */}
        <InputBlock label="Description">
          <textarea
            id="description"
            placeholder="Write something about this content..."
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-2xl p-3 h-28 border bg-white border-gray-300 text-sm outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
          ></textarea>
        </InputBlock>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* PUC YEAR */}
          <DropdownBlock
            label="PUC Year *"
            current={formData.pucYear ? `${formData.pucYear} PUC` : "Select Year"}
            icon={<FolderOpen className="w-4 h-4 text-gray-400" />}
            onSelect={(value) => handleDropdown("pucYear", value)}
            options={[
              { label: "1st PUC", value: "1st" },
              { label: "2nd PUC", value: "2nd" },
            ]}
          />

          {/* SUBJECT */}
          <DropdownBlock
            label="Subject *"
            current={formData.subject || "Select Subject"}
            icon={<FileText className="w-4 h-4 text-gray-400" />}
            onSelect={(value) => handleDropdown("subject", value)}
            options={[
              { label: "Physics", value: "physics" },
              { label: "Chemistry", value: "chemistry" },
              { label: "Mathematics", value: "mathematics" },
              { label: "Biology", value: "biology" },
            ]}
          />

          {/* GROUP */}
          <DropdownBlock
            label="Group"
            current={formData.groups || "Select Group"}
            icon={<Layers className="w-4 h-4 text-gray-400" />}
            onSelect={(value) => handleDropdown("groups", value)}
            options={[
              { label: "Science", value: "science" },
              { label: "Commerce", value: "commerce" },
              { label: "Arts", value: "arts" },
            ]}
          />

          {/* TYPES */}
          <DropdownBlock
            label="Types"
            current={formData.types || "Select Type"}
            icon={<FileUp className="w-4 h-4 text-gray-400" />}
            onSelect={(value) => handleDropdown("types", value)}
            options={[
              { label: "Notes", value: "notes" },
              { label: "Assignment", value: "assignment" },
              { label: "Question Paper", value: "question-paper" },
              { label: "Syllabus", value: "syllabus" },
            ]}
          />
        </div>

        {/* LANGUAGE */}
        <DropdownBlock
          label="Language *"
          current={formData.language || "Select Language"}
          icon={<Languages className="w-4 h-4 text-gray-400" />}
          onSelect={(value) => handleDropdown("language", value)}
          options={[
            { label: "English", value: "english" },
            { label: "Kannada", value: "kannada" },
            { label: "Hindi", value: "hindi" },
          ]}
        />
      </div>

      {/* RIGHT SECTION — FILE UPLOAD */}
      <div className="w-full lg:w-1/2 rounded-2xl p-6 border bg-white shadow-lg">
        {/* Upload Box */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
          <p className="text-xs text-gray-500 mb-4">Attach files to your notes.</p>

          <label className="cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
              className="hidden"
            />

            <div className="p-10 rounded-xl border-2 border-dashed hover:border-purple-600 transition">
              <p className="font-medium text-gray-600">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-400">Max size: 25MB</p>
            </div>
          </label>
        </div>

        {/* FILES LIST */}
        <div className="h-72 overflow-y-auto space-y-4 pr-2">
          {files.map((file, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-50 border">
              <div className="flex justify-between">
                <p className="font-medium text-sm">{file.name}</p>
                <button
                  onClick={() => removeFile(file.name)}
                  className="text-red-500 text-lg hover:text-red-700"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-gray-500">
                {file.size} • {file.time}
              </p>

              <div className="w-full bg-gray-300 h-2 rounded-full mt-2">
                <div
                  style={{ width: `${file.progress}%` }}
                  className="h-2 rounded-full bg-purple-600 transition-all"
                ></div>
              </div>

              <p className="text-right text-xs text-gray-400 mt-1">
                {Math.round(file.progress)}%
              </p>
            </div>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6">
          <button
            className="w-1/2 py-3 rounded-full font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            onClick={() => setFiles([])}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="w-1/2 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-purple-600 to-purple-900 hover:from-purple-900 hover:to-purple-600 shadow-lg transition"
          >
            Upload Notes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------- */
/* REUSABLE COMPONENTS                         */
/* ------------------------------------------- */

function InputBlock({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function InputFull({ id, placeholder, value, onChange, icon }) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        {icon}
      </div>

      <input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-3 py-2 text-sm rounded-full border border-gray-300 outline-none 
                   bg-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
      />
    </div>
  );
}

function DropdownBlock({ label, current, icon, onSelect, options }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-700">{label}</label>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-full py-2 pl-10 pr-3 rounded-full border bg-white text-left text-sm shadow-sm 
                       hover:bg-gray-50 transition outline-none border-gray-300 relative"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {icon}
            </div>
            <span>{current}</span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="rounded-xl shadow-lg min-w-[200px]">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSelect(option.value)}
              className="cursor-pointer"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}