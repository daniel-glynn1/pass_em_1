import { RebuttalState } from '../../recoilTypes';
import { useRecoilState } from 'recoil';
import './rebuttalSelector.css';
import { useState } from 'react';



export function RebuttalSelector() {
  const [rebuttalState, setRebuttalState] = useRecoilState(RebuttalState);
  const [isRebuttalExplanation, setRebuttalExplanation] = useState(false);

  const rebuttalOptions = [false, true];

  const handleScoreSelected = (isOn: boolean) => {
    setRebuttalState(isOn);
  };

  const handleRebuttalClick = () => {
    setRebuttalExplanation(!isRebuttalExplanation);
  };

  return (
    <div id='rebuttalOuter'>
      <div id='rebuttalTitle'>
        <p id='rebuttalText'>
          Chance for Rebuttal:
        </p>
        <button type='button' id='explanationButton' onClick={handleRebuttalClick}>
          ?
        </button>
      </div>
      
      <div id='rebuttalOptions'>
        {rebuttalOptions.map((option, index) => (
          <button className='rebuttalOption' id={option === rebuttalState ? 'selected' : 'unselected'} type="button" key={index} onClick={() => handleScoreSelected(option)}>
            <p>{option ? 'On' : 'Off'}</p>
          </button>
        ))}
      </div>

      {isRebuttalExplanation &&
        <div id='rebuttalExplanation'>
          <p>Off: The game ends when the first player reaches the target score.</p>
          <p>On: After the first player reaches the target score, everyone else gets one turn to try and beat that score.</p>
        </div>
      }
    </div>
  );


}