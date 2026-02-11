// import React, { useState, useEffect } from "react";
// import {
//   Phone,
//   GraduationCap,
//   BookOpen,
//   Users,
//   ChevronDown,
//   Check,
// } from "lucide-react";
// import type { ReactNode } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "../../components/ui/dropdown-menu";
// import { useAuth } from "../../context/AuthContext";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { API_BASE } from "../../lib/api";


// interface InputFieldProps {
//   id: string;
//   label: string;
//   placeholder?: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   icon?: ReactNode;
//   type?: string;
//   disabled?: boolean;
// }

// interface DropdownOption {
//   label: string;
//   value: string;
// }

// interface DropdownBlockProps {
//   label: string;
//   current: string;
//   icon?: ReactNode;
//   onSelect: (value: string) => void;
//   options: DropdownOption[];
// }


// export default function ProfileSetup() {
//   const { user, token, refreshUser } = useAuth();
//   const navigate = useNavigate();

//   // State for user data  maintain even after refresh
//   const [userData, setUserData] = useState({
//     username: "",
//     email: "",
//     profile_completed: false,
//   });

//   useEffect(() => {
//     if (user) {
//       setUserData({
//         username: user.username || "",
//         email: user.email || "",
//         profile_completed: user.profile_completed || false,
//       });
//     } else {
//       // Try to get from localStorage as fallback
//       const savedUser = localStorage.getItem("user");
//       if (savedUser) {
//         try {
//           const parsedUser = JSON.parse(savedUser);
//           setUserData({
//             username: parsedUser.username || "",
//             email: parsedUser.email || "",
//             profile_completed: parsedUser.profile_completed || false,
//           });
//         } catch (error) {
//           console.error("Error parsing saved user:", error);
//         }
//       }
//     }
//   }, [user]);

//   const firstLetter = userData?.username?.charAt(0).toUpperCase() || "U";

//   const [formData, setFormData] = useState({
//     gender: "",
//     qualification: "",
//     experience: "",
//     phone_number: "",
//     subjects: [] as string[],
//   });

//   const [subjectsLoading, setSubjectsLoading] = useState(false);
//   const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
//   const [subjectError, setSubjectError] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (userData.profile_completed) {
//       navigate("/", { replace: true });
//     }
//   }, [userData.profile_completed, navigate]);

//   useEffect(() => {
//     // Save form data to localStorage
//     localStorage.setItem("profileFormData", JSON.stringify(formData));
//   }, [formData]);

//   useEffect(() => {
//     const savedFormData = localStorage.getItem("profileFormData");
//     if (savedFormData) {
//       try {
//         const parsedData = JSON.parse(savedFormData);
//         setFormData(prev => ({
//           ...prev,
//           ...parsedData,
//         //in the server side subject is coming as array so we need to check before setting it to state 
//           subjects: Array.isArray(parsedData.subjects) ? parsedData.subjects : []
//         }));
//       } catch (error) {
//         console.error("Error parsing saved form data:", error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       if (!token) return;
      
//       setSubjectsLoading(true);
//       setSubjectError("");

//       try {
//         const res = await fetch(`${API_BASE}/faculty/subjects`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }

//         const data = await res.json();
        
//         console.log("Subjects API Response:", data);
        
//         if (data?.data?.subjects && Array.isArray(data.data.subjects)) {
//           setAvailableSubjects(data.data.subjects);
//         } else if (data?.subjects && Array.isArray(data.subjects)) {
//           setAvailableSubjects(data.subjects);
//         } else {
//           setSubjectError("No subjects available");
//         }
//       } catch (err: any) {
//         console.error("Error fetching subjects:", err);
//         setSubjectError("Failed to load subjects. Please try again.");
//       } finally {
//         setSubjectsLoading(false);
//       }
//     };

//     fetchSubjects();
//   }, [token]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({ ...prev, [id]: value }));
//   };

//   const handleDropdown = (
//     field: keyof typeof formData,
//     value: string
//   ) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const toggleSubject = (subject: string) => {
//     setFormData(prev => ({
//       ...prev,
//       subjects: prev.subjects.includes(subject)
//         ? prev.subjects.filter((s) => s !== subject)
//         : [...prev.subjects, subject],
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Validation
//     if (
//       !formData.phone_number ||
//       !formData.qualification ||
//       !formData.gender ||
//       !formData.experience ||
//       formData.subjects.length === 0
//     ) {
//       toast.error("All fields are mandatory");
//       setIsSubmitting(false);
//       return;
//     }

//     const payload = {
//       phone_number: formData.phone_number.startsWith("+")
//         ? formData.phone_number
//         : `+91${formData.phone_number}`,
//       qualification: formData.qualification,
//       experience: Number(formData.experience),
//       gender: formData.gender.toLowerCase(),
//       subjects: formData.subjects,
//     };

