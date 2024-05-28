import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { ShowRulesState } from '../../../recoilTypes';
import './gameRules.css';
import x from '../../../../assets/x.png';

const pigImages = [
  require('../../../../assets/pigs/pig0.png'),
  require('../../../../assets/pigs/pig1.png'),
  require('../../../../assets/pigs/pig2.png'),
  require('../../../../assets/pigs/pig3.png'),
  require('../../../../assets/pigs/pig4.png'),
  require('../../../../assets/pigs/pig5.png'),
];

export function GameRules() {
  const [isShowRules, setShowRules] = useRecoilState(ShowRulesState);

  const handleCloseClick = () => {
    setShowRules(false);
  };

  return (
    <div id='gameRules'>
      <div id='rulesHeader'>
        <h3 id='rulesTitle'>Rules</h3>
        <button id='close' onClick={handleCloseClick}>
          <img id='closeicon' alt='close' src={x} />
        </button>
      </div>
      <div id='rulesExplanation'>
        <p>On your turn: </p>
        <p className='indent'>Roll as many as times as you want until you decide to pass or roll a pig out! (see below)</p>
        <p>To win: </p>
        <p className='indent'>Reach the target score before anyone else OR If Rebuttal is on, have the most total points after the final turn.</p>
        <p>Scoring:</p>
      </div>

      <div id='scoring'>
        <div className='scoringRow'>
          <div className='scoringExample'>
            <div id="pigs">
              <img className='pigImageRules' id='pig-0' src={pigImages[0]} alt={'pig0'}></img>
              <img className='pigImageRules' id='pig-1' src={pigImages[1]} alt={'pig1'}></img>
            </div>
            <div id='pigScore'>
              <p id='rollNameRules'>Pig Out!</p>
              <p id='rollScoreRules' className='asterix'>0*</p>
            </div>
          </div>

          <div className='scoringExample'>
            <div id="pigs">
              <img className='pigImageRules' id='pig-0' src={pigImages[0]} alt={'pig0'}></img>
              <img className='pigImageRules' id='pig-0' src={pigImages[0]} alt={'pig0'}></img>
            </div>
            <div id='pigScore'>
              <p id='rollNameRules'></p>
              <p id='rollScoreRules'>0</p>
            </div>
          </div>

          <div className='scoringExample'>
            <div id="pigs">
              <img className='pigImageRules' id='pig-1' src={pigImages[1]} alt={'pig1'}></img>
              <img className='pigImageRules' id='pig-1' src={pigImages[1]} alt={'pig1'}></img>
            </div>
            <div id='pigScore'>
              <p id='rollNameRules'>Sider</p>
              <p id='rollScoreRules'>1</p>
            </div>
          </div>

          <div className='scoringExample'>
            <div id="pigs">
              <img className='pigImageRules' id='pig-2' src={pigImages[2]} alt={'pig2'}></img>
              <img className='pigImageRules' id='pig-2' src={pigImages[2]} alt={'pig2'}></img>
            </div>
            <div id='pigScore'>
              <p id='rollNameRules'>Double</p>
              <p className='double' id='rollScoreRules'>x2*</p>
            </div>
          </div>
        </div>
        <div className='scoringRow'>
          <div className='scoringExample'>
            <div id="pigs">
              <img className='pigImageRules' id='pig-2' src={pigImages[2]} alt={'pig2'}></img>
              <img className='pigImageRules' id='pig-0' src={pigImages[0]} alt={'pig0'}></img>
            </div>
            <div id='pigScore'>
              <p id='rollNameRules'>Razorback</p>
              <p id='rollScoreRules'>5</p>
            </div>
          </div>

          <div className='scoringExample'>
            <div id="pigs">
              <img className='pigImageRules' id='pig-3' src={pigImages[3]} alt={'pig3'}></img>
              <img className='pigImageRules' id='pig-0' src={pigImages[0]} alt={'pig0'}></img>
            </div>
            <div id='pigScore'>
              <p id='rollNameRules'>Trotter</p>
              <p id='rollScoreRules'>5</p>
            </div>
          </div>

          <div className='scoringExample'>
            <div id="pigs">
              <img className='pigImageRules' id='pig-4' src={pigImages[4]} alt={'pig4'}></img>
              <img className='pigImageRules' id='pig-0' src={pigImages[0]} alt={'pig0'}></img>
            </div>
            <div id='pigScore'>
              <p id='rollNameRules'>Snouter</p>
              <p id='rollScoreRules'>10</p>
            </div>
          </div>

          <div className='scoringExample'>
            <div id="pigs">
              <img className='pigImageRules' id='pig-5' src={pigImages[5]} alt={'pig5'}></img>
              <img className='pigImageRules' id='pig-0' src={pigImages[0]} alt={'pig0'}></img>
            </div>
            <div id='pigScore'>
              <p id='rollNameRules'>Leaning Jowler</p>
              <p id='rollScoreRules'>15</p>
            </div>
          </div>
        </div>
        
      </div>

      <p id='asterixExplanation'>*Lose all points for this turn and pass</p>
      <p id='asterixExplanation2'>*If both pigs are the same roll, this roll's points are doubled (e.g. 2 Razorbacks = (5+5)*2 = 20).</p>


    </div>
  );


}