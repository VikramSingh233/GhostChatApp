"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

export const PollOption = ({ onSubmit, onClose }) => {
    const [message, setMessage] = useState('');
  
    const handleSubmit = () => {
      onSubmit({ message });
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg p-6 w-96 shadow-xl"
        >
          <h3 className="text-xl font-semibold mb-4">Create Poll</h3>
          <input
            type="text"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 mb-4 border rounded-lg"
          />
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
              Send Poll
            </button>
          </div>
        </motion.div>
      </div>
    );
};
