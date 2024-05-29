import { useRecoilValue, useRecoilState } from 'recoil';
import { CurrentLobbyState, Rolling1State, Rolling2State } from '../../recoilTypes';
import gameService from '../../../services/gameService';
import socketService from '../../../services/socketService';

import './gameControlBar.css';



export function GameControlBar() {
  const gameState = useRecoilValue(CurrentLobbyState)!;
  const [isRolling1, setIsRolling1] = useRecoilState(Rolling1State);
  const [isRolling2, setIsRolling2] = useRecoilState(Rolling2State);

  let isRolling = isRolling1 || isRolling2;
  let isMyTurn = gameState.isStarted && socketService.socket && gameState.currentTurnPlayer === socketService.socket.id;
  let addedScore = gameState.isStarted && gameState.scores[gameState.currentTurnPlayer] ? gameState.scores[gameState.currentTurnPlayer].score + gameState.currentTurnScore : 0;
  let isCreator = socketService.socket && gameState.creatorId === socketService.socket.id;

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

  const handleRestartGameButton = () => {
    if (socketService.socket)
      gameService.restartGame(socketService.socket);
  }

  

  return (
    <div id='controlBar'>
      <div id='gameButtons'>
        <button id='passButton'
          onClick={() => handlePassButton()} 
          disabled={!gameState.isStarted || gameState.isFinished || !isMyTurn || isRolling}
        >
          Pass
        </button>
        <button id='rollButton'
          onClick={() => handleRollButton()} 
          disabled={!gameState.isStarted || gameState.isFinished || !isMyTurn || isRolling}
        >
          Roll
        </button>
      </div>

      {(!gameState.isStarted && gameState.numPlayers > 1 && isCreator) &&
        <button className='startgame' onClick={() => handleStartGameButton()} >Start Game Now</button>
      }

      {(gameState.isFinished && gameState.numPlayers > 1 && isCreator) &&
        <button className='startgame' onClick={() => handleRestartGameButton()} >Play Again</button>
      }

      {(gameState.isStarted && !gameState.isFinished) &&
        <div id='turnInfo'>
          
          {isMyTurn ? 
            <h4 id={isMyTurn ? 'myTurn' : 'notMyTurn'}>Your turn</h4> :
            gameState.scores[gameState.currentTurnPlayer] ?
            <h4>{gameState.scores[gameState.currentTurnPlayer].name}'s turn</h4> :
            ''
          }
          <p>Turn score: {gameState.currentTurnScore}</p>
          <p>Total score: {gameState.scores[gameState.currentTurnPlayer] ? gameState.scores[gameState.currentTurnPlayer].score : 0} ({addedScore})</p>
        </div>
      }
    </div>
  );
}