'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";

const BlockedContacts = () => {
    const [blockedContacts, setBlockedContacts] = useState([]);  // Stores full user details
    const [selectedContacts, setSelectedContacts] = useState(new Set());
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlockedContacts = async () => {
            try {
                const userResponse = await axios.get("/api/getme");
                const mobileNumber = userResponse.data.user.MobileNumber;
                console.log("mobileNumber:", mobileNumber);

                // Fetch blocked numbers
                const response = await axios.post("/api/blockedContacts", { MobileNumber: mobileNumber });
                    // console.log("responce" , response.data.blockedNumbers);
                    console.log(Array.isArray(response.data.blockedNumbers));
                    const AllmobileNumbers = response.data.blockedNumbers;
                    // console.log("blockedNumbbers", AllmobileNumbers);
                if (AllmobileNumbers && AllmobileNumbers.length > 0)
                    {
                    const alldetails = await axios.post("/api/getalluserdetails", { AllmobileNumbers});
                    // console.log("alldetails", alldetails);
                    // console.log("Blocked Users:", alldetails.data.users);
                    setBlockedContacts(alldetails.data.users); // Store full details
                } else {
                    setError("There is no block contact");
                    setBlockedContacts([]);
                }
            } catch (err) {
                console.error("Error fetching contacts:", err);
                setError("Something went wrong. Try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlockedContacts();
    }, []);

    // Handle checkbox selection
    const handleCheckboxChange = (mobileNumber) => {
        setSelectedContacts((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(mobileNumber)) {
                newSet.delete(mobileNumber);
            } else {
                newSet.add(mobileNumber);
            }
            
            return newSet;
        });
    };

    // Handle unblocking selected contacts
    const handleUnblock = async () => {
        if (selectedContacts.size === 0) {
            setMessage("No contacts selected.");
            setMessageType("error");
            return;
        }

        try {
            const userResponse = await axios.get("/api/getme");
            const mobileNumber = userResponse.data.user.MobileNumber;
            const response = await axios.post("/api/unblockContacts", {
                contacts: Array.from(selectedContacts),mobileNumber
            });

            setMessage(response.data.message);
            setMessageType("success");

            // Remove unblocked contacts from the UI
            setBlockedContacts((prev) => prev.filter(contact => !selectedContacts.has(contact.mobileNumber)));
            setSelectedContacts(new Set());
        } catch (err) {
            console.error("Error unblocking contacts:", err);
            setMessage("Failed to unblock contacts.");
            setMessageType("error");
        }
    };

    if (loading) return <p>Loading blocked contacts...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Blocked Contacts</h2>

            {/* Message Box */}
            {message && (
                <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {messageType === "success" ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                    <span>{message}</span>
                </div>
            )}

            {/* Contacts Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3 text-left">Select</th>
                            <th className="p-3 text-left">Profile</th>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Mobile Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blockedContacts.length > 0 ? (
                            blockedContacts.map((user) => (
                                <tr key={user.MobileNumber} className="border-t">
                                    <td className="p-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedContacts.has(user.MobileNumber)}
                                            onChange={() => handleCheckboxChange(user.MobileNumber)}
                                            className="w-5 h-5 text-blue-500"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <img src={user.ProfilePicture} alt={user.Name} className="w-14 h-14 rounded-full" />
                                    </td>
                                    <td className="p-3">{user.Name}</td>
                                    <td className="p-3">{user.MobileNumber}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-3 text-center text-gray-500">No blocked contacts.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Unblock Button */}
            <button
                onClick={handleUnblock}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Unblock Selected
            </button>
        </div>
    );
};

export default BlockedContacts;
