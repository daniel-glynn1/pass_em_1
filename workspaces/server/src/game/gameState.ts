import { Lobby } from '../game/lobby/lobby';
import { Socket } from 'socket.io';
import { ServerPayloads } from '../../../shared/types/serverPayloads';
import { ServerEvents } from '../../../shared/types/serverEvents';
import { Player } from '../../../shared/types/player';
import { AuthenticatedSocket } from '../game/types';



export class GameState
{
  public isStarted: boolean = false;
  public isFinished: boolean = false;
  public numPlayers: number = 0;
  public currentPigIndex1: number = 0;
  public currentPigIndex2: number = 0;
  public currentRollScore: number = 0;
  public currentTurnPlayer: Socket['id'] = '';
  public currentTurnScore: number = 0;
  public scores: Record<Socket['id'], Player> = {};

  constructor(
    private readonly lobby: Lobby,
  )
  {
  }

  public triggerStart(): void
  {
    if (this.isStarted) {
      return;
    }

    this.isStarted = true;

    this.initializePlayers();

    this.lobby.dispatchToLobby(ServerEvents.GameStarted, {});
    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
      color: 'blue',
      message: 'Game started !',
    });

    console.log(this);
    this.lobby.dispatchLobbyState();

  }

  public triggerFinish(): void
  {
    console.log("triggering finish...");
    if (this.isFinished || !this.isStarted) {
      return;
    }

    this.isFinished = true;

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
      color: 'blue',
      message: 'Game finished !',
    });

    this.lobby.dispatchLobbyState();
  }

  public rollPigs(client: AuthenticatedSocket): void
  {
    if (this.isFinished || !this.isStarted) {
      return;
    }

    // ignore if request is not from player whose turn it is
    if (this.currentTurnPlayer != client.id) {
      return;
    }

    // get random indices for pigs
    const index1: number = this.getRandomIndex(0, 6);
    const index2: number = this.getRandomIndex(0, 6);

    // determine score of roll
    const rollScore: number = this.calculateScore(index1, index2);
    const isPigOut: boolean = this.isPigOut(index1, index2);

    // update game state
    this.currentPigIndex1 = index1;
    this.currentPigIndex2 = index2;
    this.currentRollScore = rollScore;

    if (isPigOut) {
      this.currentTurnScore = 0;
      this.currentTurnPlayer = this.getNextPlayer();
    } else {
      this.currentTurnScore += rollScore;
    }

    // send game state to lobby
    this.lobby.dispatchLobbyState();
  }

  public passPigs(client: AuthenticatedSocket): void
  {
    if (this.isFinished || !this.isStarted) {
      return;
    }

    // ignore if request is not from player whose turn it is
    if (this.currentTurnPlayer != client.id) {
      return;
    }

    // update game state
    this.scores[this.currentTurnPlayer].score += this.currentTurnScore;

    // check for win
    if (this.scores[this.currentTurnPlayer].score >= 100) {
      this.triggerFinish();
    }

    this.currentTurnScore = 0;
    this.currentTurnPlayer = this.getNextPlayer();

    // send game state to lobby
    this.lobby.dispatchLobbyState();
  }

  private initializePlayers(): void {
    // give first turn to first player in clients map
    const firstClient = this.lobby.clients.entries().next().value;
    if (!firstClient) {
      this.triggerFinish();
    }

    const firstPlayer = firstClient[0];
    this.currentTurnPlayer = firstPlayer;

    // initialize scores for each player
    for (const [id, socket] of this.lobby.clients) {
      const newPlayer: Player = {
        name: socket.data.userName,
        score: 0
      };
      this.scores[id] = newPlayer;
    }

    console.log(this.scores);

  }

  private getRandomIndex(min: number, max: number): number {
    return Math.floor(Math.random() * max) + min;
  }

  private calculateScore(index1: number, index2: number): number {
    return index1 + index2;
  }

  private isPigOut(index1: number, index2: number): boolean {
    return (index1 <= 1 && index2 <= 1);
  }

  private getNextPlayer(): Socket['id'] {
    const keys = Object.keys(this.scores) as (Socket['id'])[];
    const currentIndex = keys.indexOf(this.currentTurnPlayer);

    if (currentIndex === -1) {
      throw new Error(`Key "${this.currentTurnPlayer}" not found in the record.`);
    }

    const nextIndex = (currentIndex + 1) % keys.length;
    return keys[nextIndex];
  }



}