import { FinalScoreState } from '../../recoilTypes';
import { useRecoilState } from 'recoil';
import './finalScoreSelector.css';



export function FinalScoreSelector() {
  const [finalScoreState, setFinalScoreState] = useRecoilState(FinalScoreState);

  const scoreOptions = [10, 50, 100, 150, 200];

  const handleScoreSelected = (score: number) => {
    setFinalScoreState(score);
  };

  return (
    <div id='finalScoreOuter'>
      <p id='finalScoreText'>
        Target Score:
      </p>
      <div id='finalScoreOptions'>
        {scoreOptions.map((score, index) => (
          <button className='scoreOption' id={score === finalScoreState ? 'selected' : 'unselected'} type="button" key={index} onClick={() => handleScoreSelected(score)}>
            <p>{score}</p>
          </button>
        ))}
      </div>
    </div>
  );


}