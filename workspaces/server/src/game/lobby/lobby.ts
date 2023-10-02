import { v4 } from 'uuid';
import { Server, Socket } from 'socket.io';
import { ServerEvents } from '../../../../shared/types/serverEvents';
import { GameState } from '../../game/gameState';
import { ServerPayloads } from '../../../../shared/types/serverPayloads';
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
    public readonly maxClients: number,
  )
  {
  }

  public addClient(client: AuthenticatedSocket): void
  {
    this.clients.set(client.id, client);
    client.join(this.id);
    client.data.lobby = this;

    console.log("lobby now has: ", this.clients.size, " clients");
    if (this.clients.size >= this.maxClients) {
      this.gameState.triggerStart();
    }

    this.dispatchLobbyState();
  }

  public removeClient(client: AuthenticatedSocket): void
  {
    this.clients.delete(client.id);
    client.leave(this.id);
    client.data.lobby = null;

    console.log("lobby now has: ", this.clients.size, " clients");

    // If player leave then the game isn't worth to play anymore
    this.gameState.triggerFinish();

    // Alert the remaining player that client left lobby
    this.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
      color: 'blue',
      message: 'Opponent left lobby',
    });

    this.dispatchLobbyState();
  }

  public dispatchLobbyState(): void
  {
    const payload: ServerPayloads[ServerEvents.LobbyState] = {
      lobbyId: this.id,
      lobbyName: this.name,
      isStarted: this.gameState.isStarted,
      isFinished: this.gameState.isFinished,
      numPlayers: this.clients.size,
      currentPigIndex1: this.gameState.currentPigIndex1,
      currentPigIndex2: this.gameState.currentPigIndex2,
      currentRollScore: this.gameState.currentRollScore,
      currentTurnPlayer: this.gameState.currentTurnPlayer,
      currentTurnScore: this.gameState.currentTurnScore,
      scores: this.gameState.scores,
    };

    this.dispatchToLobby(ServerEvents.LobbyState, payload);
  }

  public dispatchToLobby<T>(event: ServerEvents, payload: T): void
  {
    this.server.to(this.id).emit(event, payload);
  }
}