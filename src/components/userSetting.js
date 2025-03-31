"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const SettingOption = ({ onClose, onSave, user }) => {


  const handleSubmit = () => {
    onSave({ isImportant });
    onClose();
  };
  const downloadImage = async (user) => {
    try {
      const response = await fetch(user.ProfilePicture, { mode: "cors" });
      console.log("response", response);
      const blob = await response.blob();
  
      console.log("blob", blob);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${user.Name}_profilePicture.jpg`;
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg p-6 w-96 shadow-xl"
        >
          <h3 className="text-xl font-semibold mb-4">Download Profile Picture</h3>

          <div className="space-y-4 mb-6">
        

            <div className="flex items-center justify-around gap-4 text-center font-bold">
              <span>Profile Picture</span>
              <button onClick={() => downloadImage(user)} className="bg-gray-800 hover:bg-gray-900 h-10 p-1 w-auto px-2">
                Download
              </button>
            </div>

          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
