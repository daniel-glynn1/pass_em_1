import { useRecoilValue } from 'recoil';
import { CurrentLobbyState } from '../gameStateType';
import './gameChat.css';



export function GameChat() {
  const gameState = useRecoilValue(CurrentLobbyState)!;

  return (
    <div id='chatOuter'>
      <h4>Chat</h4>
      <p>Coming soon...</p>
    </div>
  );
}