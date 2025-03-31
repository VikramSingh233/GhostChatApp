"use client";
import { useState, useEffect, useRef } from "react";
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

export default function ChatBoxMobile({ user, currentUser, handleClick, conversationmessages }) {
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
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setMessages(conversationmessages);
  }, [conversationmessages]);

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

  const handlePollSubmit = async (data) => {
    const response = await axios.post("/api/createpoll", { 
      user, 
      currentUser, 
      data, 
      time: new Date().toISOString() 
    });
    setShowMessageBox(true);
    setMessagebox(response.data.message);
  };

  const handleDelete = async () => {
    if (!user || !currentUser) return;
    
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
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
  const SOCKET_SERVER_URL = "https://websocketserver-production-60c7.up.railway.app";

  useEffect(() => {
    if (!socketRef.current) {
      let isMounted = true; // ✅ Prevent duplicate execution
  
      fetch("/api/socket").then(() => {
        if (!isMounted) return;
  
        const newSocket = io(SOCKET_SERVER_URL, {
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });
  
        socketRef.current = newSocket;
  
        newSocket.on("connect", () => {
          console.log("✅ Connected:", newSocket.id);
        });
  
        newSocket.on("receiveMessage", (msg) => {
          console.log("📩 Received:", msg);
          setMessages((prev) => [...prev, msg]);
        });
  
        newSocket.on("disconnect", () => {
          console.log("❌ Disconnected, trying to reconnect...");
        });
  
      });
  
      return () => {
        isMounted = false; // ✅ Fix double execution
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
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
    <div className="flex flex-col  h-[90vh] bg-white">
      {/* Header */}
      {showmessagebox && <MessageBox message={messagebox} type="success" />}
      <div className="bg-gray-800 p-3 border-b  border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleClick}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="text-white h-6 w-6" />
          </button>
          <div className="relative h-12 w-12">
            <Image
              src={user.ProfilePicture}
              alt="Profile"
              fill
              className="rounded-full object-cover border-2 border-blue-200"
            />
          </div>
          <div className="ml-2">
            <h2 className="text-base font-semibold text-white truncate max-w-[150px]">
              {user.Name}
            </h2>
            <span className="text-xs text-gray-300">{user.MobileNumber}</span>
          </div>
        </div>
        
        <UserPopupMenu
          onBlock={() => setShowBlock(true)}
          onPoll={() => setShowPoll(true)}
          onSettings={() => setShowSetting(true)}
          onDelete={() => setShowDelete(true)}
        />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 bg-gray-100 space-y-2">
        {messages.filter(msg => 
          (msg.sender === currentUser && msg.receiver === user.MobileNumber) ||
          (msg.sender === user.MobileNumber && msg.receiver === currentUser)
        ).map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === user.MobileNumber ? "justify-start" : "justify-end"}`}
          >
            <div className={`text-sm px-3 py-1 flex flex-col  rounded-xl max-w-[85%] ${
              msg.sender === user.MobileNumber 
                ? "bg-white text-gray-900 border border-gray-300"
                : "bg-gray-700 text-white"
            }`}>
              {msg.text.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                <div className="relative max-w-[50vw] max-h-[50vh]">
                  <Image
                    onClick={() => handleImageClick(msg.text)}
                    src={msg.text}
                    alt="Sent content"
                    fill
                    className="rounded-lg object-cover active:opacity-75"
                  />
                </div>
              ) : (
                <p className="break-words max-w-[80%] flex flex-col">{msg.text}</p>
              )}
            
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-2 h-[1vh] bg-white border-t border-gray-200">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowAttachmentPopup(true)}
            className="p-2 text-gray-600 hover:text-blue-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 ml-1"
          >
            <svg  onClick={sendMessage} className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modals */}
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

      {showmessagebox && (
        <MessageBox 
          message={messagebox} 
          onClose={() => setShowMessageBox(false)}
        />
      )}

      {showBlock && (
        <BlockOption
          onConfirm={handleBlockConfirm}
          onCancel={() => setShowBlock(false)}
        />
      )}

      {showPoll && (
        <PollOption
          onSubmit={handlePollSubmit}
          onClose={() => setShowPoll(false)}
        />
      )}

      {showDelete && (
        <ChatDeletePopup
          name={user.Name}
          onConfirmDelete={handleDelete}
          onClose={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}