import { Server } from "socket.io";
import { NextResponse } from "next/server";

const PORT = process.env.PORT || 8080;
if (!global.io) {
  console.log("🔧 Initializing Socket.io...");
  global.io = new Server(PORT, {
    cors: { 
      origin: "https://ghostchat-eight.vercel.app", // Allow only your domain
      methods: ["GET", "POST"],
      credentials: true,
    },
    allowEIO3: true
  });
  global.io.on("connection", (socket) => {
    console.log("🔗 A user connected:", socket.id);

    socket.on("sendMessage", (messageData) => {
      console.log("📩 New message received:", messageData);
      global.io.emit("receiveMessage", messageData); // Broadcast to all clients
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ User disconnected:", socket.id, "Reason:",reason);
    });
  });
} else {
  console.log("✅ Socket.io is already running");
}

export const GET = async () => {
  return new NextResponse("Socket initialized", { status: 200 });
};
