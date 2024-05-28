import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { ShowMenuState, ShowRulesState, ShowChatState, ShowScoreboardState, HideSidebarState, MobileState } from '../../recoilTypes';
import { GameRoom } from '../gameRoom/gameRoom';
import './game.css';



export function Game() {
  const [isShowMenu, setShowMenu] = useRecoilState(ShowMenuState);
  const [isShowRules, setShowRules] = useRecoilState(ShowRulesState);
  const [isShowChat, setShowChat] = useRecoilState(ShowChatState);
  const [isShowScoreboard, setShowScoreboard] = useRecoilState(ShowScoreboardState);
  const [isHideSidebar, setHideSidebar] = useRecoilState(HideSidebarState);
  const [isMobile, setMobile] = useRecoilState(MobileState);



  const initializeState = () => {
    setShowMenu(false);
    setShowRules(false);
  }

  const handleResize = () => {
    if (window.innerWidth >= 950) {
      setHideSidebar(false);
      setMobile(false);
      setShowChat(false);
      setShowScoreboard(false);
      
    } else if (window.innerWidth >= 700) {
      setHideSidebar(true);
      setMobile(false);
    } else {
      setHideSidebar(true);
      setMobile(true);
    }

    

  };
  
  useEffect(() => {
    initializeState();
    handleResize();    

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div id='gameOuter'>
      <GameRoom />
    </div>
  );


}