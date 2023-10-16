import { ServerEvents } from "./serverEvents";
import { Player } from "./player"


export type ServerPayloads = {
  [ServerEvents.LobbyState]: {
    lobbyId: string;
    lobbyName: string;
    isStarted: boolean;
    isFinished: boolean;
    numPlayers: number;
    maxNumPlayers: number;
    isRebuttal: boolean;
    isFinalTurn: boolean;
    finalScore: number;
    currentPigIndex1: number;
    currentPigIndex2: number;
    currentRollScore: number;
    currentTurnPlayer: string;
    currentTurnScore: number;
    scores: Record<string, Player>;
    winnerId: string;
    creatorId: string;
  };

  [ServerEvents.GameMessage]: {
    message: string;
    senderName: string;
    senderCode: number;
  };
};