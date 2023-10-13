import { NumPlayersState } from '../../recoilTypes';
import { useRecoilState } from 'recoil';
import './numPlayersSelector.css';



export function NumPlayersSelector() {
  const [numPlayersState, setNumPlayersState] = useRecoilState(NumPlayersState);

  const numPlayerOptions = [2, 3, 4, 5, 6, 7, 8];

  const handleNumSelected = (numPlayers: number) => {
    setNumPlayersState(numPlayers);
  };


  return (
    <div id='numPlayersOuter'>
      <p id='numPlayersText'>
        Number of Players:
      </p>
      <div id='numPlayerOptions'>
        {numPlayerOptions.map((score, index) => (
          <button className='playerOption' id={score === numPlayersState ? 'selected' : 'unselected'} type="button" key={index} onClick={() => handleNumSelected(score)}>
            <p>{score}</p>
          </button>
        ))}
      </div>
    </div>
  );


}