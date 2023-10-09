import gameService from '../../../services/gameService';
import socketService from '../../../services/socketService';
import { useRecoilValue } from 'recoil';
import { CurrentLobbyState } from '../gameStateType';
import { GameTable } from '../gameTable/gameTable';
import { GamePlayers } from '../gamePlayers/gamePlayers';
import { GameChat } from '../gameChat/gameChat';
import { GameControlBar } from '../gameControlBar/gameControlBar';
import './gameRoom.css';



export function GameRoom() {

  const gameState = useRecoilValue(CurrentLobbyState)!;

  return (
    <div id='gameRoom'>
      <div id='main'>
        <div id='header'>
          <h2>Pass 'Em</h2>
          <h3>{gameState.scores[socketService.socket!.id].name}</h3>
        </div>
        <GameTable />
        <GameControlBar />
      </div>
      <div id='sidebar'>
        <GameChat />
        <GamePlayers />
      </div>
      
    </div>
  );


}