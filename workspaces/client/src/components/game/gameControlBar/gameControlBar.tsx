import { useRecoilValue } from 'recoil';
import { CurrentLobbyState } from '../gameStateType';
import gameService from '../../../services/gameService';
import socketService from '../../../services/socketService';
import './gameControlBar.css';



export function GameControlBar() {
  const gameState = useRecoilValue(CurrentLobbyState)!;

  let isMyTurn = socketService.socket && gameState.currentTurnPlayer === socketService.socket.id;
  let addedScore = gameState.scores[gameState.currentTurnPlayer].score + gameState.currentTurnScore;

  const handleRollButton = () => {
    if (socketService.socket)
      gameService.updateGame(socketService.socket, 'roll');
  }

  const handlePassButton = () => {
    if (socketService.socket)
      gameService.updateGame(socketService.socket, 'pass');
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
      

      <div id='turnInfo'>
        {isMyTurn ? 
          <h4 id={isMyTurn ? 'myTurn' : 'notMyTurn'}>Your turn</h4> :
          <h4>{gameState.scores[gameState.currentTurnPlayer].name}'s turn</h4>
        }
        <p>Turn score: {gameState.currentTurnScore}</p>
        <p>Total score: {gameState.scores[gameState.currentTurnPlayer].score} ({addedScore})</p>
      </div>
    </div>
  );
}