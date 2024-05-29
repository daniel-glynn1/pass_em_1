import { useRecoilValue, useRecoilState } from 'recoil';
import { ShowRulesState, ShowChatState, ShowScoreboardState, HideSidebarState, UserNameState, NewChatState } from '../../recoilTypes';
import { ShowMenuState } from '../../recoilTypes';
import menu from '../../../assets/menu.png';
import x from '../../../assets/x.png';
import scoreboard from '../../../assets/scoreboard.png';
import chat from '../../../assets/chat.png';
import passemlogo from '../../../assets/passemlogo.png';
import './gameHeader.css';


export function GameHeader() {
  const [isShowMenu, setShowMenu] = useRecoilState(ShowMenuState);
  const [isShowRules, setShowRules] = useRecoilState(ShowRulesState);
  const [isShowChat, setShowChat] = useRecoilState(ShowChatState);
  const [isShowScoreboard, setShowScoreboard] = useRecoilState(ShowScoreboardState);
  const [isHideSidebar, setHideSidebar] = useRecoilState(HideSidebarState);
  const [newChatState, setNewChatState] = useRecoilState(NewChatState);


  const userName = useRecoilValue(UserNameState);


  const handleMenuClick = () => {
    setShowMenu(!isShowMenu);
    if (isShowMenu) {
      setShowRules(false);
    }
  };

  const handleChatButtonClick = () => {
    if (isShowScoreboard) {
      setShowScoreboard(false);
    }
    setShowChat(!isShowChat);
    setNewChatState(false);
  };

  const handleScoreboardButtonClick = () => {
    if (isShowChat) {
      setShowChat(false);
    }
    setShowScoreboard(!isShowScoreboard);
  };

  return (
    <div id='header'>
      <div id='left'>
        <button className='menubutton' onClick={handleMenuClick}>
          <img id='menuicon' alt='menu' src={isShowMenu ? x : menu} />
        </button>
        
        <img id='logo' alt='logo' src={passemlogo} />
        <h2>Pass 'Em</h2>
        
      </div>
      
      {/* <h3>{userName}</h3> */}
      { isHideSidebar && 
        <div id="sidebarbuttons">
          { newChatState && 
            <div id='newchaticon'></div>
          }
          <button id='chatbutton' className='sidebarbutton' onClick={handleChatButtonClick}>
            <img id='chaticon' alt='chat' src={chat} />
          </button>
          <button id='scoreboardbutton' className='sidebarbutton' onClick={handleScoreboardButtonClick}>
            <img id='scoreboardicon' alt='scoreboard' src={scoreboard} />
          </button>
        </div>
      }
      
    </div>   
  );


}


