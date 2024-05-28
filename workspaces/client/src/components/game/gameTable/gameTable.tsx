import { useRecoilValue, useRecoilState } from 'recoil';
import { ShowMenuState, ShowRulesState, ShowChatState, ShowScoreboardState, CurrentLobbyState, MobileState } from '../../recoilTypes';
import './gameTable.css';
import { GameMenu } from './gameMenu/gameMenu';
import { GamePigs } from './gamePigs/gamePigs';
import { GameRules } from './gameRules/gameRules';
import { GameChat } from '../gameChat/gameChat';
import { GamePlayers } from '../gamePlayers/gamePlayers';
import passemtable2 from '../../../assets/passemtable2.png';




export function GameTable() {
  const gameState = useRecoilValue(CurrentLobbyState)!;
  const [isShowMenu, setShowMenu] = useRecoilState(ShowMenuState);
  const [isShowRules, setShowRules] = useRecoilState(ShowRulesState);
  const [isShowChat, setShowChat] = useRecoilState(ShowChatState);
  const [isShowScoreboard, setShowScoreboard] = useRecoilState(ShowScoreboardState);
  const [isMobile, setMobile] = useRecoilState(MobileState);


  let players = Object.entries(gameState.scores);
  let players1 = players.slice(0, 4);
  let players2 = players.slice(4);

  const isPlayerTurn = (index: number): boolean => {
    const [key, value] = players[index]
    return gameState.currentTurnPlayer === key;
  }

  return (
    <div id="tableOuter">
      { isShowMenu && 
        <GameMenu /> 
      }
      { isShowRules ? 
        <GameRules /> :

        !isMobile ?
        (
          <div id="tableWithPlayers">
            <div id="table">
              <GamePigs />
            </div>

            <div id="tablePlayers">
              {players.map(([key, value], index) => (
                <div className='tablePlayerOuter' id={`tablePlayer-${index}`} key={key}>
                  <div className='nameTag'>
                    <p>{value.name}</p>
                  </div>
                  
                  <div 
                    className={isPlayerTurn(index) ? 'tablePlayerTurn' : 'tablePlayer'}
                    id={`playerColor-${index}`}>
                  </div>
                  
                </div>
              ))}
            </div>

          </div>
        ) : (
          <div id="tableWithPlayers" className={players2 ? "oneRow" : "twoRows"}>
            <div className="rowPlayers" id='topRow'>
              {players1.map(([key, value], index) => (
                <div className='tablePlayerOuterMobile' id={!isMobile ? `tablePlayer-${index}` : ''} key={key}>
                  <div className='nameTag'>
                    <p>{value.name}</p>
                  </div>
                  
                  <div 
                    className={isPlayerTurn(index) ? 'tablePlayerTurn' : 'tablePlayer'}
                    id={`playerColor-${index}`}>
                  </div>
                  
                </div>
              ))}
            </div>
            <img id='mobileTable' alt='table' src={passemtable2} />
            <div id="table">
              <GamePigs />
            </div>

            
            
            <div className="rowPlayers" id='bottomRow'>
              {players2.map(([key, value], index) => (
                <div className='tablePlayerOuterMobile' id={!isMobile ? `tablePlayer-${index+4}` : ''} key={key}>
                  <div className='nameTag'>
                    <p>{value.name}</p>
                  </div>
                  
                  <div 
                    className={isPlayerTurn(index+4) ? 'tablePlayerTurn' : 'tablePlayer'}
                    id={`playerColor-${index+4}`}>
                  </div>
                  
                </div>
              ))}
            </div>

            

          </div>
        )
      
      }
      { isShowChat && 
        <GameChat /> 
      }
      { isShowScoreboard && 
        <GamePlayers /> 
      }
      
      
    </div>
  );
}