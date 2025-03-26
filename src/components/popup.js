"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Popup({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-56 h-32 bg-gray-900 rounded-lg p-4 flex flex-col justify-center items-center shadow-xl"
      >
        <p className="text-white text-sm text-center font-semibold">
          {message}
        </p>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}

