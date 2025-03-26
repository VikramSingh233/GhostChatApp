"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Phone, Ban, BarChart, Settings, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserPopupMenu({ onBlock, onPoll, onSettings, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative bg-gray-800" ref={menuRef}>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-gray-800 hover:bg-gray-800 transition"
      >
        <MoreVertical className="w-5 h-5 text-white" />
      </button>

      {/* Popup Menu with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50"
          >
            <button
              onClick={() => { onBlock(); setIsOpen(false); }}
              className="flex items-center bg-gray-800 w-full px-4 py-2 text-sm text-white hover:bg-gray-600"
            >
              <Ban className="w-5 h-5 mr-2" /> Block
            </button>
            <button
              onClick={() => { onPoll(); setIsOpen(false); }}
              className="flex items-center bg-gray-800 w-full px-4 py-2 text-sm text-white hover:bg-gray-600"
            >
              <BarChart className="w-5 h-5 mr-2" /> Poll
            </button>
            {/* <button
              onClick={() => { onCall(); setIsOpen(false); }}
              className="flex items-center bg-gray-800 w-full px-4 py-2 text-sm text-white hover:bg-gray-600"
            >
              <Phone className="w-5 h-5 mr-2" /> Call
            </button> */}
            <button
              onClick={() => { onDelete(); setIsOpen(false); }}
              className="flex items-center bg-gray-800 w-full px-4 py-2 text-sm text-white hover:bg-gray-600"
            >
              <Trash className="w-5 h-5 mr-2" /> Delete
            </button>
            <button
              onClick={() => { onSettings(); setIsOpen(false); }}
              className="flex items-center bg-gray-800 w-full px-4 py-2 text-sm text-white hover:bg-gray-600 rounded-b-lg"
            >
              <Settings className="w-5 h-5 mr-2" /> Settings
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
