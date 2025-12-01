import React, { useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

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

  const [files, setFiles] = useState<Array<{
    name: string;
    size: string;
    progress: number;
    status: "uploading" | "completed" | "error";
    file: File;
    time?: string;
  }>>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    selectedFiles.forEach(file => {
     
      if (file.size > 25 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 25MB.`);
        return;
      }

      const fileData = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        progress: 0,
        status: "uploading" as const,
        file: file,
        time: "Calculating..."
      };

      setFiles(prev => [...prev, fileData]);

    
      simulateFileUpload(fileData);
    });

    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const simulateFileUpload = (fileData: any) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setFiles(prev => prev.map(f => 
          f.name === fileData.name 
            ? { ...f, progress: 100, status: "completed", time: "Completed" }
            : f
        ));
      } else {
        const timeLeft = `${Math.floor((100 - progress) / 10)} sec left`;
        setFiles(prev => prev.map(f => 
          f.name === fileData.name 
            ? { ...f, progress: Math.min(progress, 100), time: timeLeft }
            : f
        ));
      }
    }, 200);
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
  
    if (!formData.courseTitle || !formData.pucYear || !formData.subject || !formData.language) {
      alert("Please fill all required fields");
      return;
    }

    if (files.length === 0) {
      alert("Please upload at least one file");
      return;
    }


    const uploadData = new FormData();
    uploadData.append("courseTitle", formData.courseTitle);
    uploadData.append("description", formData.description);
    uploadData.append("pucYear", formData.pucYear);
    uploadData.append("subject", formData.subject);
    uploadData.append("groups", formData.groups);
    uploadData.append("types", formData.types);
    uploadData.append("language", formData.language);

   
    files.forEach(file => {
      uploadData.append("files", file.file);
    });

    try {
    
      console.log("Uploading data:", {
        formData,
        files: files.map(f => f.name)
      });
      
      // Example API call (uncomment and replace with your endpoint)
      /*
      const response = await fetch('/api/upload-notes', {
        method: 'POST',
        body: uploadData,
      });

      if (response.ok) {
        alert('Files uploaded successfully!');
        // Reset form
        setFormData({
          courseTitle: "",
          description: "",
          pucYear: "",
          subject: "",
          groups: "",
          types: "",
          language: "",
        });
        setFiles([]);
      } else {
        alert('Upload failed. Please try again.');
      }
      */
      
      alert('Files would be uploaded in real implementation! Check console for data.');
      console.log("Form Data to upload:", uploadData);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      courseTitle: "",
      description: "",
      pucYear: "",
      subject: "",
      groups: "",
      types: "",
      language: "",
    });
    setFiles([]);
  };

  const completedFiles = files.filter(f => f.status === "completed");
  const uploadingFiles = files.filter(f => f.status === "uploading");

  return (
    <div className="w-full h-full flex gap-8 p-6">
    
      <div className="w-1/2 flex flex-col gap-4">
   
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Actions
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>File Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  New Upload
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Save Draft
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export Data
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Template</DropdownMenuItem>
                      <DropdownMenuItem>Archive</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Help</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <label className="font-semibold text-sm text-gray-700">Course Title *</label>
          <input
            id="courseTitle"
            type="text"
            className="w-full rounded-2xl bg-gray-100 p-3 mt-2 border border-gray-200 focus:outline-none focus:border-blue-500"
            placeholder="Enter course title"
            value={formData.courseTitle}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="font-semibold text-sm text-gray-700">Description</label>
          <textarea
            id="description"
            className="w-full rounded-2xl bg-gray-100 p-3 mt-2 h-24 border border-gray-200 focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Brief description..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-sm text-gray-700">PUC Year *</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full rounded-2xl bg-gray-100 p-3 mt-2 border border-gray-200 focus:outline-none focus:border-blue-500 text-left">
                  {formData.pucYear ? (formData.pucYear === "1st" ? "1st PUC" : "2nd PUC") : "Select Year"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                <DropdownMenuLabel>Select PUC Year</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFormData({...formData, pucYear: "1st"})}>
                  1st PUC
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormData({...formData, pucYear: "2nd"})}>
                  2nd PUC
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <label className="font-semibold text-sm text-gray-700">Subject *</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full rounded-2xl bg-gray-100 p-3 mt-2 border border-gray-200 focus:outline-none focus:border-blue-500 text-left">
                  {formData.subject ? 
                    formData.subject.charAt(0).toUpperCase() + formData.subject.slice(1) 
                    : "Select Subject"
                  }
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                <DropdownMenuLabel>Select Subject</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFormData({...formData, subject: "physics"})}>
                  Physics
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormData({...formData, subject: "chemistry"})}>
                  Chemistry
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormData({...formData, subject: "mathematics"})}>
                  Mathematics
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormData({...formData, subject: "biology"})}>
                  Biology
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormData({...formData, subject: "computer-science"})}>
                  Computer Science
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <label className="font-semibold text-sm text-gray-700">Groups</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full rounded-2xl bg-gray-100 p-3 mt-2 border border-gray-200 focus:outline-none focus:border-blue-500 text-left">
                  {formData.groups ? 
                    formData.groups.charAt(0).toUpperCase() + formData.groups.slice(1) 
                    : "Select Group"
                  }
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                <DropdownMenuLabel>Select Group</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFormData({...formData, groups: "science"})}>
                  Science
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormData({...formData, groups: "commerce"})}>
                  Commerce
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormData({...formData, groups: "arts"})}>
                  Arts
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <label className="font-semibold text-sm text-gray-700">Types</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full rounded-2xl bg-gray-100 p-3 mt-2 border border-gray-200 focus:outline-none focus:border-blue-500 text-left">
                  {formData.types ? 
                    formData.types.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ') 
                    : "Select Type"
                  }
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                <DropdownMenuLabel>Select Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFormData({...formData, types: "notes"})}>
                  Notes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormData({...formData, types: "assignment"})}>
                  Assignment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormData({...formData, types: "question-paper"})}>
                  Question Paper
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormData({...formData, types: "syllabus"})}>
                  Syllabus
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormData({...formData, types: "presentation"})}>
                  Presentation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div>
          <label className="font-semibold text-sm text-gray-700">Language *</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full rounded-2xl bg-gray-100 p-3 mt-2 border border-gray-200 focus:outline-none focus:border-blue-500 text-left">
                {formData.language ? 
                  formData.language.charAt(0).toUpperCase() + formData.language.slice(1) 
                  : "Select Language"
                }
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
              <DropdownMenuLabel>Select Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFormData({...formData, language: "english"})}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFormData({...formData, language: "kannada"})}>
                Kannada
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFormData({...formData, language: "hindi"})}>
                Hindi
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div> 

   
      <div className="w-1/2 bg-white rounded-2xl p-6 border-2 border-dashed border-gray-300">
        <div className="h-full flex flex-col">
          {/* Upload Header */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload and attach files</h3>
            <p className="text-sm text-gray-600 mb-4">Attachments will be a part of this project.</p>
            
       
            <label className="cursor-pointer">
              <input 
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleFileUpload}
                ref={fileInputRef}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-400 transition-colors">
                <div className="text-gray-500">
                  <p className="font-medium">Click to Upload or drag and drop</p>
                  <p className="text-sm mt-1">(Max. File size: 25 MB)</p>
                </div>
              </div>
            </label>
          </div>

       
          <div className="flex-1 overflow-y-auto">
          
            {completedFiles.length > 0 && (
              <div className="mb-4">
                <div className="h-px bg-gray-200 my-4"></div>
                {completedFiles.map((file, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-700">• {file.name}</span>
                    <button 
                      onClick={() => removeFile(file.name)}
                      className="text-gray-400 hover:text-red-500 text-lg"
                    >
                      ✗
                    </button>
                  </div>
                ))}
              </div>
            )}

     
            {uploadingFiles.length > 0 && (
              <div className="mb-4">
                <div className="h-px bg-gray-200 my-4"></div>
                <p className="text-sm text-gray-500 mb-3">{uploadingFiles.length} files uploading...</p>
                
                {uploadingFiles.map((file, index) => (
                  <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm text-gray-800">• {file.name}</p>
                        <p className="text-xs text-gray-500">{file.size} · {file.time}</p>
                      </div>
                      <button 
                        onClick={() => removeFile(file.name)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✗
                      </button>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-gray-500 mt-1">{Math.round(file.progress)}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>

      
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button 
              onClick={handleCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Upload Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}