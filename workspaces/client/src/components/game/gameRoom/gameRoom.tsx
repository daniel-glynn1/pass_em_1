import { GameTable } from '../gameTable/gameTable';
import { GamePlayers } from '../gamePlayers/gamePlayers';
import { GameChat } from '../gameChat/gameChat';
import { GameControlBar } from '../gameControlBar/gameControlBar';
import { GameHeader } from '../gameHeader/gameHeader';

import './gameRoom.css';



export function GameRoom() {

  return (
    <div id='gameRoom'>
      <div id='main'>
        <GameHeader />
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