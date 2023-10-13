import { useRecoilValue, useRecoilState } from 'recoil';
import { CurrentLobbyState, NumPlayersState } from '../../recoilTypes';
import gameService from '../../../services/gameService';
import socketService from '../../../services/socketService';

import './gameControlBar.css';



export function GameControlBar() {
  const gameState = useRecoilValue(CurrentLobbyState)!;
  const [numPlayersState, setNumPlayersState] = useRecoilState(NumPlayersState);

  let isMyTurn = gameState.isStarted && socketService.socket && gameState.currentTurnPlayer === socketService.socket.id;
  let addedScore = gameState.isStarted ? gameState.scores[gameState.currentTurnPlayer].score + gameState.currentTurnScore : 0;

  const handleRollButton = () => {
    if (socketService.socket)
      gameService.updateGame(socketService.socket, 'roll');
  }

  const handlePassButton = () => {
    if (socketService.socket)
      gameService.updateGame(socketService.socket, 'pass');
  }

  const handleStartGameButton = () => {
    if (socketService.socket)
      gameService.startGameEarly(socketService.socket);

  }

  return (
    <div id='controlBar'>
      <div id='gameButtons'>
        <button id='passButton'
          onClick={() => handlePassButton()} 
          disabled={!gameState.isStarted || gameState.isFinished || !isMyTurn}
        >
          Pass
        </button>
        <button id='rollButton'
          onClick={() => handleRollButton()} 
          disabled={!gameState.isStarted || gameState.isFinished || !isMyTurn}
        >
          Roll
        </button>
      </div>

      {gameState.isStarted ? (
        <div id='turnInfo'>
          
          {isMyTurn ? 
            <h4 id={isMyTurn ? 'myTurn' : 'notMyTurn'}>Your turn</h4> :
            <h4>{gameState.scores[gameState.currentTurnPlayer].name}'s turn</h4>
          }
          <p>Turn score: {gameState.currentTurnScore}</p>
          <p>Total score: {gameState.scores[gameState.currentTurnPlayer].score} ({addedScore})</p>
        </div>
      ) : (
        gameState.numPlayers > 1 &&
          <button id='startgame' onClick={() => handleStartGameButton()} >Start Game Now</button>

      )}
    </div>
  );
}