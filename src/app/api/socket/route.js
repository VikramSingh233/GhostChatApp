import { Server } from "socket.io";
import { NextResponse } from "next/server";

if (!global.io) {
  console.log("🔧 Initializing Socket.io...");
  global.io = new Server(3001, {
    cors: { 
      origin: ["https://ghostchat-eight.vercel.app/"], // Update with your domain
      methods: ["GET", "POST"]
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
