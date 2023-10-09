import socketService from '../../../services/socketService';
import { useRecoilValue } from 'recoil';
import { CurrentLobbyState } from '../gameStateType';
import './waitingRoom.css';


export function WaitingRoom() {
  const gameState = useRecoilValue(CurrentLobbyState)!;

  return (
    <div id='waitingOuter'>

    <div id='header'>
      <h2>Pass 'Em</h2>
      <h3>{gameState.scores[socketService.socket!.id].name}</h3>
    </div>
    <div id='waitingRoom'>
      
      <h4 id='roomName'>{gameState.lobbyName}</h4>
      <h3>Waiting for players to join lobby... </h3>
      
      <p>Current players joined ({gameState.numPlayers}/{gameState.maxNumPlayers}):</p>
      <div>
        <ul id='joining'>
          {Object.entries(gameState.scores).map(([key, value]) => (
            <li key={key}>
              {value.name}
              {(socketService.socket && socketService.socket.id === key) ? ' (You)' : ''}
            </li>
          ))}
        </ul>
        
      </div>
    </div>

    </div>
  );


}