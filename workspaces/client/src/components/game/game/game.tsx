import { useEffect } from 'react';
import gameService from '../../../services/gameService';
import socketService from '../../../services/socketService';
import { useRecoilValue } from 'recoil';
import { CurrentLobbyState } from '../gameStateType';
import { WaitingRoom } from '../waitingRoom/waitingRoom';
import { GameRoom } from '../gameRoom/gameRoom';
import './game.css';



export function Game() {

  const gameState = useRecoilValue(CurrentLobbyState)!;

  const handleGameMessage = () => {
    if (socketService.socket) {
      gameService.onGameMessage(socketService.socket, (data) => {
        alert(data.message);
      });
    }
  }

  const removeGameMessage = () => {
    if (socketService.socket) {
      gameService.offGameMessage(socketService.socket, () => {});
    }
  }

  useEffect(() => {
    handleGameMessage();

    return () => {
      removeGameMessage();
    }
  }, []);

  return (
    
    <div id='gameOuter'>
      {!gameState.isStarted ? (
        <WaitingRoom />
      ) : (
        <GameRoom />
      )}
    </div>
  );


}