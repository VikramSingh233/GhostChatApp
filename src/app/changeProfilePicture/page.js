"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const isBlobUrl = (url) => url?.startsWith("blob:") || false;

export default function ProfilePage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const router = useRouter();
  // Fetch user profile picture
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/api/getme");
        setImage(response.data.user.ProfilePicture || "/default-profile.png"); // Fallback image
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Cleanup old previews
  useEffect(() => {
    return () => {
      [preview, image].forEach((url) => {
        if (isBlobUrl(url)) URL.revokeObjectURL(url);
      });
    };
  }, [preview, image]);

  const handleImageChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview((prev) => {
        if (isBlobUrl(prev)) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const { data } = await axios.get(`/api/getme`);
      const mobileNumber = data.user.MobileNumber;

      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data", MobileNumber: mobileNumber },
      });

      if (response.data.ProfilePicture) {
        setImage(response.data.ProfilePicture);
        setPreview(null);
        setSelectedFile(null);
      }
      router.push("/home");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }, [selectedFile]);

  const handleCancel = useCallback(() => {
    setPreview((prev) => {
      if (isBlobUrl(prev)) URL.revokeObjectURL(prev);
      return null;
    });
    setSelectedFile(null);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 hover:shadow-3xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Profile Settings</h1>

        <div className="relative group mb-8">
          <div className="relative w-40 h-30 mx-auto rounded-full border-4 border-gray-400 shadow-xl transition-transform duration-300 hover:scale-105">
          <Image 
  src={preview || image || "/default-profile.png"}  // Ensures valid src
  alt="Profile Preview"
  width={153} 
  height={140} 
  className="rounded-full object-cover"
  unoptimized={isBlobUrl(preview || image)}
  priority
/>
            <div
              className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="text-white text-sm font-medium">Change Photo</span>
            </div>
          </div>

          <label
            htmlFor="profile-upload"
            className="absolute -right-2 -bottom-2 bg-purple-600 p-3 rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:bg-purple-700 hover:scale-110"
            aria-label="Upload profile picture"
          >
            <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            <CameraIcon />
          </label>
        </div>

        {preview && (
          <div className="flex gap-4 justify-center animate-fade-in">
            <button
              onClick={handleUpload}
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 hover:bg-gray-200 hover:scale-105"
            >
              Cancel
            </button>
          </div>
        )}

        {!preview && (
          <p className="text-center text-gray-500 text-sm mt-4">
            Click the camera icon to upload a new profile photo
          </p>
        )}
      </div>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
