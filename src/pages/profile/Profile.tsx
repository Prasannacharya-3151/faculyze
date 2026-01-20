// import { useState } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../../components/ui/dropdown-menu";

// interface ProfileData {
//   fullName: string;
//   collegeEmail: string;
//   phoneNumber: string;
//   gender: string;
//   rolePosition: string;
//   department: string;
//   pucHandling: string;
//   qualification: string;
//   experience: string;
//   shortBio: string;
//   currentPassword: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// export default function Profile() {
//   const [profileData, setProfileData] = useState<ProfileData>({
//     fullName: "Dr. Rajesh Kumar",
//     collegeEmail: "rajesh.kumar@college.edu",
//     phoneNumber: "+91 9876543210",
//     gender: "Male",
//     rolePosition: "Senior Faculty",
//     department: "Physics Department",
//     pucHandling: "Both 1st & 2nd PUC",
//     qualification: "M.Sc Physics, Ph.D, B.Ed",
//     experience: "12 years",
//     shortBio: "Physics faculty with 12+ years experience in teaching PUC students. Specialized in Quantum Mechanics and Thermodynamics.",
//     currentPassword: "••••••••",
//     newPassword: "",
//     confirmPassword: ""
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setProfileData({
//       ...profileData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSelectChange = (field: keyof ProfileData, value: string) => {
//     setProfileData({
//       ...profileData,
//       [field]: value
//     });
//   };

//   const handleSave = () => {
//     console.log("Saving profile:", profileData);
//     alert("Profile updated successfully!");
//   };

//   const handleCancel = () => {
//     alert("Changes discarded");
//   };

//   return (
//     <div className="w-full p-6">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h1>
      
//       {/* <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm"> */}
//         <div className="w-full flex flex-col lg:flex-row gap-8">
//           {/* LEFT COLUMN */}
//           <div className="w-full lg:w-1/2 flex flex-col gap-8">
//             {/* Basic Information Card */}
//             {/* <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"> */}
//               <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">Basic Information</h3>
              
//               <div className="space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Full name *</label>
//                   <input
//                     type="text"
//                     name="fullName"
//                     value={profileData.fullName}
//                     onChange={handleInputChange}
//                     className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">College Email (non-editable) *</label>
//                   <input
//                     type="email"
//                     name="collegeEmail"
//                     value={profileData.collegeEmail}
//                     readOnly
//                     className="w-full rounded-xl bg-gray-100 p-3 border border-gray-300 text-gray-500 cursor-not-allowed"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">College email cannot be changed</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
//                   <input
//                     type="tel"
//                     name="phoneNumber"
//                     value={profileData.phoneNumber}
//                     onChange={handleInputChange}
//                     className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <button 
//                         className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 text-left transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       >
//                         <div className="flex justify-between items-center">
//                           <span>{profileData.gender}</span>
//                           <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                           </svg>
//                         </div>
//                       </button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white shadow-lg border border-gray-300 rounded-xl">
//                       <DropdownMenuLabel className="text-gray-700 font-medium px-3 py-2">Select Gender</DropdownMenuLabel>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem 
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                         onClick={() => handleSelectChange('gender', 'Male')}
//                       >
//                         Male
//                       </DropdownMenuItem>
//                       <DropdownMenuItem 
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                         onClick={() => handleSelectChange('gender', 'Female')}
//                       >
//                         Female
//                       </DropdownMenuItem>
//                       <DropdownMenuItem 
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                         onClick={() => handleSelectChange('gender', 'Other')}
//                       >
//                         Other
//                       </DropdownMenuItem>
//                       <DropdownMenuItem 
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                         onClick={() => handleSelectChange('gender', 'Prefer not to say')}
//                       >
//                         Prefer not to say
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Role/Position *</label>
//                   <input
//                     type="text"
//                     name="rolePosition"
//                     value={profileData.rolePosition}
//                     onChange={handleInputChange}
//                     className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
//                   <input
//                     type="text"
//                     name="department"
//                     value={profileData.department}
//                     onChange={handleInputChange}
//                     className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     required
//                   />
//                 </div>
//               </div>
//             {/* </div> */}

//             {/* Password Card */}
//             <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
//               <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">Password</h3>
              
//               <div className="space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Current Password *</label>
//                   <input
//                     type="password"
//                     name="currentPassword"
//                     value={profileData.currentPassword}
//                     onChange={handleInputChange}
//                     className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
//                   <input
//                     type="password"
//                     name="newPassword"
//                     value={profileData.newPassword}
//                     onChange={handleInputChange}
//                     className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     value={profileData.confirmPassword}
//                     onChange={handleInputChange}
//                     className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="w-full lg:w-1/2 flex flex-col gap-8">
//             {/* Academic Details Card */}
//             <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
//               <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">Academic Details</h3>
              
//               <div className="space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">PUC Handling *</label>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <button 
//                         className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 text-left transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       >
//                         <div className="flex justify-between items-center">
//                           <span>{profileData.pucHandling}</span>
//                           <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                           </svg>
//                         </div>
//                       </button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white shadow-lg border border-gray-300 rounded-xl">
//                       <DropdownMenuLabel className="text-gray-700 font-medium px-3 py-2">Select PUC Handling</DropdownMenuLabel>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem 
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                         onClick={() => handleSelectChange('pucHandling', '1st PUC')}
//                       >
//                         1st PUC
//                       </DropdownMenuItem>
//                       <DropdownMenuItem 
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                         onClick={() => handleSelectChange('pucHandling', '2nd PUC')}
//                       >
//                         2nd PUC
//                       </DropdownMenuItem>
//                       <DropdownMenuItem 
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                         onClick={() => handleSelectChange('pucHandling', 'Both 1st & 2nd PUC')}
//                       >
//                         Both 1st & 2nd PUC
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Qualification *</label>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <button 
//                         className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 text-left transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       >
//                         <div className="flex justify-between items-center">
//                           <span>{profileData.qualification}</span>
//                           <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                           </svg>
//                         </div>
//                       </button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white shadow-lg border border-gray-300 rounded-xl">
//                       <DropdownMenuLabel className="text-gray-700 font-medium px-3 py-2">Select Qualification</DropdownMenuLabel>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem 
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                         onClick={() => handleSelectChange('qualification', 'M.Sc Physics, B.Ed')}
//                       >
//                         M.Sc Physics, B.Ed
//                       </DropdownMenuItem>
//                       <DropdownMenuItem 
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                         onClick={() => handleSelectChange('qualification', 'M.Sc Physics, Ph.D, B.Ed')}
//                       >
//                         M.Sc Physics, Ph.D, B.Ed
//                       </DropdownMenuItem>
//                       <DropdownMenuItem 
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                         onClick={() => handleSelectChange('qualification', 'Ph.D Physics, M.Ed')}
//                       >
//                         Ph.D Physics, M.Ed
//                       </DropdownMenuItem>
//                       <DropdownMenuItem 
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                         onClick={() => handleSelectChange('qualification', 'M.Sc, M.Phil, B.Ed')}
//                       >
//                         M.Sc, M.Phil, B.Ed
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years) *</label>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <button 
//                         className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 text-left transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       >
//                         <div className="flex justify-between items-center">
//                           <span>{profileData.experience}</span>
//                           <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                           </svg>
//                         </div>
//                       </button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white shadow-lg border border-gray-300 rounded-xl">
//                       <DropdownMenuLabel className="text-gray-700 font-medium px-3 py-2">Select Experience</DropdownMenuLabel>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem 
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                         onClick={() => handleSelectChange('experience', '1-2 years')}
//                       >
//                         1-2 years
//                       </DropdownMenuItem>
//                       <DropdownMenuItem 
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                         onClick={() => handleSelectChange('experience', '3-5 years')}
//                       >
//                         3-5 years
//                       </DropdownMenuItem>
//                       <DropdownMenuItem 
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                         onClick={() => handleSelectChange('experience', '5-10 years')}
//                       >
//                         5-10 years
//                       </DropdownMenuItem>
//                       <DropdownMenuItem 
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                         onClick={() => handleSelectChange('experience', '10+ years')}
//                       >
//                         10+ years
//                       </DropdownMenuItem>
//                       <DropdownMenuItem 
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                         onClick={() => handleSelectChange('experience', '15+ years')}
//                       >
//                         15+ years
//                       </DropdownMenuItem>
//                       <DropdownMenuItem 
//                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
//                         onClick={() => handleSelectChange('experience', '20+ years')}
//                       >
//                         20+ years
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Short Bio *</label>
//                   <textarea
//                     name="shortBio"
//                     value={profileData.shortBio}
//                     onChange={handleInputChange}
//                     rows={4}
//                     className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
//                     placeholder="Brief about your teaching experience, specialization, etc."
//                     maxLength={500}
//                   />
//                   <p className="text-xs text-gray-500 mt-1 text-right">{profileData.shortBio.length}/500 characters</p>
//                 </div>
//               </div>
//             </div>

//             {/* Physics Dashboard Card */}
//             <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-2xl border border-amber-200 shadow-md">
//               <div className="text-center mb-6">
//                 <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mb-3 shadow-lg">
//                   <span className="text-2xl font-bold text-white">P</span>
//                 </div>
//                 <h1 className="text-3xl font-bold text-amber-900 mb-1">Physics</h1>
//                 <p className="text-amber-700">Department Dashboard</p>
//               </div>

//               <div className="space-y-4">
//                 <div className="flex flex-col sm:flex-row gap-3">
//                   <button
//                     onClick={handleCancel}
//                     className="flex-1 bg-white text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 border-2 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow flex items-center justify-center gap-2"
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     Cancel Changes
//                   </button>
//                   <button
//                     onClick={handleSave}
//                     className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
//                     </svg>
//                     Save All Changes
//                   </button>
//                 </div>
                
//                 <div>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <button className="w-full bg-amber-100 text-amber-800 py-2.5 rounded-lg font-medium hover:bg-amber-200 transition-colors flex items-center justify-center gap-2">
//                         <span>Quick Actions</span>
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white shadow-lg border border-gray-300 rounded-xl">
//                       <DropdownMenuLabel className="text-gray-700 font-medium px-3 py-2">Quick Actions</DropdownMenuLabel>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem className="px-3 py-2 cursor-pointer hover:bg-gray-100">
//                         View Analytics
//                       </DropdownMenuItem>
//                       <DropdownMenuItem className="px-3 py-2 cursor-pointer hover:bg-gray-100">
//                         Manage Content
//                       </DropdownMenuItem>
//                       <DropdownMenuItem className="px-3 py-2 cursor-pointer hover:bg-gray-100">
//                         Student Reports
//                       </DropdownMenuItem>
//                       <DropdownMenuItem className="px-3 py-2 cursor-pointer hover:bg-gray-100">
//                         Upload Notes
//                       </DropdownMenuItem>
//                       <DropdownMenuItem className="px-3 py-2 cursor-pointer hover:bg-gray-100">
//                         View Uploaded Notes
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       {/* </div> */}
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import {
  Phone,
  GraduationCap,
  BookOpen,
  Users,
  ChevronDown,
  Check,
  Mail,
  Edit,
  Save,
  X,
  AlertCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { API_BASE } from "../../lib/api";

interface InputFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  type?: string;
  disabled?: boolean;
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
  disabled?: boolean;
}

export default function PrivateProfile() {
  const { user, token, refreshUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    profile_completed: false,
  });

  const [formData, setFormData] = useState({
    phone_number: "",
    qualification: "",
    experience: "",
    gender: "",
    subjects: [] as string[],
  });

  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [subjectError, setSubjectError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (user) {
      setUserData({
        username: user.username || "",
        email: user.email || "",
        profile_completed: user.profile_completed || false,
      });
    } else {
      const savedUser = localStorage.getItem("userData");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUserData({
            username: parsedUser.username || "",
            email: parsedUser.email || "",
            profile_completed: parsedUser.profile_completed || false,
          });
        } catch (error) {
          console.error("Error parsing saved user:", error);
        }
      }
    }
  }, [user]);
  console.log("User Data:", userData);
  console.log("Auth user:", user);

  const firstLetter = userData?.username?.charAt(0).toUpperCase() || "U";
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/faculty/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Profile API Response:", data);

      if (data?.data) {
        setProfileData(data.data);
        setFormData({
          phone_number: data.data.phone_number || "",
          qualification: data.data.qualification || "",
          experience: data.data.experience?.toString() || "",
          gender: data.data.gender || "",
          subjects: data.data.subjects || [],
        });
      }
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };
  const fetchSubjects = async () => {
    if (!token) return;
    
    setSubjectsLoading(true);
    setSubjectError("");

    try {
      const res = await fetch(`${API_BASE}/faculty/subjects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      console.log("Subjects API Response:", data);
      
      if (data?.data?.subjects && Array.isArray(data.data.subjects)) {
        setAvailableSubjects(data.data.subjects);
      } else if (data?.subjects && Array.isArray(data.subjects)) {
        setAvailableSubjects(data.subjects);
      } else {
        setSubjectError("No subjects available");
      }
    } catch (err: any) {
      console.error("Error fetching subjects:", err);
      setSubjectError("Failed to load subjects");
    } finally {
      setSubjectsLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      fetchProfileData();
      fetchSubjects();
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleDropdown = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleUpdateProfile = async () => {
    setIsSubmitting(true);

    // Validation
    if (
      !formData.phone_number ||
      !formData.qualification ||
      !formData.gender ||
      !formData.experience ||
      formData.subjects.length === 0
    ) {
      toast.error("All fields are mandatory");
      setIsSubmitting(false);
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

    console.log("Updating profile data:", payload);

    try {
      const res = await fetch(`${API_BASE}/faculty/profileupdate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Profile update failed");
      }
      await fetchProfileData();
      if (refreshUser) {
        await refreshUser();
      }

      toast.success("Profile updated successfully!");
      setEditMode(false);
      setShowConfirm(false);
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast.error(err.message || "Profile update failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Your Profile
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your profile information
            </p>
          </div>
          
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 
                text-primary hover:bg-primary/20 transition-all duration-200
                border border-primary/20"
            >
              <Edit className="w-4 h-4" />
              Update Profile
            </button>
          )}
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b border-border">
            <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground
              flex items-center justify-center text-3xl font-bold shadow-lg">
              {firstLetter}
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-foreground">
                {userData.username || "User"}
              </h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">
                  {userData.email || "No email available"}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                <Badge text="Faculty" color="primary" />
                <Badge text={profileData?.department || "Department"} color="secondary" />
                <Badge text={profileData?.designation || "Professor"} color="accent" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <ProfileField
              label="Phone Number"
              value={editMode ? undefined : profileData?.phone_number || "Not provided"}
              icon={<Phone className="w-4 h-4" />}
            >
              {editMode && (
                <InputField
                  id="phone_number"
                  label="Phone Number"
                  placeholder="9876543210"
                  value={formData.phone_number}
                  onChange={handleChange}
                  icon={<Phone className="w-4 h-4" />}
                />
              )}
            </ProfileField>
            <ProfileField
              label="Qualification"
              value={editMode ? undefined : profileData?.qualification || "Not provided"}
              icon={<GraduationCap className="w-4 h-4" />}
            >
              {editMode && (
                <InputField
                  id="qualification"
                  label="Qualification"
                  placeholder="MSc Physics, B.Ed"
                  value={formData.qualification}
                  onChange={handleChange}
                  icon={<GraduationCap className="w-4 h-4" />}
                />
              )}
            </ProfileField>
            <ProfileField
              label="Subjects"
              value={editMode ? undefined : 
                profileData?.subjects?.length > 0 
                  ? profileData.subjects.join(", ")
                  : "No subjects selected"
              }
              icon={<BookOpen className="w-4 h-4" />}
            >
              {editMode && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Subjects *</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {formData.subjects.length} selected
                    </span>
                  </label>

                  <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <div className="relative group">
                        <div className="relative">
                          <div className="w-full pl-5 pr-10 py-2.5 text-sm rounded-full
                            border border-muted bg-transparent outline-none
                            focus-within:border-primary focus-within:ring-1 focus-within:ring-ring
                            cursor-pointer hover:bg-muted/5 transition-all duration-200
                            min-h-[44px] flex items-center flex-wrap gap-1">
                            
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                              <BookOpen className="w-4 h-4" />
                            </div>

                            {formData.subjects.length === 0 ? (
                              <span className="text-muted-foreground pl-4">
                                Select subjects
                              </span>
                            ) : (
                              <div className="flex flex-wrap items-center gap-1 pl-4">
                                {formData.subjects.slice(0, 3).map((subject) => (
                                  <span
                                    key={subject}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full 
                                      text-xs bg-primary/10 text-primary border border-primary/20
                                      whitespace-nowrap"
                                  >
                                    <span className="capitalize">{subject}</span>
                                  </span>
                                ))}
                                {formData.subjects.length > 3 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{formData.subjects.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}

                            <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted 
                              transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </div>
                      </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-64 overflow-y-auto 
                        bg-background border border-muted rounded-xl shadow-lg p-2"
                      align="start"
                      sideOffset={4}
                    >
                      {subjectsLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <span className="ml-2 text-sm text-muted-foreground">Loading subjects...</span>
                        </div>
                      ) : subjectError ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-destructive">{subjectError}</p>
                        </div>
                      ) : availableSubjects.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground">No subjects available</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {availableSubjects.map((subject) => {
                            const isSelected = formData.subjects.includes(subject);
                            return (
                              <div
                                key={subject}
                                className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer
                                  transition-colors duration-150 ${isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                                onClick={() => toggleSubject(subject)}
                              >
                                <div className={`w-4 h-4 flex items-center justify-center rounded border
                                  ${isSelected ? 'bg-primary border-primary' : 'border-muted'}`}>
                                  {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                                </div>
                                <span className="text-sm text-foreground capitalize flex-1">
                                  {subject}
                                </span>
                                {isSelected && (
                                  <span className="text-xs text-primary font-medium">✓</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {formData.subjects.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-muted">
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, subjects: [] }))}
                            className="w-full text-xs text-destructive hover:text-destructive/80 
                              py-1.5 px-2 rounded hover:bg-destructive/5 transition-colors"
                          >
                            Clear all selections
                          </button>
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {formData.subjects.length === 0 && (
                    <p className="text-xs text-destructive mt-1">
                      Please select at least one subject
                    </p>
                  )}
                </div>
              )}
            </ProfileField>
            <ProfileField
              label="Experience (Years)"
              value={editMode ? undefined : profileData?.experience || "Not provided"}
              icon={<BookOpen className="w-4 h-4" />}
            >
              {editMode && (
                <InputField
                  id="experience"
                  label="Experience (Years)"
                  placeholder="5"
                  value={formData.experience}
                  onChange={handleChange}
                  icon={<BookOpen className="w-4 h-4" />}
                  type="number"
                />
              )}
            </ProfileField>
            <ProfileField
              label="Gender"
              value={editMode ? undefined : profileData?.gender || "Not provided"}
              icon={<Users className="w-4 h-4" />}
            >
              {editMode && (
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
              )}
            </ProfileField>
          </div>
          {editMode && (
            <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-border">
              <button
                onClick={() => {
                  setEditMode(false);
                  // Reset form to original data
                  setFormData({
                    phone_number: profileData?.phone_number || "",
                    qualification: profileData?.qualification || "",
                    experience: profileData?.experience?.toString() || "",
                    gender: profileData?.gender || "",
                    subjects: profileData?.subjects || [],
                  });
                }}
                className="flex-1 px-4 py-3 rounded-full border border-muted 
                  text-foreground hover:bg-muted/10 transition-all duration-200
                  flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              
              <button
                onClick={() => setShowConfirm(true)}
                disabled={isSubmitting || formData.subjects.length === 0}
                className="flex-1 px-4 py-3 rounded-full bg-primary text-primary-foreground 
                  font-semibold hover:opacity-90 transition-all duration-200 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Profile
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Confirm Update</h3>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Are you sure you want to update your profile information? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-3 rounded-full border border-muted 
                  text-foreground hover:bg-muted/10 transition-all duration-200"
              >
                Cancel
              </button>
              
              <button
                onClick={handleUpdateProfile}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 rounded-full bg-primary text-primary-foreground 
                  font-semibold hover:opacity-90 transition-all duration-200 
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Confirm Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function ProfileField({ 
  label, 
  value, 
  icon, 
  children 
}: { 
  label: string; 
  value?: string; 
  icon: ReactNode;
  children?: ReactNode;
}) {
  if (children) {
    return <div className="space-y-2">{children}</div>;
  }

  return (
    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/5 transition-colors">
      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
        <span className="text-primary">{icon}</span>
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-muted-foreground mb-1">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}
function Badge({ text, color = "primary" }: { text: string; color?: "primary" | "secondary" | "accent" }) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    accent: "bg-accent/10 text-accent-foreground border-accent/20",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClasses[color]}`}>
      {text}
    </span>
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
  disabled = false,
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs font-semibold text-foreground">
        {label}
      </label>

      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-muted group-focus-within:text-primary transition-colors duration-200">
            {icon}
          </span>
        </div>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full pl-10 pr-3 py-2.5 text-sm rounded-full
          bg-transparent border border-muted outline-none
          focus:border-primary focus:ring-1 focus:ring-ring 
          text-foreground disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200"
        />
      </div>
    </div>
  );
}
function DropdownBlock({
  label,
  current,
  icon,
  onSelect,
  options,
  disabled = false,
}: DropdownBlockProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-foreground">
        {label}
      </label>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className="
              relative w-full pl-10 pr-10 py-2.5 rounded-full
              text-left text-sm
              bg-transparent border border-muted
              outline-none transition-all duration-200
              focus:border-primary focus:ring-1 focus:ring-ring
              hover:bg-muted/5
              disabled:opacity-50 disabled:cursor-not-allowed
              group
            "
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-muted group-focus-within:text-primary transition-colors duration-200">
                {icon}
              </span>
            </div>

            <span className={current.startsWith("Select") ? "text-muted-foreground" : "text-foreground"}>
              {current}
            </span>

            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-4 h-4" />
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-[var(--radix-dropdown-menu-trigger-width)] bg-background 
            border border-muted rounded-xl shadow-lg p-1"
          align="start"
          sideOffset={4}
        >
          {options.map((o) => (
            <div
              key={o.value}
              onClick={() => {
                onSelect(o.value);
                setIsOpen(false);
              }}
              className="
                cursor-pointer px-3 py-2 rounded-lg text-sm text-foreground
                hover:bg-primary/10 transition-colors duration-150
              "
            >
              {o.label}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}