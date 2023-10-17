import { useRecoilValue, useRecoilState } from 'recoil';
import { CurrentLobbyState, Rolling1State, Rolling2State } from '../../../recoilTypes';
import './gamePigs.css';
import { useState, useEffect } from 'react';

const pigImages = [
  require('../../../../assets/pigs/pig0.png'),
  require('../../../../assets/pigs/pig1.png'),
  require('../../../../assets/pigs/pig2.png'),
  require('../../../../assets/pigs/pig3.png'),
  require('../../../../assets/pigs/pig4.png'),
  require('../../../../assets/pigs/pig5.png'),
];


export function GamePigs() {
  const gameState = useRecoilValue(CurrentLobbyState)!;
  const [isRolling1, setIsRolling1] = useRecoilState(Rolling1State);
  const [isRolling2, setIsRolling2] = useRecoilState(Rolling2State);
  const [pig1RollIndex, setPig1RollIndex] = useState(0);
  const [pig2RollIndex, setPig2RollIndex] = useState(0);


  const pigNameMap: Map<number, string> = new Map<number, string>([
    [0, ''],
    [1, ''],
    [2, 'Razorback'],
    [3, 'Trotter'],
    [4, 'Snouter'],
    [5, 'Leaning Jowler']
  ]);

  const determineRollName = (pig1: number, pig2: number): string => {
    var name = "";

    if ((pig1 === 0 && pig2 === 1) || (pig1 === 1 && pig2 === 0)) {
      name = "Pig Out!";
    } else if (pig1 === 0 && pig2 === 0) {
      name = "";
    } else if (pig1 === 1 && pig2 === 1) {
      name = "Sider";
    } else if (pig1 === pig2) {
      name += "Double " + pigNameMap.get(pig1);
    } else {

      let isPig1Named: boolean = pigNameMap.get(pig1) !== ''
      let isPig2Named: boolean = pigNameMap.get(pig2) !== ''

      if (isPig1Named) {
        name += pigNameMap.get(pig1);

        if (isPig2Named) {
          name += ' + ' + pigNameMap.get(pig2)
        }
      } else {
        if (isPig2Named) {
          name += pigNameMap.get(pig2)
        }
      }

    }

    return name;

  }

  const getPig1Index = (): number => {
    if (isRolling1) {
      return pig1RollIndex;
    } else {
      return gameState.currentPigIndex1;
    }
  }

  const getPig2Index = (): number => {
    if (isRolling1) {
      return pig2RollIndex;
    } else {
      return gameState.currentPigIndex2;
    }
  }

  const getRandomPig = (): number => {
    let num = Math.floor(Math.random() * 1000);
    if (num < 5) {                                  // 0.5% Jowler
      return 5;
    } else if (num < 5 + 25) {                      // 2.5% Snouter 
      return 4;
    } else if (num < 5 + 25 + 100) {                // 10.0% Trotter
      return 3;
    } else if (num < 5 + 25 + 100 + 200) {          // 20.0% Razorback
      return 2;
    } else if (num < 5 + 25 + 100 + 200 + 350) {    // 35.0% Side dot up
      return 1;
    } else {                                        // 32.0% Side dot down
      return 0; 
    }
  }

  let rollName: string = determineRollName(gameState.currentPigIndex1, gameState.currentPigIndex2);
  let isRolling = isRolling1 || isRolling2;


  useEffect(() => {
    if (isRolling1) {
      const totalRollTime = 2000; // Total spinning time (2 seconds)
      let elapsedTime = 0;
      let imageSwitchInterval = 50; 

      const switchImage = () => {
        setPig1RollIndex(getRandomPig());
        setPig2RollIndex(getRandomPig());
        elapsedTime += imageSwitchInterval;

        if (elapsedTime < totalRollTime - 200) {
          imageSwitchInterval += 50;
          setTimeout(switchImage, imageSwitchInterval);
        }
      };

      setTimeout(switchImage, imageSwitchInterval);

    } 


  }, [isRolling1]);
 

  return (
    <div id="pigInfo">
      {(gameState.isStarted) && 
        <div id="pigs">
          <img 
            className={`pigImage ${isRolling1 ? 'spin1' : isRolling2 ? ('spin2-' + gameState.currentPigIndex1) :''} ${'roll-' + gameState.currentPigIndex1}`} 
            src={pigImages[getPig1Index()]}
            alt={'pig' + getPig1Index()}>
          </img>
          <img 
            className={`pigImage ${isRolling1 ? 'spin1' : isRolling2 ? ('spin2-' + gameState.currentPigIndex2) :''} ${'roll-' + gameState.currentPigIndex2}`} 
            src={pigImages[getPig2Index()]}
            alt={'pig' + getPig1Index()}>
          </img>
        </div>
      }
      
      {(gameState.isStarted && !isRolling) && 
        <div id='pigScore'>
          <p id='rollName'>{rollName}</p>
          <p id='rollScore'>{gameState.currentRollScore}</p>
        </div>
      }

      {!gameState.isStarted && 
        <div className='tableMessage'>
          <h4 id='roomName'>{gameState.lobbyName}</h4>
          <h4>Waiting for players to join ({gameState.numPlayers}/{gameState.maxNumPlayers})... </h4>
          
        </div>
      }
    </div>
  );


}


