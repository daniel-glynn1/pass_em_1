import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { ShowMenuState, ShowRulesState } from '../../recoilTypes';
import { GameRoom } from '../gameRoom/gameRoom';
import './game.css';



export function Game() {
  const [isShowMenu, setShowMenu] = useRecoilState(ShowMenuState);
  const [isShowRules, setShowRules] = useRecoilState(ShowRulesState);


  const initializeState = () => {
    setShowMenu(false);
    setShowRules(false);
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