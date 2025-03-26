"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Popup from "@/components/popup";
import ThreedotPopup from "@/components/threedotPopup";
import { DeleteNotification } from "@/components/deletenotification";
import Image from "next/image";
import ChatBox from "@/components/chatbox";
import { useRouter } from "next/navigation";
import { set } from "mongoose";
import { Trash } from "lucide-react";
import MessageBox from "@/components/messagebox";
export default function ChatApp() {
  const [addnumber, setAddnumber] = useState("");
  const [users, setUsers] = useState([]);
  const [settingpopup, setSettingpopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selecteduser, setSelectedUser] = useState(null);
  const [curruser, setCurruser] = useState(null);
  const [shownotification, setshowNotification] = useState(false);
  const [showDeleteNotification, setshowDeleteNotification] = useState(false);
  const [messagebox, setMessagebox] = useState("");
  const [showmessagebox, setShowMessageBox] = useState(false);
  const [notification , setNotification] = useState([]);
  const router = useRouter();

  const showNotification = () => {
    setshowNotification(!shownotification);
    setSettingpopup(false);
  };

  if(shownotification){
    // fetch all the notification and store it into the notification array 
    // use aggregation pipeline to get all the notifications
  }
 const handleDeleteNotification= ()=>{
  // delete the notification
  
 }

 const handleArrowLeftClick = () => {
   setSelectedUser(null);
 }
  useEffect(() => {
    const checkDevice = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  useEffect(() => {
    const fetchSavedUsers = async () => {
      try {
        const response = await axios.get("/api/getme");
        console.log("Fetched user data:", response.data); 

        if (!response.data || !response.data.user) {
          setMessagebox("User not found");
          return;
        }
        setCurruser(response.data.user.MobileNumber);
        const numbers = response.data.user.AddedNumbers || [];

        if (numbers.length === 0) {
          console.log("No saved numbers.");
          return;
        }

        const allSavedUser = await axios.post("/api/getalluserdetails", {
          AllmobileNumbers: numbers,
        });

        setUsers(allSavedUser.data.users);
      } catch (error) {
        
        setMessagebox("Error fetching saved users");
      }
    };

    fetchSavedUsers();
  }, []);

  const AddNewNumber = async (number) => {
    if (!number.trim()) {
      // alert("Please enter a mobile number");
      setMessagebox("Please enter a mobile number");
      return;
    }

    try {
      const userid = await axios.get(`/api/getme`);
      const mobileNumber = userid.data.user.MobileNumber;

      const response = await axios.post("/api/checkExistanceregister", {
        MobileNumber: number,
      });

      if (response.data.message === "User exists") {
        const res = await axios.post("/api/savecontact", {
          MobileNumber: mobileNumber,
          NewMobileNumber: number,
        });

        if (res.data.error) {
          setMessagebox(res.data.error);
          setShowMessageBox(true);
          return;
        }
        else{
          setMessagebox(res.data.message);
          setShowMessageBox(true);
        }

        // ✅ Fetch updated user data after adding new contact
        const updatedUser = await axios.get(`/api/getme`);
        const SavedMobileNumberArray = updatedUser.data.user.AddedNumbers;

        const allSavedUser = await axios.post("/api/getalluserdetails", {
          AllmobileNumbers: SavedMobileNumberArray,
        });

        setUsers(allSavedUser.data.users); // ✅ Update users list immediately
        setAddnumber(""); // ✅ Clear input field
      } else {
        setPopupMessage("User not using this service");
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error checking number", error);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">

      {showmessagebox && (
        <MessageBox message={messagebox} onClose={() => setShowMessageBox(false)} />
      )}
      {showPopup && (
        <Popup message={popupMessage} onClose={() => setShowPopup(false)} />
      )}

      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-4 shadow-lg flex justify-between items-center">
        <h1 className="text-xl font-semibold tracking-tight">ConvoNest</h1>
        <div className="relative flex gap-2">
          <svg
            onClick={() => showNotification()}
            className="w-6 h-6 text-white cursor-pointer"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405C17.52 14.555 17 13.3 17 12V8a5 5 0 00-10 0v4c0 1.3-.52 2.555-1.595 3.595L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
            />
          </svg>
          {shownotification && (
            <div className="md:w-[25vw] w-[100vw] h-[91vh] overflow-y-auto bg-zinc-100 absolute top-11 -right-4 md:-right-6 z-50 transition duration-1000 ease-in-out">
              <div className=" h-10 text-black bg-zinc-300 text-start font-serif font-bold text-lg flex items-center justify-between ">
                <div className="flex justify-center items-center gap-2">
                <svg
                  className=" ml-5 w-8 h-8 text-black "
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405C17.52 14.555 17 13.3 17 12V8a5 5 0 00-10 0v4c0 1.3-.52 2.555-1.595 3.595L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
                  />
                </svg>
                Notifications
                </div>
              <Trash onClick={()=>{
                setshowDeleteNotification(!showDeleteNotification)
              }} className="text-red-900 mr-5 cursor-pointer hover:text-red-700" size={20} />
              </div>
              {/* notifications.map((notification) => (
                
              )) */}
              
            </div>
          )}
          <Image
            onClick={() => setSettingpopup(!settingpopup)}
            className="invert opacity-1 hover:opacity-100 transition-opacity cursor-pointer"
            src={"https://www.svgrepo.com/show/345223/three-dots-vertical.svg"}
            alt="Settings"
            width={24}
            height={24}
          />
          {settingpopup && <ThreedotPopup />}
        </div>
      </div>
          {showDeleteNotification && (
                  <DeleteNotification
                    onSubmit={handleDeleteNotification}
                    onClose={() => setshowDeleteNotification(false)}
                  />
                )}
      <div className="flex flex-1 overflow-hidden">
        {/* Contacts Sidebar */}
        <div className="w-full md:w-[300px] bg-white/90 border-r border-slate-300 flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add contact number"
                value={addnumber}
                onChange={(e) => setAddnumber(e.target.value)}
                className="w-full px-4 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button
                onClick={() => AddNewNumber(addnumber)}
                className="px-0 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors "
              >
                Add Contact
              </button>
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {users.map((user, index) => (
              <div
                key={index}
                onClick={() => {
                  if (isMobile) {
                    router.push(`/user/${user.MobileNumber}`);
                  } else {
                    setSelectedUser(user);
                  }
                }}
                className="flex items-center  p-2 hover:bg-slate-100 cursor-pointer transition-colors border-b border-slate-300"
              >
                <div className="relative w-16 h-16 mr-3">
                  <Image
                    src={user.ProfilePicture}
                    alt={`${user.Name}'s profile`}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold -mt-1 text-slate-900">{user.Name}</p>
                  {/* <p className="text-sm text-slate-500">{user.MobileNumber}</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className=" hidden flex-1 md:flex flex-col bg-white">
          {selecteduser && curruser ? (
            <ChatBox user={selecteduser} currentUser={curruser} handleClick={()=>handleArrowLeftClick()} />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center text-slate-400">
                <p className="text-lg">
                  Select a conversation to start chatting
                </p>
                <p className="text-sm mt-2">
                  Your secure messages will appear here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
