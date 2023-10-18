import { Lobby } from '../../game/lobby/lobby';
import { Server } from 'socket.io';
import { SocketExceptions } from '../../../../shared/types/socketExceptions';
import { AuthenticatedSocket } from '../../game/types';

export class LobbyManager
{
  public server: Server;

  private readonly lobbies: Map<string, Lobby> = new Map<string, Lobby>();
  private currentRandomLobby: Lobby | null = null;
  private numRandomLobbies: number = 0;

  public initializeSocket(client: AuthenticatedSocket): void
  {
    client.data.lobby = null;
  }

  public terminateSocket(client: AuthenticatedSocket): void
  {
    client.data.lobby?.removeClient(client);
    
    // remove lobby if everyone has left
    if (client.data.lobby.clients.size === 0) {
      console.log("deleting lobby...")
      this.deleteLobby(client.data.lobby.name);
    }

    client.data.lobby = null;
  }

  public createLobby(lobbyName: string, lobbyPassword: string, client: AuthenticatedSocket, maxClients: number, finalScore: number, isRebuttal: boolean): Lobby | null
  {
    const prevLobby = this.lobbies.get(lobbyName);

    if (prevLobby) {
      client.emit(SocketExceptions.LobbyError, {
        error: "That lobby already exists!"
      });
      return null;
    }

    const lobby = new Lobby(this.server, lobbyName, lobbyPassword, maxClients, finalScore);
    this.lobbies.set(lobbyName, lobby);

    lobby.gameState.isRebuttal = isRebuttal;
    lobby.gameState.creatorId = client.id;

    console.log("lobby created: ", lobbyName);

    return lobby;
  }

  public joinLobby(lobbyName: string, lobbyPassword: string, client: AuthenticatedSocket, userName: string): void
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

    if (lobbyPassword !== lobby.password) {
      client.emit(SocketExceptions.LobbyError, {
        error: "Incorrect name/password"
      });
      return;
    }

    lobby.addClient(client, userName);
  }

  public joinRandomLobby(client: AuthenticatedSocket, userName: string): void {
    // if lobby already exists and has space, join it
    if (this.currentRandomLobby && this.currentRandomLobby.clients.size < this.currentRandomLobby.maxClients) {
      this.currentRandomLobby.addClient(client, userName);
      return;
    } 
    
    // otherwise, create a new lobby and join it
    this.currentRandomLobby = this.createRandomLobby(client, userName);

    this.currentRandomLobby!.addClient(client, userName);

  }

  public deleteLobby(lobbyName: string): void {
    if (lobbyName === this.currentRandomLobby?.name) {
      this.currentRandomLobby = null;
    }
    this.lobbies.delete(lobbyName);
  }

  public createRandomLobby(client: AuthenticatedSocket, userName: string): Lobby | null {
    // (random lobbies are 4 player, to 100 points, and with rebuttal on)

    const lobbyName = "random_" + this.numRandomLobbies;
    const lobby = new Lobby(this.server, lobbyName, '', 4, 100);

    this.lobbies.set(lobbyName, lobby);

    lobby.gameState.isRebuttal = true;
    lobby.gameState.creatorId = client.id;

    console.log("lobby created: ", lobbyName);

    this.numRandomLobbies++;

    return lobby;
  }

  
}


