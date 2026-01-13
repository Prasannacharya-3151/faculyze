// src/pages/ProfileSetup.tsx
import React, { useState } from "react";
import {
  User,
  Phone,
  GraduationCap,
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
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";

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
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is not logged in
  // if (!user) {
  //   return <Navigate to="/auth/login" replace />;
  // }

  const firstLetter =
    user?.username?.charAt(0).toUpperCase() || "";

  const [formData, setFormData] = useState({
    gender: "",
    qualification: "",
    experience: "",
    phone_number: "",
    subjects: [] as string[],
    pucHandling: "",
  });

  /* ---------- SUBJECT STATES ---------- */
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [subjectError, setSubjectError] = useState("");
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  /* ---------- HANDLERS ---------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDropdown = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  /* ---------- SUBJECT FETCH ---------- */

  const handleAddSubjects = async () => {
    setShowSubjectPicker(true);
    setSubjectsLoading(true);
    setSubjectError("");
    setAvailableSubjects([]);

    try {
      const res = await fetch("/api/subjects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      if (!data?.subjects || data.subjects.length === 0) {
        setSubjectError("Subjects not available right now");
      } else {
        setAvailableSubjects(data.subjects);
      }
    } catch {
      setSubjectError("Subjects not available right now");
    } finally {
      setSubjectsLoading(false);
    }
  };

  const toggleSubject = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  /* ---------- SUBMIT ---------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ VALIDATION
    if (
      !formData.phone_number.trim() ||
      !formData.qualification.trim() ||
      !formData.gender ||
      !formData.experience ||
      formData.subjects.length === 0
    ) {
      toast.error("All fields are mandatory");
      return;
    }

    const payload = {
      phone_number: formData.phone_number.startsWith("+")
        ? formData.phone_number
        : `+91${formData.phone_number}`,
      qualification: formData.qualification,
      experience: Number(formData.experience),
      gender: formData.gender.toLowerCase(),
      subjects: formData.subjects,
    };

    try {
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Profile update failed");
      }

      toast.success("Profile updated successfully");
      // ✅ redirect to home
      setTimeout(() =>{
        navigate("/");

      }, 1200)
    } catch (err: any) {
      toast.error(err.message || "Profile update failed");
    }
  };

  /* ---------- UI ---------- */

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

          {/* AVATAR */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground
              flex items-center justify-center text-3xl font-bold">
              {firstLetter}
            </div>
          </div>

          {/* FULL NAME */}
          <InputField
            id="fullName"
            label="Full Name"
            value={user?.username || ""}
            onChange={() => {}}
            icon={<User className="w-4 h-4" />}
          />

          {/* PHONE */}
          <InputField
            id="phone_number"
            label="Phone Number"
            placeholder="9876543210"
            value={formData.phone_number}
            onChange={handleChange}
            icon={<Phone className="w-4 h-4" />}
          />

          {/* QUALIFICATION */}
          <InputField
            id="qualification"
            label="Qualification"
            placeholder="MSc Physics, B.Ed"
            value={formData.qualification}
            onChange={handleChange}
            icon={<GraduationCap className="w-4 h-4" />}
          />

          {/* SUBJECTS */}
          <div className="space-y-2">
            <label className="text-xs font-semibold">Subjects</label>

            <div className="flex flex-wrap gap-2">
              {formData.subjects.map((s) => (
                <span
                  key={s}
                  onClick={() => toggleSubject(s)}
                  className="px-3 py-1 rounded-full text-xs
                  bg-primary/10 text-primary cursor-pointer"
                >
                  {s} ✕
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddSubjects}
              className="text-sm text-primary underline"
            >
              + Add Subjects
            </button>

            {subjectsLoading && (
              <p className="text-xs text-muted-foreground">
                Loading subjects…
              </p>
            )}

            {subjectError && !subjectsLoading && (
              <p className="text-xs text-muted-foreground">
                {subjectError}
              </p>
            )}

            {!subjectsLoading &&
              !subjectError &&
              showSubjectPicker &&
              availableSubjects.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {availableSubjects.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSubject(s)}
                      className={`px-3 py-1 rounded-full text-xs border ${
                        formData.subjects.includes(s)
                          ? "bg-primary text-primary-foreground"
                          : "border-muted"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
          </div>

          {/* EXPERIENCE */}
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

          {/* SAVE */}
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground
            font-semibold py-2.5 rounded-full shadow-md"
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
    <div className="space-y-1">
      <label className="text-xs font-semibold">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-3 py-2 text-sm rounded-full
          bg-transparent border border-muted outline-none
          focus:border-primary focus:ring-1 focus:ring-ring"
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



