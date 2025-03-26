"use client";
import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import { useRouter } from "next/navigation";
import axios from "axios";

const AccountSettings = () => {
  const [user, setUser] = useState({ Name: "", MobileNumber: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/api/getme");
        setUser({
          MobileNumber: response.data.user.MobileNumber,
          Name: response.data.user.Name,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (type) => {
    setLoading(true);
    setErrors({});
    setSuccess("");
    
    try {
      const response = await axios.post(`/api/update${type}`, user);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
    } catch (error) {
      setErrors({ [type]: `Failed to update ${type}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="pb-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="mt-2 text-sm text-gray-600">Manage your account information and security</p>
          </div>

          {/* Name Section */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                <p className="mt-1 text-sm text-gray-500">Update your name and contact details</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="Name"
                    id="name"
                    value={user.Name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSubmit("Name")}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
                {errors.Name && <p className="text-red-600 text-sm mt-2">{errors.Name}</p>}
              </div>
            </div>
          </div>

          {/* Mobile Number Section */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="MobileNumber"
                    id="mobile"
                    value={user.MobileNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSubmit("MobileNumber")}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
                {errors.MobileNumber && <p className="text-red-600 text-sm mt-2">{errors.MobileNumber}</p>}
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Password</h3>
                {/* <p className="mt-1 text-sm text-gray-500">Update your password regularly for security</p> */}
              </div>
              <button
                onClick={() => router.push("/changepassword")}
                className="inline-flex items-center px-4 py-2 border border-gray-500 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 justify-center w-3/5 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Change Password
              </button>
            </div>
          </div>

          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;