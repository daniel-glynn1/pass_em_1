import { useRecoilValue, useRecoilState } from 'recoil';
import { UserNameState } from '../../recoilTypes';
import { ShowMenuState } from '../../recoilTypes';
import menu from '../../../assets/menu.png';
import x from '../../../assets/x.png';
import './gameHeader.css';


export function GameHeader() {
  const [isShowMenu, setShowMenu] = useRecoilState(ShowMenuState);
  const userName = useRecoilValue(UserNameState);


  const handleMenuClick = () => {
    // Update the boolean value to true
    setShowMenu(!isShowMenu);
  };

  return (
    <div id='header'>
      <div id='left'>
        <button id='menubutton' onClick={handleMenuClick}>
          <img id='menuicon' alt='menu' src={isShowMenu ? x : menu} />
        </button>
        
        <h2>Pass 'Em</h2>
      </div>
      
      <h3>{userName}</h3>
    </div>   
  );


}


