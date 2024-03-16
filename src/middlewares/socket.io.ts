import { Server as SocketIOServer, Socket } from "socket.io";
import  User from "../models/user.model";

class SocketManager {
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupSocketEvents();
  }

  private setupSocketEvents(): void {
    this.io.on("connection", async (socket) => {
      console.log("Connected to socket.io");
      const user_id = socket.handshake.query["userId"]
      if (user_id !== null && Boolean(user_id)) {
        try {
          await User.findByIdAndUpdate(user_id, {
            status: "Online",
          });
        } catch (error) {
          console.log(error);
        }
      }

      socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
      });

      socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
      });

      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

      socket.on("start voice chat", (room) => {
        socket.in(room).emit("voice chat started", "Voice Chat");
      });

      socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users not defined");
        // @ts-ignore
        chat.users.forEach((user) => {
          if (user._id == newMessageReceived.sender._id) return;

          socket.in(user._id).emit("message received", newMessageReceived);
        });
      });

      socket.on("disconnect", async () => {
        if (user_id) {
          try {
            await User.findByIdAndUpdate(user_id, {
              status: "Offline",
            });
          } catch (error) {
            console.log(error);
          }
        }
        console.log("User Disconnected");
      });
    });
  }

  public emitUserConnected(userId: any): void {
    this.io.emit("user-connected", userId);
  }
}

export default SocketManager;
