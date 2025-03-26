"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function ThreedotPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const response = await axios.post("/api/logout");
    if (response.data.message === "Logged out successfully") {
      router.push("/login");
    }
  };

  const ProfilePage = () => {
    router.push("/changeProfilePicture");
  };

  return (
    <div className="relative flex justify-center items-center">
      {/* Three-Dot Popup */}
      <motion.ul
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-10 right-1 z-50 w-36 bg-gray-900 rounded-lg shadow-xl flex flex-col gap-2 p-2"
      >
        <li
          className="text-white text-md text-center font-semibold hover:bg-gray-800 rounded p-2 cursor-pointer"
          onClick={ProfilePage}
        >
          Profile Picture
        </li>
        <li
          className="text-white text-md text-center font-semibold hover:bg-gray-800 rounded p-2 cursor-pointer"
          onClick={() => router.push("/account")}
        >
          Account
        </li>
        <li
          className="text-white text-sm text-center font-semibold hover:bg-gray-800 rounded p-2 cursor-pointer"
          onClick={() => router.push("/blockedNumbers")}
        >
          Blocked Contact
        </li>
        <li
          className="text-white text-sm text-center font-semibold hover:bg-gray-800 rounded p-2 cursor-pointer"
          onClick={() => router.push("/help")}
        >
          Help
        </li>
        <li
          className="text-red-500 text-md text-center font-semibold hover:bg-gray-800 rounded p-2 cursor-pointer"
          onClick={() => setShowConfirm(true)}
        >
          Logout
        </li>
      </motion.ul>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-xl text-center w-80"
            >
              <h2 className="text-lg font-semibold mb-4 text-black">
                Are you sure you want to logout?
              </h2>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleLogout}
                >
                  Yes
                </button>
                <button
                  className="bg-gray-300 text-gray-900 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setShowConfirm(false)}
                >
                  No
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
