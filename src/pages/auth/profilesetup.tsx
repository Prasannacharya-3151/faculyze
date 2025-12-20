import React, { useState } from "react";
import { User, Phone, GraduationCap, Image as ImageIcon, BookOpen } from "lucide-react";
import type { ReactNode } from "react";

interface InputFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  type?: string;
}

interface DropdownFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}


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
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData({ ...formData, profilePhoto: file ?? null });

    if (file) {
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("PROFILE SETUP DATA:", formData);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="text-muted-foreground text-xs">This helps us personalize your experience</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Profile Photo */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-24 h-24 rounded-full bg-muted/30 shadow-md overflow-hidden flex items-center justify-center border border-muted">
              {previewPhoto ? (
                <img src={previewPhoto} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <ImageIcon className="w-8 h-8 text-muted" />
              )}
            </div>

            <label
              htmlFor="profilePhoto"
              className="cursor-pointer mt-3 px-4 py-2 text-sm rounded-full border border-primary text-primary hover:bg-primary/10 transition"
            >
              Upload Photo
            </label>

            <input 
              type="file" 
              id="profilePhoto" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>

          {/* Full Name */}
          <InputField
            id="fullName"
            label="Full Name"
            placeholder="Dr. Sharma"
            value={formData.fullName}
            onChange={handleChange}
            icon={<User className="w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />}
          />

          {/* Phone */}
          <InputField
            id="phone"
            label="Phone Number"
            placeholder="9876543210"
            value={formData.phone}
            onChange={handleChange}
            icon={<Phone className="w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />}
            type="tel"
          />

          {/* Qualification */}
          <InputField
            id="qualification"
            label="Qualification"
            placeholder="MSc Physics, B.Ed"
            value={formData.qualification}
            onChange={handleChange}
            icon={<GraduationCap className="w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />}
          />

          {/* Experience */}
          <InputField
            id="experience"
            label="Experience (Years)"
            placeholder="5"
            value={formData.experience}
            onChange={handleChange}
            icon={<BookOpen className="w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />}
            type="number"
          />

          {/* Gender */}
          <DropdownField
            id="gender"
            label="Gender"
            value={formData.gender}
            onChange={handleChange}
            options={["Male", "Female", "Other"]}
          />

          {/* PUC Handling */}
          <DropdownField
            id="pucHandling"
            label="PUC Handling"
            value={formData.pucHandling}
            onChange={handleChange}
            options={["1st PUC", "2nd PUC", "Both"]}
          />

          {/* Bio */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-foreground">Short Bio</label>
            <textarea
              id="bio"
              placeholder="Physics faculty with 10+ years experience..."
              value={formData.bio}
              onChange={handleChange}
              className="w-full h-28 px-4 py-2 text-sm rounded-xl border border-muted bg-card outline-none focus:border-primary focus:ring-1 focus:ring-ring transition"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-full shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-md"
          >
            Save Profile
          </button>

        </form>
      </div>
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
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-semibold text-foreground">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>

        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-3 py-2 text-sm rounded-full border border-muted outline-none 
                     focus:border-primary focus:ring-1 focus:ring-ring bg-card 
                     transition duration-300 placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}


function DropdownField({
  id,
  label,
  value,
  onChange,
  options,
}: DropdownFieldProps) {

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-semibold text-foreground">{label}</label>

      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full h-10 pl-4 pr-3 text-sm rounded-full border border-muted outline-none 
                   bg-card focus:border-primary focus:ring-1 focus:ring-ring transition"
      >
        <option value="" className="text-muted-foreground">Select {label}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.toLowerCase()}>{opt}</option>
        ))}
      </select>
    </div>
  );
}