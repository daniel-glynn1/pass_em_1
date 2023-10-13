import { useRecoilValue } from 'recoil';
import { CurrentLobbyState } from '../../recoilTypes';
import './gamePlayers.css';



export function GamePlayers() {
  const gameState = useRecoilValue(CurrentLobbyState)!;
  
  let players = Object.entries(gameState.scores);

  const isPlayerTurn = (index: number): boolean => {
    const [key, value] = players[index]
    return gameState.currentTurnPlayer === key;
  }

  return (
    <div id='playersOuter'>
      <h4>Scoreboard</h4>
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