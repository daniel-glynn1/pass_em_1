import { useRecoilValue, useRecoilState } from 'recoil';
import { CurrentLobbyState, ShowScoreboardState } from '../../recoilTypes';
import './gamePlayers.css';
import x from '../../../assets/x.png';


export function GamePlayers() {
  const gameState = useRecoilValue(CurrentLobbyState)!;
  const [isShowScoreboard, setShowScoreboard] = useRecoilState(ShowScoreboardState);
  
  let players = Object.entries(gameState.scores);

  const isPlayerTurn = (index: number): boolean => {
    const [key, value] = players[index]
    return gameState.currentTurnPlayer === key;
  }

  const handleCloseButtonClick = () => {
    setShowScoreboard(false);
  };

  return (
    <div id={isShowScoreboard ? 'playersOuterSidebar' : 'playersOuter'}>
      <div id={isShowScoreboard ? 'playersHeaderSidebar' : 'playersHeader'}>
        <h4 id='playersTitle'>Scoreboard</h4>
        { isShowScoreboard && 
          <button id='closebutton' onClick={handleCloseButtonClick}>
            <img id='closeicon' alt='close' src={x} />
          </button>
        }
      </div>
      
      <div id='playersList'>
      
        {players.map(([key, value], index) => (
          <div className={isPlayerTurn(index) ? 'playerScoreTurn' : 'playerScore'} id={`playerScore-${index}`} key={key}>
            <p>{value.name}</p>
            <p className='scoreText'>{value.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}