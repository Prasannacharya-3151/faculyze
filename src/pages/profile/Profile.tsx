import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export default function Profile() {
  const [profileData, setProfileData] = useState({
    fullName: "Dr. Rajesh Kumar",
    collegeEmail: "rajesh.kumar@college.edu",
    phoneNumber: "+91 9876543210",
    gender: "Male",
    rolePosition: "Senior Faculty",
    department: "Physics Department",
    pucHandling: "Both 1st & 2nd PUC",
    qualification: "M.Sc Physics, Ph.D, B.Ed",
    experience: "12 years",
    shortBio: "Physics faculty with 12+ years experience in teaching PUC students. Specialized in Quantum Mechanics and Thermodynamics.",
    currentPassword: "••••••••",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  const handleSave = () => {
    console.log("Saving profile:", profileData);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    alert("Changes discarded");
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h1>
      
      <div className="bg-white p-8 rounded-3xl border border-gray-200">
        <div className="w-full flex gap-8">

          <div className="w-1/2 flex flex-col gap-8">
            
     
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">Basic Information</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">College Email (non-editable) *</label>
                  <input
                    type="email"
                    name="collegeEmail"
                    value={profileData.collegeEmail}
                    readOnly
                    className="w-full rounded-xl bg-gray-100 p-3 border border-gray-300 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">College email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

           
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 text-left transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <div className="flex justify-between items-center">
                          <span>{profileData.gender}</span>
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white shadow-lg border border-gray-300">
                      <DropdownMenuLabel className="text-gray-700 font-medium">Select Gender</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleSelectChange('gender', 'Male')}>
                        Male
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSelectChange('gender', 'Female')}>
                        Female
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSelectChange('gender', 'Other')}>
                        Other
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSelectChange('gender', 'Prefer not to say')}>
                        Prefer not to say
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role/Position *</label>
                  <input
                    type="text"
                    name="rolePosition"
                    value={profileData.rolePosition}
                    onChange={handleInputChange}
                    className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <input
                    type="text"
                    name="department"
                    value={profileData.department}
                    onChange={handleInputChange}
                    className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Card */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">Password</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password *</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={profileData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={profileData.newPassword}
                    onChange={handleInputChange}
                    className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={profileData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/2 flex flex-col gap-8">
            
         
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">Academic Details</h3>
              
              <div className="space-y-5">
               
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PUC Handling *</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 text-left transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <div className="flex justify-between items-center">
                          <span>{profileData.pucHandling}</span>
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white shadow-lg border border-gray-300">
                      <DropdownMenuLabel className="text-gray-700 font-medium">Select PUC Handling</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleSelectChange('pucHandling', '1st PUC')}>
                        1st PUC
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSelectChange('pucHandling', '2nd PUC')}>
                        2nd PUC
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSelectChange('pucHandling', 'Both 1st & 2nd PUC')}>
                        Both 1st & 2nd PUC
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

           
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualification *</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 text-left transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <div className="flex justify-between items-center">
                          <span>{profileData.qualification || "Select Qualification"}</span>
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white shadow-lg border border-gray-300">
                      <DropdownMenuLabel className="text-gray-700 font-medium">Select Qualification</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleSelectChange('qualification', 'M.Sc Physics, B.Ed')}>
                        M.Sc Physics, B.Ed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSelectChange('qualification', 'M.Sc Physics, Ph.D, B.Ed')}>
                        M.Sc Physics, Ph.D, B.Ed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSelectChange('qualification', 'Ph.D Physics, M.Ed')}>
                        Ph.D Physics, M.Ed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSelectChange('qualification', 'M.Sc, M.Phil, B.Ed')}>
                        M.Sc, M.Phil, B.Ed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

               
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years) *</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 text-left transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <div className="flex justify-between items-center">
                          <span>{profileData.experience || "Select Experience"}</span>
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white shadow-lg border border-gray-300">
                      <DropdownMenuLabel className="text-gray-700 font-medium">Select Experience</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleSelectChange('experience', '1-2 years')}>
                        1-2 years
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSelectChange('experience', '3-5 years')}>
                        3-5 years
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSelectChange('experience', '5-10 years')}>
                        5-10 years
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSelectChange('experience', '10+ years')}>
                        10+ years
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSelectChange('experience', '15+ years')}>
                        15+ years
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSelectChange('experience', '20+ years')}>
                        20+ years
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Short Bio *</label>
                  <textarea
                    name="shortBio"
                    value={profileData.shortBio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded-xl bg-gray-50 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Brief about your teaching experience, specialization, etc."
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">{profileData.shortBio.length}/500 characters</p>
                </div>
              </div>
            </div>

           
            <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl border border-amber-200 shadow-md">
              <div className="text-center mb-10">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-3xl font-bold text-white">P</span>
                </div>
                <h1 className="text-5xl font-bold text-amber-900 mb-2">Physics</h1>
                <p className="text-amber-700 text-lg">Department Dashboard</p>
              </div>

          
              <div className="space-y-6">
                <div className="flex gap-6">
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-white text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 border-2 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow flex items-center justify-center gap-3 text-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Cancel Changes
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-3 text-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save All Changes
                  </button>
                </div>
                
              
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full bg-amber-100 text-amber-800 py-3 rounded-lg font-medium hover:bg-amber-200 transition-colors flex items-center justify-center gap-2">
                        <span>Quick Actions</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white shadow-lg border border-gray-300">
                      <DropdownMenuLabel className="text-gray-700 font-medium">Quick Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        Manage Content
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        Student Reports
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        Upload Notes
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        View Uploaded Notes
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Empty Space to match layout */}
            <div className="flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}