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
    console.log("PROFILE DATA:", formData);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* HEADER */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-foreground">
              Complete Your Profile
            </h1>
            <p className="text-xs text-muted-foreground">
              This helps us personalize your experience
            </p>
          </div>

          {/* PROFILE PHOTO */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border border-muted flex items-center justify-center overflow-hidden">
              {previewPhoto ? (
                <img
                  src={previewPhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-muted" />
              )}
            </div>

            <label
              htmlFor="profilePhoto"
              className="
                mt-3 px-4 py-2 text-sm rounded-full
                border border-primary text-primary
                hover:bg-primary/10 transition cursor-pointer
              "
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
            icon={<User className="w-4 h-4" />}
          />

          <InputField
            id="phone"
            label="Phone Number"
            placeholder="9876543210"
            value={formData.phone}
            onChange={handleChange}
            icon={<Phone className="w-4 h-4" />}
          />

          <InputField
            id="qualification"
            label="Qualification"
            placeholder="MSc Physics, B.Ed"
            value={formData.qualification}
            onChange={handleChange}
            icon={<GraduationCap className="w-4 h-4" />}
          />

          <InputField
            id="experience"
            label="Experience (Years)"
            placeholder="5"
            value={formData.experience}
            onChange={handleChange}
            icon={<BookOpen className="w-4 h-4" />}
            type="number"
          />

          {/* DROPDOWNS */}
          <DropdownBlock
            label="Gender"
            current={formData.gender || "Select Gender"}
            icon={<Users className="w-4 h-4" />}
            onSelect={(v) => handleDropdown("gender", v)}
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Others", value: "Others" },
            ]}
          />

          <DropdownBlock
            label="PUC Handling"
            current={formData.pucHandling || "Select PUC"}
            icon={<School className="w-4 h-4" />}
            onSelect={(v) => handleDropdown("pucHandling", v)}
            options={[
              { label: "1st PUC", value: "1st PUC" },
              { label: "2nd PUC", value: "2nd PUC" },
            ]}
          />

          {/* BIO */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Short Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Physics faculty with 10+ years experience..."
              className="
                w-full h-28 px-4 py-2 text-sm rounded-xl
                bg-transparent border border-muted
                outline-none transition
                focus:border-primary focus:ring-1 focus:ring-ring
                resize-none
              "
            />
          </div>

          {/* SAVE BUTTON */}
          <button
            type="submit"
            className="
              w-full bg-primary text-primary-foreground
              font-semibold py-2.5 rounded-full
              shadow-md hover:opacity-90 transition
            "
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- INPUT ---------- */
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
      {/* LABEL */}
      <label
        htmlFor={id}
        className="
          block w-full px-3 py-1 rounded-md
          text-xs font-semibold text-foreground
          transition
          
        "
      >
        {label}
      </label>

      {/* INPUT */}
      <div className="relative">
        {/* ICON */}
        <span
          className="
            absolute left-3 top-1/2 -translate-y-1/2
            text-muted
            transition-colors
            group-focus-within:text-primary
          "
        >
          {icon}
        </span>

        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="
            w-full pl-10 pr-3 py-2 text-sm rounded-full
            bg-transparent border border-muted
            outline-none transition
            focus:border-primary focus:ring-1 focus:ring-ring
            placeholder:text-muted-foreground
          "
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
