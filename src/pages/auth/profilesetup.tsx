import React, { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../lib/utils";

export default function ProfileSetup() {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    qualification: "",
    experience: "",
    phone: "",
    bio: "",
    pucHandling: "",
    profilePhoto: null as File | null
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, profilePhoto: e.target.files?.[0] || null });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("PROFILE SETUP DATA:", formData);
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-xl bg-[var(--background)] p-6 shadow-lg">
      <h1 className="mb-4 text-2xl font-bold text-[var(--secondary)]">
        Complete Your Profile
      </h1>

      <p className="mb-6 text-sm text-[var(--muted)]">
        Please fill out the required information to continue.
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        

        <div className="flex flex-col items-center space-y-3">
          <div className="h-28 w-28 rounded-full border-2 border-[var(--primary)] bg-[var(--accent)]"></div>

          <label
            htmlFor="profilePhoto"
            className="cursor-pointer rounded-md border border-[var(--primary)] px-4 py-1 text-[var(--primary)]"
          >
            Upload Photo
          </label>
          <input type="file" id="profilePhoto" className="hidden" onChange={handleFileUpload} />
        </div>

      
        <LabelInputContainer>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Dr. Sharma"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="border-[var(--secondary)]"
          />
        </LabelInputContainer>

       
        <LabelInputContainer>
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="h-10 w-full rounded-md border border-[var(--secondary)] bg-white px-3"
            
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </LabelInputContainer>

        
        <LabelInputContainer>
          <Label htmlFor="pucHandling">PUC Handling</Label>
          <select
            id="pucHandling"
            value={formData.pucHandling}
            onChange={handleChange}
            className="h-10 w-full rounded-md border border-[var(--secondary)] bg-white px-3"
            required
          >
            <option value="">Select</option>
            <option value="1st puc">1st PUC</option>
            <option value="2nd puc">2nd PUC</option>
            <option value="both">Both</option>
          </select>
        </LabelInputContainer>

       
        <LabelInputContainer>
          <Label htmlFor="qualification">Qualification</Label>
          <Input
            id="qualification"
            type="text"
            placeholder="MSc Physics, B.Ed"
            value={formData.qualification}
            onChange={handleChange}
            required
            className="border-[var(--secondary)]"
          />
        </LabelInputContainer>

      
        <LabelInputContainer>
          <Label htmlFor="experience">Experience (Years)</Label>
          <Input
            id="experience"
            type="number"
            placeholder="5"
            value={formData.experience}
            onChange={handleChange}
            required
            className="border-[var(--secondary)]"
          />
        </LabelInputContainer>

    
        <LabelInputContainer>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="9876543210"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border-[var(--secondary)]"
          />
        </LabelInputContainer>

       
        <LabelInputContainer>
          <Label htmlFor="bio">Short Bio</Label>
          <textarea
            id="bio"
            placeholder="Physics faculty with 10+ years experience..."
            value={formData.bio}
            onChange={handleChange}
            className="h-28 w-full rounded-md border border-[var(--secondary)] px-3 py-2"
          ></textarea>
        </LabelInputContainer>

      
        <button
          type="submit"
          className="w-full rounded-md bg-[var(--primary)] py-2 text-white transition-all hover:bg-red-700"
        >
          Save Profile & Continue
        </button>
      </form>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
};
