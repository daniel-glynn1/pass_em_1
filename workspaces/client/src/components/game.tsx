import React, {useContext, useEffect, useState} from 'react';
import gameService from '../services/gameService';
import socketService from '../services/socketService';
import { ServerEvents } from "../shared/types/serverEvents";
import { ServerPayloads } from "../shared/types/serverPayloads";
import { useRecoilValue } from 'recoil';
import { CurrentLobbyState } from '../components/gameState';


export function Game() {

  const gameState = useRecoilValue(CurrentLobbyState)!;

  let isMyTurn = socketService.socket && gameState.currentTurnPlayer === socketService.socket.id;

  const handleRollButton = () => {
    if (socketService.socket)
      gameService.updateGame(socketService.socket, 'roll');
  }

  const handlePassButton = () => {
    if (socketService.socket)
      gameService.updateGame(socketService.socket, 'pass');
  }

  const handleGameMessage = () => {
    if (socketService.socket) {
      gameService.onGameMessage(socketService.socket, (data) => {
        alert(data.message);
      });
    }
  }

  useEffect(() => {
    handleGameMessage();
  }, []);

  return (
    
    <div>
      {!gameState.isStarted ? (
          <div>
            <h2>Room: {gameState.lobbyName}</h2>
            <h2>Waiting for other players...</h2>
          </div>
        ) : (
          <div>
            <button 
              onClick={() => handlePassButton()} 
              disabled={!gameState.isStarted || gameState.isFinished || !isMyTurn}
            >
              Pass
            </button>
            <button 
              onClick={() => handleRollButton()} 
              disabled={!gameState.isStarted || gameState.isFinished || !isMyTurn}
            >
              Roll
            </button>
            <div>
              <p>Room: {gameState.lobbyName}</p>
              <p>Pig 1: {gameState.currentPigIndex1}</p>
              <p>Pig 2: {gameState.currentPigIndex2}</p>
              <p>Roll score: {gameState.currentRollScore}</p>
              <p>Turn score: {gameState.currentTurnScore}</p>
              <p>{gameState.scores[gameState.currentTurnPlayer].name}'s turn, 
              score: {gameState.scores[gameState.currentTurnPlayer].score}, 
              id: {gameState.currentTurnPlayer}</p>
              <p>You are: {socketService.socket!.id}</p>

            </div>
            <div>
              {Object.entries(gameState.scores).map(([key, value]) => (
                <div key={key}>
                  Key: {key}, Player: {value.name}, Score: {value.score}
                </div>
              ))}
            </div>
          </div>
        )}
      
    </div>
  );


}