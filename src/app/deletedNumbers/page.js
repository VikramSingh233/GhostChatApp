"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiArrowLeft, FiPlus, FiCheck } from "react-icons/fi";
import axios from "axios";

const DeletedNumbersManager = () => {

  const [deletedNumbers, setDeletedNumbers] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState(new Set());
  const [curruser, setCurruser] = useState(null);

  useEffect(() => {
    const fetchDeletedNumbers = async () => {
      try {
        const response = await axios.get("/api/getme");
        setDeletedNumbers(response.data.user.RecentlyDeletedNumbers || []);
        setCurruser(response.data.user.MobileNumber);
      } catch (error) {
        console.error("Error fetching deleted numbers:", error);
      }
    };
    fetchDeletedNumbers();
  }, []);

  const handleGoBack = () => window.history.back();

  const toggleSelection = (number) => {
    setSelectedNumbers((prev) => {
      const newSet = new Set(prev);
      newSet.has(number) ? newSet.delete(number) : newSet.add(number);
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    setSelectedNumbers((prev) =>
      prev.size === deletedNumbers.length ? new Set() : new Set(deletedNumbers)
    );
  };

  const handleAddSelected =async () => {
    if (selectedNumbers.size > 0) {
 
    const selectedNumbersArray = Array.from(selectedNumbers);
    
    const response = await axios.post("/api/removeDeletedNumbers", {
      selectedNumbers: selectedNumbersArray,
      curruser
    });
   
    if (response.data.message === "Numbers removed successfully") {
      setDeletedNumbers((prev) =>
        prev.filter((number) => !selectedNumbers.has(number))
      );
      setSelectedNumbers(new Set());
      toast.success(`Added ${selectedNumbers.size} numbers successfully!`);
    } else {
        toast.success(`Something went wrong! Please try again later.`);
    }

    } else {
      toast.warning("No numbers selected!");
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-start">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <button onClick={handleGoBack} className="text-gray-600 w-24 bg-white hover:bg-gray-50 hover:text-gray-800 flex items-center">
            <FiArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800 mr-[35%]">Deleted Numbers</h1>

        </div>

        <div className="flex justify-between items-center mb-4 bg-blue-50 p-4 rounded-lg">
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" checked={selectedNumbers.size === deletedNumbers.length} onChange={toggleSelectAll} className="h-5 w-5 text-blue-600 border-gray-300 rounded" />
            <span className="ml-2">Select All</span>
          </label>
          <button onClick={handleAddSelected} className="bg-gray-600 w-64 flex justify-center items-center text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            <FiCheck className="mr-2" /> Add Selected ({selectedNumbers.size})
          </button>
        </div>

        <div className="space-y-2">
          {deletedNumbers.map((number, index) => (
            <div key={index} className={`flex justify-between items-center p-3 bg-gray-50 rounded-lg ${selectedNumbers.has(number) ? "bg-blue-100" : ""}`}>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" checked={selectedNumbers.has(number)} onChange={() => toggleSelection(number)} className="h-5 w-5 text-blue-600 border-gray-300 rounded" />
                <span className="ml-3 font-mono text-gray-700">{number}</span>
              </label>
            </div>
          ))}
        </div>
      </div>



      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default DeletedNumbersManager;
