import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { ChatState, CurrentLobbyState, ShowRulesState } from '../../../recoilTypes';
import './gameMenu.css';
import gameService from '../../../../services/gameService';
import socketService from '../../../../services/socketService';


export function GameMenu() {
  const gameState = useRecoilValue(CurrentLobbyState)!;
  const setGameState = useSetRecoilState(CurrentLobbyState);
  const [chatState, setChatState] = useRecoilState(ChatState);
  const [isShowRules, setShowRules] = useRecoilState(ShowRulesState);

  const handleLeaveButton = async () => {
    if (socketService.socket) {
      const left = await gameService
      .leaveGameRoom(socketService.socket)
      .catch((err) => {
        alert(err);
      });
      
      setGameState(null);
      setChatState([]);

    }
  }

  const handleRulesClick = () => {
    setShowRules(true);
  };

  return (
    <div id='menu'>
      <div id='menuInner'>
        <div id='gameOptions'>
          <p>Game Options: </p>
          <div>
            <p>Target Score: {gameState.finalScore}</p>
            <p>Rebuttal: {gameState.isRebuttal ? 'On' : 'Off'}</p>
          </div>
          
        </div>
        
        <button id='showrules' onClick={handleRulesClick}>Rules</button>
        <button id='leave' onClick={() => handleLeaveButton()} >Leave</button>
      </div>
    </div>
  );


}