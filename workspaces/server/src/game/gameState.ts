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
  public maxNumPlayers: number = 0;
  public isRebuttal: boolean = false;
  public isFinalTurn: boolean = false;
  public finalScore: number = 100;
  public currentPigIndex1: number = 0;
  public currentPigIndex2: number = 0;
  public currentRollScore: number = 0;
  public currentTurnPlayer: Socket['id'] = '';
  public currentTurnScore: number = 0;
  public scores: Record<Socket['id'], Player> = {};
  public winnerId: Socket['id'] = '';
  public creatorId: Socket['id'] = '';


  private pigScoreMap: Map<number, number> = new Map<number, number>([
    [0, 0],
    [1, 0],
    [2, 5],
    [3, 5],
    [4, 10],
    [5, 15]
  ]);

  constructor(
    private readonly lobby: Lobby,
  )
  {
    this.maxNumPlayers = lobby.maxClients;
    this.finalScore = lobby.finalScore;
  }

  public triggerStart(): void
  {
    if (this.isStarted) {
      return;
    }

    this.isStarted = true;

    this.initializePlayers();

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
      senderCode: 100,
      senderName: '',
      message: 'Game started!',
    });

    this.lobby.dispatchLobbyState();

  }

  public triggerFinish(): void
  {
    console.log("triggering finish...");
    if (this.isFinished) {
      return;
    }
    if (!this.isStarted) {
      this.isFinished = true;
      return;
    }

    this.isFinished = true;

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
      senderCode: 100,
      senderName: '',
      message: 'Game finished!',
    });

    this.lobby.dispatchLobbyState();
  }

  public restartGame(client: AuthenticatedSocket): void {
    console.log("restarting game...");

    // only restart if game has finished
    if (!this.isFinished) {
      return;
    }

    // reset all game state properties
    this.isStarted = false;
    this.isFinished = false;
    this.isFinalTurn = false;
    this.finalScore = this.lobby.finalScore;
    this.currentPigIndex1 = 0;
    this.currentPigIndex2 = 0;
    this.currentRollScore = 0;
    this.currentTurnScore = 0;
    this.winnerId = '';

    // reset each player's score to 0
    for (const key in this.scores) {
      this.scores[key].score = 0;
    }

    this.triggerStart();
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
    const pig1: number = this.getRandomPig();
    const pig2: number = this.getRandomPig();

    // determine score of roll
    const rollScore: number = this.calculateScore(pig1, pig2);
    const isPigOut: boolean = this.isPigOut(pig1, pig2);

    // update game state
    this.currentPigIndex1 = pig1;
    this.currentPigIndex2 = pig2;
    this.currentRollScore = rollScore;

    if (isPigOut) {
      this.currentTurnScore = 0;
      this.currentTurnPlayer = this.getNextPlayer();

      // looped back to player who first won, game is now over
      if (this.isRebuttal && this.isFinalTurn && this.currentTurnPlayer === this.winnerId) { 
        this.triggerFinish();
      }

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
    if (this.currentTurnPlayer !== client.id) {
      return;
    }

    // update game state
    this.scores[this.currentTurnPlayer].score += this.currentTurnScore;

    // check for win
    var isWinner: boolean = false;
    if (this.scores[this.currentTurnPlayer].score >= this.finalScore) {
      this.winnerId = this.currentTurnPlayer;
      if (this.isRebuttal) {
        this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
          senderCode: 100,
          senderName: '',
          message: 'Final turn!',
        });
        this.isFinalTurn = true;
        this.finalScore = this.scores[this.currentTurnPlayer].score + 1;
      } else {
        isWinner = true;
      }
      
    }

    this.currentTurnScore = 0;
    this.currentTurnPlayer = this.getNextPlayer();

    // looped back to player who first won, game is now over
    if (this.isRebuttal && this.isFinalTurn && this.currentTurnPlayer === this.winnerId) { 
      isWinner = true;
    }

    if (isWinner) {
      this.triggerFinish();
    }

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

  }

  private getRandomPig(): number {
    let num = Math.floor(Math.random() * 1000);
    if (num < 5) {                                  // 0.5% Jowler
      return 5;
    } else if (num < 5 + 25) {                      // 2.5% Snouter 
      return 4;
    } else if (num < 5 + 25 + 100) {                // 10.0% Trotter
      return 3;
    } else if (num < 5 + 25 + 100 + 200) {          // 20.0% Razorback
      return 2;
    } else if (num < 5 + 25 + 100 + 200 + 350) {    // 35.0% Side dot up
      return 1;
    } else {                                        // 32.0% Side dot down
      return 0; 
    }
  }

  private calculateScore(pig1: number, pig2: number): number {
    var score: number = 0;

    if ((pig1 === 0 && pig2 === 1) || (pig1 === 1 && pig2 === 0)) { // pig out
      score = 0;
    } else if (pig1 === 1 && pig2 === 1) { // one point
      score = 1;
    } else {
      score = this.pigScoreMap.get(pig1)! + this.pigScoreMap.get(pig2)!;
      
      if (pig1 === pig2) { // double score if they are the same
        score *= 2;
      }
    }

    return score;
  }

  

  private isPigOut(pig1: number, pig2: number): boolean {
    return (pig1 === 0 && pig2 === 1) || (pig1 === 1 && pig2 === 0);
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