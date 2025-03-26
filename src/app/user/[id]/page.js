"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Paperclip } from "lucide-react";
import { ImageIcon, FileText, Camera, File, Music, MapPin } from "lucide-react";

export default function UserChat() {
  const params = useParams();
  const router = useRouter();
  const chatEndRef = useRef(null);

  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});
  const [showAttachments, setShowAttachments] = useState(false);
  const fileInputRef = useRef(null);

  const icons = [
    { name: "image", Icon: ImageIcon, accept: "image/*" },
    { name: "document", Icon: FileText, accept: ".pdf,.doc,.docx,.txt" },
    { name: "camera", Icon: Camera, accept: "image/*" },
    { name: "file", Icon: File, accept: "*/*" },
    { name: "audio", Icon: Music, accept: "audio/*" },
 
  ];

  useEffect(() => {
    if (params.id) {
      setId(params.id);
      axios
        .post("/api/checkExistanceregister", { MobileNumber: params.id })
        .then((response) => {
          setUser(response.data.data);
        })
        .catch((error) => console.error("User not found", error));
    }
  }, [params]);

  // ✅ Connect to Socket.IO
  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = io("http://localhost:3000", {
      path: "/api/socket",
      transports: ["websocket"],
    });

    socketRef.current.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => socketRef.current.disconnect();
  }, []);

  // ✅ Handle Sending Message
  const sendMessage = () => {
    if (message.trim()) {
      socketRef.current.emit("message", {
        sender: user.name,
        message: message,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "You", message: message },
      ]);
      setMessage("");
    }
  };

  // ✅ Handle File Selection
  const handleFileSelect = (acceptType) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptType; // Set allowed file types
      fileInputRef.current.click();
    }
  };

  // ✅ Handle File Change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected File:", file);
      // You can now upload or process the file
    }
  };

  return (
    <div className="flex flex-col h-[93vh] bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex items-center border-b border-gray-200">
        <button 
          onClick={() => router.push("/")}
          className="hover:bg-gray-100 rounded-lg w-10 h-10 bg-white flex items-center justify-center"
        >
          <ArrowLeft className="text-black w-6 h-6 -ml-10" />
        </button>
        <div className="flex items-center space-x-4">
          <img 
            src={user.ProfilePicture || "https://via.placeholder.com/40"} 
            className="w-10 h-10 rounded-full object-cover"
            alt="Profile"
          />
          <div>
            <h2 className="font-semibold text-gray-900">{user.Name}</h2>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div 
            key={index}
            className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-xl p-4 rounded-2xl ${
                msg.sender === "You" 
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white shadow-sm rounded-bl-none"
              }`}
            >
              <p className="text-sm font-medium">{msg.sender}</p>
              <p className="mt-1 text-sm">{msg.message}</p>
              <p className="mt-2 text-xs opacity-70">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Message Input Area */}
      <footer className="bg-white border-t border-gray-200 p-4 relative">
        {/* Attachments Popup */}
        {showAttachments && (
          <div className="absolute bottom-full left-4 mb-2 bg-white rounded-lg shadow-lg p-4 w-64 z-50">
            <div className="grid grid-cols-3 gap-3">
              {icons.map(({ name, Icon, accept }) => (
                <button
                  key={name}
                  onClick={() => handleFileSelect(accept)}
                  className="p-3 hover:bg-gray-50 bg-white rounded-lg flex flex-col items-center"
                >
                  <Icon className="w-6 h-6 mb-1 text-gray-700" />
                  <span className="text-xs text-gray-600 capitalize">{name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowAttachments(!showAttachments)}
            className="p-2 hover:bg-gray-100 rounded-full bg-white w-[5vw] -ml-2 mr-2"
          >
            <Paperclip className="text-black" size={20} />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 w-[85vw] p-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          
          <button 
            onClick={sendMessage}
            className="p-3 w-[15vw] bg-gray-900 text-white rounded-2xl hover:bg-gray-900 transition-colors"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}
