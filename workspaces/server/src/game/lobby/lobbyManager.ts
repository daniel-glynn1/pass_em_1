import { Lobby } from '../../game/lobby/lobby';
import { Server } from 'socket.io';
import { SocketExceptions } from '../../../../shared/types/socketExceptions';
import { AuthenticatedSocket } from '../../game/types';

export class LobbyManager
{
  public server: Server;

  private readonly lobbies: Map<string, Lobby> = new Map<string, Lobby>();

  public initializeSocket(client: AuthenticatedSocket): void
  {
    client.data.lobby = null;
  }

  public terminateSocket(client: AuthenticatedSocket): void
  {
    client.data.lobby?.removeClient(client);

    // remove lobby if game has ended
    if (client.data.lobby.gameState.isFinished) {
      this.deleteLobby(client.data.lobby.name);
    }
  }

  public createLobby(lobbyName: string, client: AuthenticatedSocket, maxClients: number): Lobby | null
  {
    const prevLobby = this.lobbies.get(lobbyName);

    if (prevLobby) {
      client.emit(SocketExceptions.LobbyError, {
        error: "That lobby already exists!"
      });
      return null;
    }

    const lobby = new Lobby(this.server, lobbyName, maxClients);
    this.lobbies.set(lobbyName, lobby);

    console.log("lobby created: ", lobbyName);

    return lobby;
  }

  public joinLobby(lobbyName: string, client: AuthenticatedSocket, userName: string): void
  {
    const lobby = this.lobbies.get(lobbyName);

    if (!lobby) {
      client.emit(SocketExceptions.LobbyError, {
        error: "Lobby not found"
      });
      return;
    }

    if (lobby.clients.size >= lobby.maxClients) {
      client.emit(SocketExceptions.LobbyError, {
        error: "Lobby is full"
      });
      return;
    }

    if (lobby.gameState.isFinished) {
      client.emit(SocketExceptions.LobbyError, {
        error: "Lobby is full"
      });
      return;
    }

    lobby.addClient(client, userName);
  }

  public deleteLobby(lobbyName: string): void {
    this.lobbies.delete(lobbyName);
  }
  
}