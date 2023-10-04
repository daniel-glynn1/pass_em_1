import { Socket } from "socket.io-client";
import { ClientEvents } from "../shared/types/clientEvents";
import { ServerEvents } from "../shared/types/serverEvents";
import { ServerPayloads } from "../shared/types/serverPayloads";
import { SocketExceptions } from "../shared/types/socketExceptions";

class GameService {
  public async createGameRoom(socket: Socket, roomId: string, userName: string, numPlayers: number): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit(ClientEvents.LobbyCreate, { roomId: roomId, userName: userName, numPlayers: numPlayers });
      socket.on(ServerEvents.LobbyCreated, () => {
        rs(true);
      });
      socket.on(SocketExceptions.LobbyError, ({ error }) => rj(error));
    });
  }

  public async joinGameRoom(socket: Socket, roomId: string, userName: string): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit(ClientEvents.LobbyJoin, { roomId: roomId, userName: userName });
      socket.on(ServerEvents.LobbyJoined, () => {
        rs(true);
      });
      socket.on(SocketExceptions.LobbyError, ({ error }) => rj(error));
    });
  }

  public async updateGame(socket: Socket, choice: string){
    socket.emit(ClientEvents.GameUpdate, { choice: choice });
  }

  public async onGameUpdate(socket: Socket, listener: (data: ServerPayloads[ServerEvents.LobbyState]) => void) {
    socket.on(ServerEvents.LobbyState, ( data ) => {
      listener(data);
    });
  }

  public async onGameMessage(socket: Socket, listener: (data: ServerPayloads[ServerEvents.GameMessage]) => void) {
    socket.on(ServerEvents.GameMessage, ( data ) => {
      listener(data);
    });
  }


  public async onStartGame(socket: Socket, listener: () => void) {
    socket.on(ServerEvents.GameStarted, listener);
  }

}


export default new GameService();