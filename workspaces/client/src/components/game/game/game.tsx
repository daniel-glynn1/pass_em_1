import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { ShowMenuState, ChatState } from '../../recoilTypes';
import { GameRoom } from '../gameRoom/gameRoom';
import './game.css';



export function Game() {
  const [isShowMenu, setShowMenu] = useRecoilState(ShowMenuState);

  const initializeState = () => {
    setShowMenu(false);
  }
  
  useEffect(() => {
    initializeState();
  }, []);

  return (
    <div id='gameOuter'>
      <GameRoom />
    </div>
  );


}