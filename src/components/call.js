"use client";
import { motion } from "framer-motion";

export const CallOption = ({ onAccept, onDecline, user }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg p-6 w-96 shadow-xl text-center"
      >
        <h3 className="text-xl font-semibold mb-4">Do you want to call {user}?</h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={onDecline}
            className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
          >
            No
          </button>
          <button
            onClick={onAccept}
            className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
          >
            Yes
          </button>
        </div>
      </motion.div>
    </div>
  );
};
