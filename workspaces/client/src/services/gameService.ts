import { Socket } from "socket.io-client";
import { ClientEvents } from "../shared/types/clientEvents";
import { ServerEvents } from "../shared/types/serverEvents";
import { ServerPayloads } from "../shared/types/serverPayloads";
import { SocketExceptions } from "../shared/types/socketExceptions";

class GameService {
  // join/create
  public async createGameRoom(socket: Socket, roomId: string, roomPassword: string, userName: string, numPlayers: number, finalScore: number, isRebuttal: boolean): Promise<boolean> {
    return new Promise((rs, rj) => {
      const handleLobbyCreated = () => {
        rs(true);
        socket.off(ServerEvents.LobbyCreated, handleLobbyCreated);
        socket.off(SocketExceptions.LobbyError, handleLobbyError);
      };
  
      const handleLobbyError = ({ error }) => {
        rj(error);
        socket.off(ServerEvents.LobbyCreated, handleLobbyCreated);
        socket.off(SocketExceptions.LobbyError, handleLobbyError);
      };
  
      socket.emit(ClientEvents.LobbyCreate, { roomId: roomId, roomPassword: roomPassword, userName: userName, numPlayers: numPlayers, finalScore: finalScore, isRebuttal: isRebuttal });
  
      socket.on(ServerEvents.LobbyCreated, handleLobbyCreated);
      socket.on(SocketExceptions.LobbyError, handleLobbyError);
   
    });
  }

  public async joinGameRoom(socket: Socket, roomId: string, roomPassword: string, userName: string): Promise<boolean> {
    return new Promise((rs, rj) => {
      const handleLobbyJoined = () => {
        rs(true);
        socket.off(ServerEvents.LobbyJoined, handleLobbyJoined);
        socket.off(SocketExceptions.LobbyError, handleLobbyError);
      };
  
      const handleLobbyError = ({ error }) => {
        rj(error);
        socket.off(ServerEvents.LobbyJoined, handleLobbyJoined);
        socket.off(SocketExceptions.LobbyError, handleLobbyError);
      };
  
      socket.emit(ClientEvents.LobbyJoin, { roomId: roomId, roomPassword: roomPassword, userName: userName });
  
      socket.on(ServerEvents.LobbyJoined, handleLobbyJoined);
      socket.on(SocketExceptions.LobbyError, handleLobbyError);
    });
  }

  public async joinRandomGameRoom(socket: Socket, userName: string): Promise<boolean> {
    return new Promise((rs, rj) => {
      const handleLobbyJoined = () => {
        rs(true);
        socket.off(ServerEvents.LobbyJoined, handleLobbyJoined);
        socket.off(SocketExceptions.LobbyError, handleLobbyError);
      };
  
      const handleLobbyError = ({ error }) => {
        rj(error);
        socket.off(ServerEvents.LobbyJoined, handleLobbyJoined);
        socket.off(SocketExceptions.LobbyError, handleLobbyError);
      };
  
      socket.emit(ClientEvents.LobbyJoinRandom, { userName: userName });
  
      socket.on(ServerEvents.LobbyJoined, handleLobbyJoined);
      socket.on(SocketExceptions.LobbyError, handleLobbyError);
    });
  }

  public async leaveGameRoom(socket: Socket): Promise<boolean> {
    return new Promise((rs, rj) => {
      const handleLobbyLeft = () => {
        rs(true);
        socket.off(ServerEvents.LobbyLeft, handleLobbyLeft);
        socket.off(SocketExceptions.LobbyError, handleLobbyError);
      };
  
      const handleLobbyError = ({ error }) => {
        rj(error);
        socket.off(ServerEvents.LobbyLeft, handleLobbyLeft);
        socket.off(SocketExceptions.LobbyError, handleLobbyError);
      };
  
      socket.emit(ClientEvents.LobbyLeave);
  
      socket.on(ServerEvents.LobbyLeft, handleLobbyLeft);
      socket.on(SocketExceptions.LobbyError, handleLobbyError);
    });
  }  
  

  // messages sent to server
  public async updateGame(socket: Socket, choice: string) {
    socket.emit(ClientEvents.GameUpdate, { choice: choice });
  }

  public async startGameEarly(socket: Socket) {
    socket.emit(ClientEvents.GameStartEarly);
  }

  public async restartGame(socket: Socket) {
    socket.emit(ClientEvents.GameRestart);
  }

  public async sendChatMessage(socket: Socket, message: string, senderName: string, senderCode: number) {
    let chatMessage: ServerPayloads[ServerEvents.GameMessage] = {
      message: message,
      senderName: senderName,
      senderCode: senderCode,
    }
    socket.emit(ClientEvents.GameChatMessage, chatMessage);
  }

  

  // messages from server
  public async onGameUpdate(socket: Socket, listener: (data: ServerPayloads[ServerEvents.LobbyState]) => void) {
    socket.on(ServerEvents.LobbyState, ( data ) => {
      listener(data);
    });
  }
  public async offGameUpdate(socket: Socket, listener: (data: ServerPayloads[ServerEvents.LobbyState]) => void) {
    socket.off(ServerEvents.LobbyState, listener);
  }

  public async onGameMessage(socket: Socket, listener: (data: ServerPayloads[ServerEvents.GameMessage]) => void) {
    socket.on(ServerEvents.GameMessage, ( data ) => {
      listener(data);
    });
  }
  public async offGameMessage(socket: Socket, listener: (data: ServerPayloads[ServerEvents.GameMessage]) => void) {
    socket.off(ServerEvents.GameMessage, ( data ) => {
      listener(data);
    });
  }

  public async onStartRoll(socket: Socket, listener: () => void) {
    socket.on(ServerEvents.GameStartRoll, () => {
      listener();
    });
  }
  public async offStartRoll(socket: Socket, listener: () => void) {
    socket.off(ServerEvents.GameStartRoll, listener);
  }

}


export default new GameService();