import { useRecoilValue, useRecoilState } from 'recoil';
import { ShowRulesState, UserNameState } from '../../recoilTypes';
import { ShowMenuState } from '../../recoilTypes';
import menu from '../../../assets/menu.png';
import x from '../../../assets/x.png';
import passemlogo from '../../../assets/passemlogo.png';
import './gameHeader.css';


export function GameHeader() {
  const [isShowMenu, setShowMenu] = useRecoilState(ShowMenuState);
  const [isShowRules, setShowRules] = useRecoilState(ShowRulesState);

  const userName = useRecoilValue(UserNameState);


  const handleMenuClick = () => {
    setShowMenu(!isShowMenu);
    if (isShowMenu) {
      setShowRules(false);
    }
  };

  return (
    <div id='header'>
      <div id='left'>
        <button id='menubutton' onClick={handleMenuClick}>
          <img id='menuicon' alt='menu' src={isShowMenu ? x : menu} />
        </button>
        
        <img id='logo' alt='logo' src={passemlogo} />
        <h2>Pass 'Em</h2>
        
      </div>
      
      <h3>{userName}</h3>
    </div>   
  );


}


