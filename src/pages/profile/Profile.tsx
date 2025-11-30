import React, { useState } from "react";

export default function Profile() {
  const [profileData, setProfileData] = useState({
    fullName: "Pradeep Nayak Physics",
    college: "College Emotion Institute", 
    phoneNumber: "+91 9876543210",
    date: "2024/05/06",
    website: "http://www.baerawar.com",
    email: "https://www.baerawar.com",
    qualification: "Q1/Accum",
    experience: "10+ years",
    coursePassword: "••••••••",
    nonDelivered: "Non-Delivered",
    certifiedPassword: "Certified Password"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    console.log("Saving profile:", profileData);
    alert("Profile saved successfully!");
  };

  const handleCancel = () => {
    alert("Changes discarded");
  };

  return (
    <div className="bg-white p-6 rounded-4xl border border-gray-300 mt-6">
    <div className="w-full h-full flex gap-8 p-6">
      {/* LEFT COLUMN */}
      <div className="w-1/2 flex flex-col gap-6">
        
        {/* Header */}
        {/* <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Pradeep Nayak Physics</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mt-2">Pradeep Nayak Physics</h2>
        </div> */}

        {/* Basic Information Card */}
        <div className="">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleChange}
                className="w-full rounded-xl bg-gray-100 p-3 border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">College Emotion Institute</label>
              <input
                type="text"
                name="college"
                value={profileData.college}
                onChange={handleChange}
                className="w-full rounded-xl bg-gray-100 p-3 border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleChange}
                className="w-full rounded-xl bg-gray-100 p-3 border border-gray-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date: 2024/05/06</label>
                <input
                  type="text"
                  name="date"
                  value={profileData.date}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-gray-100 p-3 border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mail: http://www.baerawar.com</label>
                <input
                  type="url"
                  name="website"
                  value={profileData.website}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-gray-100 p-3 border border-gray-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email: https://www.baerawar.com</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="w-full rounded-xl bg-gray-100 p-3 border border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Academic Details Card */}
        <div className="">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Academic Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
              <input
                type="text"
                value={profileData.fullName}
                readOnly
                className="w-full rounded-xl bg-gray-100 p-3 border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Q1/Accum</label>
              <input
                type="text"
                name="qualification"
                value={profileData.qualification}
                onChange={handleChange}
                className="w-full rounded-xl bg-gray-100 p-3 border border-gray-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email: https://www.baerawar.com</label>
                <input
                  type="text"
                  className="w-full rounded-xl bg-gray-100 p-3 border border-gray-300"
                  placeholder="Email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email: https://www.baerawar.com</label>
                <input
                  type="text"
                  className="w-full rounded-xl bg-gray-100 p-3 border border-gray-300"
                  placeholder="Email"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-1/2 flex flex-col gap-6">
        
        {/* Basic Information Card (Right Side) */}
        <div className="">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Password</label>
              <input
                type="password"
                name="coursePassword"
                value={profileData.coursePassword}
                onChange={handleChange}
                className="w-full rounded-xl bg-gray-100 p-3 border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Non-Delivered</label>
              <input
                type="text"
                name="nonDelivered"
                value={profileData.nonDelivered}
                onChange={handleChange}
                className="w-full rounded-xl bg-gray-100 p-3 border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Certified Password</label>
              <input
                type="password"
                name="certifiedPassword"
                value={profileData.certifiedPassword}
                onChange={handleChange}
                className="w-full rounded-xl bg-gray-100 p-3 border border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="">
          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Empty Space to match layout */}
        <div className="flex-1"></div>
      </div>
    </div>
    </div>
  );
}