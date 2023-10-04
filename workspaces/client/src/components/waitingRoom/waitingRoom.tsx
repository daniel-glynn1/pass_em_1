import socketService from '../../services/socketService';
import { useRecoilValue } from 'recoil';
import { CurrentLobbyState } from '../game/gameStateType';



export function WaitingRoom() {
  const gameState = useRecoilValue(CurrentLobbyState)!;

  return (
    <div>
      <h2>Waiting for players... ({gameState.numPlayers}/{gameState.maxNumPlayers})</h2>
      <p>Room: {gameState.lobbyName}</p>
      <p>Current players joined: </p>
      <div>
        {Object.entries(gameState.scores).map(([key, value]) => (
          <div key={key}>
            {value.name}
            {(socketService.socket && socketService.socket.id === key) ? ' (You)' : ''}
          </div>
        ))}
      </div>
    </div>
  );


}