//     console.log("Submitting profile data:", payload);

//     try {
//       const res = await fetch(`${API_BASE}/faculty/profileupdate`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const responseData = await res.json();

//       if (!res.ok) {
//         throw new Error(responseData.message || "Profile update failed");
//       }

//       // Clear saved form data
//       localStorage.removeItem("profileFormData");
//       if (refreshUser) {
//         await refreshUser();
//       }

//       toast.success("Profile updated successfully!");
//       navigate("/", { replace: true });
//     } catch (err: any) {
//       console.error("Profile update error:", err);
//       toast.error(err.message || "Profile update failed. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <form className="space-y-4" onSubmit={handleSubmit}>
//           {/* HEADER */}
//           <div className="text-center mb-4">
//             <h1 className="text-2xl font-bold text-foreground">
//               Complete Your Profile
//             </h1>
//             <p className="text-xs text-muted-foreground">
//               This helps us personalize your experience
//             </p>
//           </div>
//           <div className="flex flex-col items-center gap-3 mb-6">
//             <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground
//               flex items-center justify-center text-3xl font-bold shadow-lg">
//               {firstLetter}
//             </div>
//             <div className="text-center">
//               <h2 className="text-lg font-semibold text-foreground">
//                 {userData.username || ""}
//               </h2>
//               <p className="text-sm text-muted-foreground">
//                 {userData.email || ""}
//               </p>
//             </div>
//           </div>
//           <InputField
//             id="phone_number"
//             label="Phone Number"
//             placeholder="9876543210"
//             value={formData.phone_number}
//             onChange={handleChange}
//             icon={<Phone className="w-4 h-4" />}
//           />
//           <InputField
//             id="qualification"
//             label="Qualification"
//             placeholder="MSc Physics, B.Ed"
//             value={formData.qualification}
//             onChange={handleChange}
//             icon={<GraduationCap className="w-4 h-4" />}
//           />
//           <div className="space-y-2">
//             <label className="text-xs font-semibold text-foreground flex items-center justify-between">
//               <span>Subjects *</span>
//               <span className="text-xs font-normal text-muted-foreground">
//                 {formData.subjects.length} selected
//               </span>
//             </label>

//             <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
//               <DropdownMenuTrigger asChild>
//                 <div className="relative group">
//                   <div className="relative">
//                     <div className="w-full pl-5 pr-10 py-2.5 text-sm rounded-full
//                       border border-muted bg-transparent outline-none
//                       focus-within:border-primary focus-within:ring-1 focus-within:ring-ring
//                       cursor-pointer hover:bg-muted/5 transition-all duration-200
//                       min-h-[44px] flex items-center flex-wrap gap-1">
//                       <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
//                         <BookOpen className="w-4 h-4" />
//                       </div>
//                       {formData.subjects.length === 0 ? (
//                         <span className="text-muted-foreground pl-4">
//                           Select subjects
//                         </span>
//                       ) : (
//                         <div className="flex flex-wrap items-center gap-1 pl-4">
//                           {formData.subjects.slice(0, 3).map((subject) => (
//                             <span
//                               key={subject}
//                               className="inline-flex items-center gap-1 px-2 py-1 rounded-full 
//                                 text-xs bg-primary/10 text-primary border border-primary/20
//                                 whitespace-nowrap"
//                             >
//                               <span className="capitalize">{subject}</span>
//                             </span>
//                           ))}
//                           {formData.subjects.length > 3 && (
//                             <span className="text-xs text-muted-foreground">
//                               +{formData.subjects.length - 3} more
//                             </span>
//                           )}
//                         </div>
//                       )}
//                       <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted 
//                         transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
//                     </div>
//                   </div>
//                 </div>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent
//                 className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-64 overflow-y-auto 
//                   bg-background border border-muted rounded-xl shadow-lg p-2"
//                 align="start"
//                 sideOffset={4}
//               >
//                 {subjectsLoading ? (
//                   <div className="flex items-center justify-center py-4">
//                     <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
//                     <span className="ml-2 text-sm text-muted-foreground">Loading subjects...</span>
//                   </div>
//                 ) : subjectError ? (
//                   <div className="text-center py-4">
//                     <p className="text-sm text-destructive">{subjectError}</p>
//                   </div>
//                 ) : availableSubjects.length === 0 ? (
//                   <div className="text-center py-4">
//                     <p className="text-sm text-muted-foreground">No subjects available</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-1">
//                     {availableSubjects.map((subject) => {
//                       const isSelected = formData.subjects.includes(subject);
//                       return (
//                         <div
//                           key={subject}
//                           className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer
//                             transition-colors duration-150 ${isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
//                           onClick={() => toggleSubject(subject)}
//                         >
//                           <div className={`w-4 h-4 flex items-center justify-center rounded border
//                             ${isSelected ? 'bg-primary border-primary' : 'border-muted'}`}>
//                             {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
//                           </div>
//                           <span className="text-sm text-foreground capitalize flex-1">
//                             {subject}
//                           </span>
//                           {isSelected && (
//                             <span className="text-xs text-primary font-medium">✓</span>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
                
