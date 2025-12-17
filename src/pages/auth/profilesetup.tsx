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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 text-xs">This helps us personalize your experience</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Profile Photo */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-24 h-24 rounded-full bg-gray-200 shadow-md overflow-hidden flex items-center justify-center border border-gray-300">
              {previewPhoto ? (
                <img src={previewPhoto} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>

            <label
              htmlFor="profilePhoto"
              className="cursor-pointer mt-3 px-4 py-2 text-sm rounded-full border border-purple-600 text-purple-700 hover:bg-purple-50 transition"
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
            icon={<User className="w-4 h-4 text-gray-400" />}
          />

          {/* Phone */}
          <InputField
            id="phone"
            label="Phone Number"
            placeholder="9876543210"
            value={formData.phone}
            onChange={handleChange}
            icon={<Phone className="w-4 h-4 text-gray-400" />}
            type="tel"
          />

          {/* Qualification */}
          <InputField
            id="qualification"
            label="Qualification"
            placeholder="MSc Physics, B.Ed"
            value={formData.qualification}
            onChange={handleChange}
            icon={<GraduationCap className="w-4 h-4 text-gray-400" />}
          />

          {/* Experience */}
          <InputField
            id="experience"
            label="Experience (Years)"
            placeholder="5"
            value={formData.experience}
            onChange={handleChange}
            icon={<BookOpen className="w-4 h-4 text-gray-400" />}
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
            <label className="block text-xs font-semibold text-gray-700">Short Bio</label>
            <textarea
              id="bio"
              placeholder="Physics faculty with 10+ years experience..."
              value={formData.bio}
              onChange={handleChange}
              className="w-full h-28 px-4 py-2 text-sm rounded-xl border border-gray-300 bg-white outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-900 text-white font-bold py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
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
      <label htmlFor={id} className="block text-xs font-semibold text-gray-700">{label}</label>
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
          className="w-full pl-10 pr-3 py-2 text-sm rounded-full border border-gray-300 outline-none 
                     focus:border-purple-600 focus:ring-1 focus:ring-purple-600 bg-white 
                     transition duration-300 placeholder-gray-400"
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
      <label htmlFor={id} className="block text-xs font-semibold text-gray-700">{label}</label>

      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full h-10 pl-4 pr-3 text-sm rounded-full border border-gray-300 outline-none 
                   bg-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
      >
        <option value="">Select {label}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.toLowerCase()}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
