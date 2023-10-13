import { RebuttalState } from '../../recoilTypes';
import { useRecoilState } from 'recoil';
import './rebuttalSelector.css';



export function RebuttalSelector() {
  const [rebuttalState, setRebuttalState] = useRecoilState(RebuttalState);

  const rebuttalOptions = [false, true];

  const handleScoreSelected = (isOn: boolean) => {
    setRebuttalState(isOn);
  };

  return (
    <div id='rebuttalOuter'>
      <p id='rebuttalText'>
        Chance for Rebuttal:
      </p>
      <div id='rebuttalOptions'>
        {rebuttalOptions.map((option, index) => (
          <button className='rebuttalOption' id={option === rebuttalState ? 'selected' : 'unselected'} type="button" key={index} onClick={() => handleScoreSelected(option)}>
            <p>{option ? 'On' : 'Off'}</p>
          </button>
        ))}
      </div>
    </div>
  );


}