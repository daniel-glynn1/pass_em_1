import { ConnectedSocket, OnConnect, OnDisconnect, OnMessage, MessageBody, SocketController, SocketIO } from "socket-controllers";
import { Socket, Server } from "socket.io";
//import { io } from "../../server";
import { AuthenticatedSocket } from "../../game/types";

import { LobbyManager } from "../../game/lobby/lobbyManager";
import { ServerEvents } from "../../../../shared/types/serverEvents";
import { SocketExceptions } from '../../../../shared/types/socketExceptions';
import { ClientEvents } from "../../../../shared/types/clientEvents";



@SocketController()
export class MainController {
  constructor(
    private readonly lobbyManager: LobbyManager,
  )
  {
    console.log("MainController has been constructed");
    this.lobbyManager = new LobbyManager();
  }

  @OnConnect()
  public onConnection(@ConnectedSocket() client: Socket, @SocketIO() io: Server) {
    console.log("New socket connected: ", client.id);

    if (!this.lobbyManager.server) {
      this.lobbyManager.server = io;
      console.log("lobbymanager server has been set");
    }
    
    this.lobbyManager.initializeSocket(client as AuthenticatedSocket);

  }

  @OnDisconnect()
  public onDisconnection(@ConnectedSocket() client: AuthenticatedSocket, @SocketIO() io: Server) {
    console.log("Socket disconnected: ", client.id);

    this.lobbyManager.terminateSocket(client);
  }

  @OnMessage(ClientEvents.LobbyCreate)
  public async createLobby(@SocketIO() io: Server, @ConnectedSocket() client: AuthenticatedSocket, @MessageBody() message: any) {
    console.log(client.id, " is creating lobby with name: ", message.roomId);

    const lobby = this.lobbyManager.createLobby(message.roomId, client, message.numPlayers, message.finalScore, message.isRebuttal);

    if (!lobby) {
      return;
    }
    
    lobby.addClient(client, message.userName);

    client.emit(ServerEvents.LobbyCreated);

  }

  @OnMessage(ClientEvents.LobbyJoin)
  public async joinLobby(@SocketIO() io: Server, @ConnectedSocket() client: AuthenticatedSocket, @MessageBody() message: any) {
    console.log(client.id, " is joining lobby with name: ", message.roomId);

    this.lobbyManager.joinLobby(message.roomId, client, message.userName);

    client.emit(ServerEvents.LobbyJoined);
  }

  @OnMessage(ClientEvents.LobbyLeave)
  public async leaveLobby(@SocketIO() io: Server, @ConnectedSocket() client: AuthenticatedSocket, @MessageBody() message: any) {
    console.log("User leaving room: ", client.id);
    this.lobbyManager.terminateSocket(client);

    client.emit(ServerEvents.LobbyLeft);
  }

  @OnMessage(ClientEvents.GameStartEarly)
  public async startGameEarly(@SocketIO() io: Server, @ConnectedSocket() client: AuthenticatedSocket, @MessageBody() message: any) {
    console.log(client.id, " is early starting lobby");

    if (!client.data.lobby) {
      client.emit(SocketExceptions.LobbyError, {
        error: "You are not in a lobby!"
      });
    }
    client.data.lobby?.startGameEarly(client);
  }

  @OnMessage(ClientEvents.GameRestart)
  public async restartGame(@SocketIO() io: Server, @ConnectedSocket() client: AuthenticatedSocket, @MessageBody() message: any) {
    console.log(client.id, " is restarting game");

    if (!client.data.lobby) {
      client.emit(SocketExceptions.LobbyError, {
        error: "You are not in a lobby!"
      });
    }

    client.data.lobby?.restartGame(client);
  }

  @OnMessage(ClientEvents.GameChatMessage)
  public async gameChatMessage(@SocketIO() io: Server, @ConnectedSocket() client: AuthenticatedSocket, @MessageBody() message: any) {
    if (!client.data.lobby) {
      client.emit(SocketExceptions.LobbyError, {
        error: "You are not in a lobby!"
      });
    }
    client.data.lobby?.sendChatMessage(message);
  }

  @OnMessage(ClientEvents.GameUpdate)
  public async gameUpdate(@SocketIO() io: Server, @ConnectedSocket() client: AuthenticatedSocket, @MessageBody() message: any) {
    if (!client.data.lobby) {
      client.emit(SocketExceptions.LobbyError, {
        error: "You are not in a lobby!"
      });
    }

    if (message.choice === 'pass') {
      client.data.lobby.gameState.passPigs(client);
    } else if (message.choice === 'roll') {
      client.data.lobby.gameState.rollPigs(client);
    }
  }


}

