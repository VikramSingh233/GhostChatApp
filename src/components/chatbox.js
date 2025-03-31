"use client";
import { useState, useEffect, useRef, use } from "react";
import { io } from "socket.io-client";
import Image from "next/image";
import UserPopupMenu from "./userpopup";
import { CallOption } from "./call";
import { SettingOption } from "./userSetting";
import { BlockOption } from "./block";
import { PollOption } from "./poll";
import axios from "axios";
import MessageBox from "./messagebox";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ChatDeletePopup from "./chatDelete";

export default function ChatBox({ user, currentUser, handleClick ,conversationmessages }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(conversationmessages);
  const socketRef = useRef(null);
  const [showAttachmentPopup, setShowAttachmentPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showBlock, setShowBlock] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [messagebox, setMessagebox] = useState("");
  const [showmessagebox, setShowMessageBox] = useState(false);
  const [counter,setcounter] = useState(0);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setMessages(conversationmessages);
  }, [conversationmessages,message]);
// console.log("conversationmessages",conversationmessages);
  const handleBlockConfirm = async () => {
    try {
      const response = await axios.post("/api/blockuser", { user, currentUser });


      setShowMessageBox(true);
      setMessagebox(response.data.message);
      setShowBlock(false);
    } catch (error) {
      setShowMessageBox(true);
      setMessagebox(error.response?.data?.message || "An error occurred");
    }
  };
  const now = new Date();
  const time = now.toISOString();
  // Poll Option Handlers
  const handlePollSubmit = async (data) => {
    const response = await axios.post("/api/createpoll", { user, currentUser, data, time });
    setShowMessageBox(true);
    setMessagebox(response.data.message);
  };

  // Call Option Handlers
  const handleAcceptCall = () => {
    console.log("Call accepted");
    setShowCall(false);
  };


  const handleSettingsSave = (settings) => {
    console.log("Settings saved:", settings);
  };

  const handleDelete = async () => {
    if (!user || !currentUser) {
      toast.error("User data is missing!");
      return;
    }

    try {
      const response = await axios.post("/api/deleteNumber", { user, currentUser });
      setShowMessageBox(true);
      setMessagebox(response.data.message);

      setShowDelete(false);
    } catch (error) {

      setShowMessageBox(true);
      setMessagebox(error.response?.data?.message || "Failed to delete number");
    }
  };

  // Add these new handlers
  const handleAttachmentClick = () => {
    setShowAttachmentPopup(true);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("currentUser", JSON.stringify(currentUser)); // Convert objects to JSON strings
      formData.append("user", JSON.stringify(user));

      const response = await axios.post("/api/uploadmessageimage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(response.data.url)
      inputRef.current.value = selectedFile.name;



      setShowAttachmentPopup(false);

    }
  };



  useEffect(() => {
    if (!socketRef.current) {
      fetch("/api/socket").then(() => {
        const newSocket = io("https://ghostchat-eight.vercel.app/", {
          transports: ["websocket"],
          reconnection: true,
        });

        socketRef.current = newSocket;

        newSocket.on("connect", () => {
          console.log("✅ Connected to server:", newSocket.id);
        });

        newSocket.on("receiveMessage", (msg) => {
          console.log("📩 Received:", msg);
          setMessages((prev) => [...prev, msg]);
        });

        newSocket.on("disconnect", () => {
          console.log("❌ Disconnected, trying to reconnect...");
        });

        return () => {
          newSocket.disconnect();
          socketRef.current = null;
        };
      });
    }
  }, []);
  const sendMessage = async () => {
    if (!socketRef.current || !socketRef.current.connected) {
      console.error(" Cannot send message, socket is disconnected.");
      return;
    }

    if (message.trim() === "") return;

    const messageData = {
      text: message,
      timestamp: new Date().toISOString(),
      receiver: user.MobileNumber,
      sender: currentUser,
    };

    console.log("Sending:", messageData);

    try {
      const response = await axios.post("/api/sendmessage", { messageData });
      console.log("Response:", response.data);

      if (response.data.message === "Message sent successfully") {
        socketRef.current.emit("sendMessage", messageData); // Emit only after successful API response
        setMessage(""); // Clear input field after sending
      } else {
        setShowMessageBox(true);
        setMessagebox(response.data.message);
      }
    } catch (error) {
      console.error(" Error sending message:", error);
      setShowMessageBox(true);
      setMessagebox("Failed to send message.");
    }
  };
  const handleImageClick = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl, { mode: "cors" }); // Ensure CORS is allowed
      const blob = await response.blob(); // Convert response to blob
      const blobUrl = URL.createObjectURL(blob); // Create local URL
  
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${user.Name}${counter}image.jpg`; // Set file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setcounter(counter + 1);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };
  


  return (

    <div className="flex flex-col h-full  shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      {showmessagebox && <MessageBox message={messagebox} type="success" />}

      {showAttachmentPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Send File</h3>
              <button
                onClick={() => {
                  setShowAttachmentPopup(false);
                  setSelectedFile(null);
                }}
                className="text-gray-500 bg-gray-100 w-10 hover:text-red-700 hover:bg-gray-100 transition-all duration-300 "
              >
                ✕
              </button>
            </div>

            <label className="block mb-4">
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,application/pdf"
              />
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-gray-600 text-sm">
                  {selectedFile ? selectedFile.name : "Click to select file"}
                </span>
              </div>
            </label>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAttachmentPopup(false);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 transition-all duration-300 text-gray-600 hover:text-gray-800 bg-slate-50 hover:bg-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg ${!selectedFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
      {/* button for removing the chatbox */}


      <div className="bg-gray-800 p-4 border-b border-gray-500 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleClick}
            className=" rounded-lg w-10 h-10 hover:bg-gray-800 bg-gray-800 flex items-center justify-center"
          >
            <ArrowLeft className="text-white h-14 -ml-5" />
          </button>
          <div className="relative h-16 w-16">
            <Image
              src={user.ProfilePicture}
              alt="Profile"
              fill
              className="rounded-full object-cover border-2 border-blue-100"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{user.Name}</h2>
            <span className="text-sm text-white">{user.MobileNumber}</span>
          </div>
        </div>

        <UserPopupMenu
          onBlock={() => setShowBlock(true)}
          onPoll={() => setShowPoll(true)}
          // onCall={() => setShowCall(true)} 
          onSettings={() => setShowSetting(true)}
          onDelete={() => setShowDelete(true)}
        />
        {/* Block User Popup */}
        {showBlock && (
          <BlockOption
            onConfirm={handleBlockConfirm}
            onCancel={() => setShowBlock(false)}
          />
        )}

        {/* Create Poll Popup */}
        {showPoll && (
          <PollOption
            onSubmit={handlePollSubmit}
            onClose={() => setShowPoll(false)}
          />
        )}

        {/* Incoming Call Popup */}
        {/* {showCall && (
        <CallOption user={user.Name}
          onAccept={handleAcceptCall}
          onDecline={() => setShowCall(false)}
        />
      )} */}

        {/* Settings Popup */}
        {showSetting && (
          <SettingOption user={user}
            onSave={handleSettingsSave}
            onClose={() => setShowSetting(false)}
          />
        )}
        {showDelete && (
          <ChatDeletePopup name={user.Name}
            onConfirmDelete={handleDelete}
            onClose={() => setShowDelete(false)}
          />
        )}


      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-200 space-y-4">
        {messages
          .filter(msg =>
            (msg.sender === currentUser && msg.receiver === user.MobileNumber) ||
            (msg.sender === user.MobileNumber && msg.receiver === currentUser)
          )
          .map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === user.MobileNumber ? "justify-start" : "justify-end"}`}
            >
              <div className={` text-white px-4 py-2 rounded-lg max-w-xs ${msg.sender === user.MobileNumber ? "bg-cyan-600" : "bg-gray-800"}`}>
                <strong>{msg.receiver === user.MobileNumber ? " " : " "}</strong> {msg.text.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                  <Image
                    onClick={() => handleImageClick(msg.text)}
                    src={msg.text}
                    alt="Sent Image"
                    width={200} // Set a reasonable size
                    height={200}
                    className="rounded-lg shadow-md"
                  />
                  
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2">
          {/* image attachment  */}

          <svg
            onClick={handleAttachmentClick}
            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-blue-600 transition-colors"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5l-5.378 5.378a4 4 0 01-5.657-5.657l6.086-6.086a4 4 0 015.657 5.657L10.5 16.5a2 2 0 01-2.828-2.828l5.672-5.672" />
          </svg>





          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            ref={inputRef}
            onChange={(e) => setMessage(e.target.value)}
            className=" w-4/5 flex-1 px-4 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className=" w-1/5 px-4 py-2 bg-gray-900 text-white border-gray-300 border-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}


