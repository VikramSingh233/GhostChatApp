import { Server } from "socket.io";
import { NextResponse } from "next/server";

if (!global.io) {
  console.log("🔧 Initializing Socket.io...");

  global.io = new Server(3001, {
    cors: { origin: "*" },
    allowEIO3: true, // Ensure compatibility with older clients
  });

  global.io.on("connection", (socket) => {
    console.log("🔗 A user connected:", socket.id);

    socket.on("sendMessage", (messageData) => {
      console.log("📩 New message received:", messageData);
      global.io.emit("receiveMessage", messageData); // Broadcast to all clients
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
} else {
  console.log("✅ Socket.io is already running");
}

export const GET = async () => {
  return new NextResponse("Socket initialized", { status: 200 });
};
