import { useSocketServer } from "socket-controllers";
import { Server } from "socket.io";

export default (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });


  useSocketServer(io, { controllers: [__dirname + "/api/controllers/*.ts"] });

  return io;
};