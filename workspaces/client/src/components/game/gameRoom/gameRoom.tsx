import { useRecoilState } from 'recoil';
import { GameTable } from '../gameTable/gameTable';
import { GamePlayers } from '../gamePlayers/gamePlayers';
import { GameChat } from '../gameChat/gameChat';
import { GameControlBar } from '../gameControlBar/gameControlBar';
import { GameHeader } from '../gameHeader/gameHeader';
import { HideSidebarState } from '../../recoilTypes';


import './gameRoom.css';



export function GameRoom() {
  const [isHideSidebar, setHideSidebar] = useRecoilState(HideSidebarState);

  return (
    <div id='gameRoom'>
      <div id={isHideSidebar ? 'mainFull' : 'main'}>
        <GameHeader />
        <GameTable />
        <GameControlBar />
      </div>

      { !isHideSidebar && 
        <div id='sidebar'>
          <GamePlayers />
          <GameChat />
        </div>
      }
      
      
    </div>
  );


}