//                 {formData.subjects.length > 0 && (
//                   <div className="mt-2 pt-2 border-t border-muted">
//                     <button
//                       type="button"
//                       onClick={() => setFormData(prev => ({ ...prev, subjects: [] }))}
//                       className="w-full text-xs text-destructive hover:text-destructive/80 
//                         py-1.5 px-2 rounded hover:bg-destructive/5 transition-colors"
//                     >
//                       Clear all selections
//                     </button>
//                   </div>
//                 )}
//               </DropdownMenuContent>
//             </DropdownMenu>

//             {formData.subjects.length === 0 && (
//               <p className="text-xs text-destructive mt-1">
//                 Please select at least one subject
//               </p>
//             )}
//           </div>
//           <InputField
//             id="experience"
//             label="Experience (Years)"
//             placeholder="5"
//             value={formData.experience}
//             onChange={handleChange}
//             icon={<BookOpen className="w-4 h-4" />}
//             type="number"
//           />
//           <DropdownBlock
//             label="Gender"
//             current={formData.gender || "Select Gender"}
//             icon={<Users className="w-4 h-4" />}
//             onSelect={(v) => handleDropdown("gender", v)}
//             options={[
//               { label: "Male", value: "Male" },
//               { label: "Female", value: "Female" },
//               { label: "Others", value: "Others" },
//             ]}
//           />
//           <button
//             type="submit"
//             disabled={isSubmitting || formData.subjects.length === 0}
//             className="w-full bg-primary text-primary-foreground font-semibold 
//               py-2.5 rounded-full shadow-md hover:shadow-lg hover:opacity-90 
//               transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
//               disabled:hover:shadow-md mt-6"
//           >
//             {isSubmitting ? (
//               <span className="flex items-center justify-center gap-2">
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 Saving Profile...
//               </span>
//             ) : (
//               "Save Profile"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
// function InputField({
//   id,
//   label,
//   placeholder,
//   value,
//   onChange,
//   icon,
//   type = "text",
//   disabled = false,
// }: InputFieldProps) {
//   return (
//     <div className="space-y-1">
//       <label htmlFor={id} className="text-xs font-semibold text-foreground">
//         {label}
//       </label>

//       <div className="relative group">
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//           <span className="text-muted group-focus-within:text-primary transition-colors duration-200">
//             {icon}
//           </span>
//         </div>
//         <input
//           id={id}
//           type={type}
//           placeholder={placeholder}
//           value={value}
//           onChange={onChange}
//           disabled={disabled}
//           className="w-full pl-10 pr-3 py-2.5 text-sm rounded-full
//           bg-transparent border border-muted outline-none
//           focus:border-primary focus:ring-1 focus:ring-ring 
//           text-foreground disabled:opacity-50 disabled:cursor-not-allowed
//           transition-all duration-200"
//         />
//       </div>
//     </div>
//   );
// }
// function DropdownBlock({
//   label,
//   current,
//   icon,
//   onSelect,
//   options,
// }: DropdownBlockProps) {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="space-y-1">
//       <label className="text-xs font-semibold text-foreground">
//         {label}
//       </label>

//       <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
//         <DropdownMenuTrigger asChild>
//           <button
//             type="button"
//             className="
//               relative w-full pl-10 pr-10 py-2.5 rounded-full
//               text-left text-sm
//               bg-transparent border border-muted
//               outline-none transition-all duration-200
//               focus:border-primary focus:ring-1 focus:ring-ring
//               hover:bg-muted/5
//               group
//             "
//           >
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <span className="text-muted group-focus-within:text-primary transition-colors duration-200">
//                 {icon}
//               </span>
//             </div>
//             <span className={current.startsWith("Select") ? "text-muted-foreground" : "text-foreground"}>
//               {current}
//             </span>
//             <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}>
//               <ChevronDown className="w-4 h-4" />
//             </span>
//           </button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent
//           className="w-[var(--radix-dropdown-menu-trigger-width)] bg-background 
//             border border-muted rounded-xl shadow-lg p-1"
//           align="start"
//           sideOffset={4}
//         >
//           {options.map((o) => (
//             <div
//               key={o.value}
//               onClick={() => {
//                 onSelect(o.value);
//                 setIsOpen(false);
//               }}
//               className="
//                 cursor-pointer px-3 py-2 rounded-lg text-sm text-foreground
//                 hover:bg-primary/10 transition-colors duration-150
//               "
//             >
//               {o.label}
//             </div>
//           ))}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// }