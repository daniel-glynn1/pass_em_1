import { useRecoilValue, useRecoilState } from 'recoil';
import { ShowMenuState, CurrentLobbyState } from '../../recoilTypes';
import './gameTable.css';
import { GameMenu } from './gameMenu/gameMenu';
import { GamePigs } from './gamePigs/gamePigs';


export function GameTable() {
  const gameState = useRecoilValue(CurrentLobbyState)!;
  const [isShowMenu, setShowMenu] = useRecoilState(ShowMenuState);

  let players = Object.entries(gameState.scores);

  const isPlayerTurn = (index: number): boolean => {
    const [key, value] = players[index]
    return gameState.currentTurnPlayer === key;
  }

  return (
    <div id="tableOuter">
      { isShowMenu && 
        <GameMenu /> 
      }
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
      
      
    </div>
  );
}