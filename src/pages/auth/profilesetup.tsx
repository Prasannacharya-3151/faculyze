import React, { useState } from "react";
import {
  User,
  Phone,
  GraduationCap,
  Image as ImageIcon,
  BookOpen,
  Users,
  School,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

/* ---------- TYPES ---------- */

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

/* ---------- MAIN ---------- */

export default function ProfileSetup() {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    qualification: "",
    experience: "",
    phone: "",
    bio: "",
    pucHandling: "",
    profilePhoto: null as File | null,
  });

  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDropdown = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, profilePhoto: file });
    if (file) setPreviewPhoto(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("PROFILE SETUP DATA:", formData);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* HEADING */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Complete Your Profile
          </h1>
          <p className="text-xs text-muted-foreground">
            This helps us personalize your experience
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* PROFILE PHOTO */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-muted/30 overflow-hidden flex items-center justify-center">
              {previewPhoto ? (
                <img src={previewPhoto} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-muted" />
              )}
            </div>

            <label
              htmlFor="profilePhoto"
              className="mt-3 px-4 py-2 text-sm rounded-full border border-primary text-primary hover:bg-primary/10 transition cursor-pointer"
            >
              Upload Photo
            </label>

            <input
              id="profilePhoto"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* INPUTS */}
          <InputField
            id="fullName"
            label="Full Name"
            placeholder="Dr. Sharma"
            value={formData.fullName}
            onChange={handleChange}
            icon={<User className="w-4 h-4 text-muted group-focus-within:text-primary" />}
          />

          <InputField
            id="phone"
            label="Phone Number"
            placeholder="9876543210"
            value={formData.phone}
            onChange={handleChange}
            type="tel"
            icon={<Phone className="w-4 h-4 text-muted group-focus-within:text-primary" />}
          />

          <InputField
            id="qualification"
            label="Qualification"
            placeholder="MSc Physics, B.Ed"
            value={formData.qualification}
            onChange={handleChange}
            icon={<GraduationCap className="w-4 h-4 text-muted group-focus-within:text-primary" />}
          />

          <InputField
            id="experience"
            label="Experience (Years)"
            placeholder="5"
            value={formData.experience}
            onChange={handleChange}
            type="number"
            icon={<BookOpen className="w-4 h-4 text-muted group-focus-within:text-primary" />}
          />

          {/* DROPDOWNS */}
          <DropdownBlock
            label="Gender"
            current={formData.gender || "Select Gender"}
            icon={<Users className="w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />}
            onSelect={(v) => handleDropdown("gender", v)}
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Others", value: "others" },
            ]}
          />

          <DropdownBlock
            label="PUC Handling"
            current={formData.pucHandling || "Select PUC"}
            icon={<School className="w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />}
            onSelect={(v) => handleDropdown("pucHandling", v)}
            options={[
              { label: "1st PUC", value: "1st" },
              { label: "2nd PUC", value: "2nd" },
            ]}
          />

          {/* BIO */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Short Bio</label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Physics faculty with 10+ years experience..."
              className="w-full h-28 px-4 py-2 text-sm rounded-xl border border-muted bg-card
                         outline-none focus:border-primary focus:ring-1 focus:ring-ring transition"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-semibold
                       py-2.5 rounded-full shadow-md hover:opacity-90 transition"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- REUSABLE INPUT ---------- */

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
    <div className="space-y-1">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      <div className="relative group">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-3 py-2 text-sm rounded-full
                     border border-muted bg-card
                     outline-none focus:border-primary focus:ring-1 focus:ring-ring
                     transition placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}

/* ---------- DROPDOWN BLOCK ---------- */


function DropdownBlock({
  label,
  current,
  icon,
  onSelect,
  options,
}: DropdownBlockProps) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full pl-10 pr-3 py-2 rounded-full border border-muted text-left text-sm relative bg-card text-foreground hover:bg-card/80 transition">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
            {current}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card border-muted text-foreground">
          {options.map((o) => (
            <DropdownMenuItem 
              key={o.value} 
              onClick={() => onSelect(o.value)}
              className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
            >
              {o.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
