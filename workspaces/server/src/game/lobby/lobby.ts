import { v4 } from 'uuid';
import { Server, Socket } from 'socket.io';
import { ServerEvents } from '../../../../shared/types/serverEvents';
import { GameState } from '../../game/gameState';
import { ServerPayloads } from '../../../../shared/types/serverPayloads';
import { SocketExceptions } from '../../../../shared/types/socketExceptions';
import { Player } from '../../../../shared/types/player';
import { AuthenticatedSocket } from '../../game/types';


export class Lobby
{
  public readonly id: string = v4();

  public readonly createdAt: Date = new Date();

  public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<Socket['id'], AuthenticatedSocket>();

  public readonly gameState: GameState = new GameState(this);

  constructor(
    private readonly server: Server,
    public readonly name: string,
    public readonly password: string,
    public maxClients: number,
    public readonly finalScore: number,

  )
  {
  }

  public addClient(client: AuthenticatedSocket, userName: string): void
  {
    this.clients.set(client.id, client);
    client.join(this.id);
    client.data.lobby = this;
    client.data.userName = userName;

    const newPlayer: Player = {
      name: userName,
      score: 0
    };
    this.gameState.scores[client.id] = newPlayer;

    this.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
      senderCode: 100,
      senderName: '',
      message: client.data.userName + ' joined the game',
    });

    if (this.clients.size >= this.maxClients) {
      this.gameState.triggerStart();
    }

    this.dispatchLobbyState();
  }
  

  public removeClient(client: AuthenticatedSocket): void
  {
    this.clients.delete(client.id);
    client.leave(this.id);

    if (this.clients.size === 0) {
      return;
    }

    // Alert the remaining players that client left lobby
    this.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
      senderCode: 100,
      senderName: '',
      message: client.data.userName + ' left the game',
    });

    delete this.gameState.scores[client.id];

    if (this.gameState.isStarted) {
      this.gameState.triggerFinish();
    } 

    // give creator to another player if necessary
    if (client.id === this.gameState.creatorId) {
      const firstClient = this.clients.entries().next().value;
      const firstPlayer = firstClient[0];
      this.gameState.creatorId = firstPlayer;
    }

    this.dispatchLobbyState();
    
  }

  public startGameEarly(client: AuthenticatedSocket): void {
    if (this.clients.size <= 1) {
      if (!client.data.lobby) {
        client.emit(SocketExceptions.LobbyError, {
          error: "Can't start a game with only one player!"
        });
      }
    }

    this.maxClients = this.clients.size;
    this.gameState.maxNumPlayers = this.clients.size;

    this.gameState.triggerStart();
  }

  public restartGame(client: AuthenticatedSocket): void {
    if (this.clients.size <= 1) {
      if (!client.data.lobby) {
        client.emit(SocketExceptions.LobbyError, {
          error: "Can't start a game with only one player!"
        });
      }
    }

    this.maxClients = this.clients.size;
    this.gameState.maxNumPlayers = this.clients.size;

    this.gameState.restartGame(client);
  }

  public sendChatMessage(chatMessage: ServerPayloads[ServerEvents.GameMessage]): void {
    this.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, chatMessage);
  }

  public dispatchLobbyState(): void
  {
    const payload: ServerPayloads[ServerEvents.LobbyState] = {
      lobbyId: this.id,
      lobbyName: this.name,
      isStarted: this.gameState.isStarted,
      isFinished: this.gameState.isFinished,
      numPlayers: this.clients.size,
      maxNumPlayers: this.gameState.maxNumPlayers,
      isRebuttal: this.gameState.isRebuttal,
      isFinalTurn: this.gameState.isFinalTurn,
      finalScore: this.gameState.finalScore,
      currentPigIndex1: this.gameState.currentPigIndex1,
      currentPigIndex2: this.gameState.currentPigIndex2,
      currentRollScore: this.gameState.currentRollScore,
      currentTurnPlayer: this.gameState.currentTurnPlayer,
      currentTurnScore: this.gameState.currentTurnScore,
      scores: this.gameState.scores,
      winnerId: this.gameState.winnerId,
      creatorId: this.gameState.creatorId,
    };

    this.dispatchToLobby(ServerEvents.LobbyState, payload);
  }

  public dispatchToLobby<T>(event: ServerEvents, payload: T): void
  {
    this.server.to(this.id).emit(event, payload);
  }
}