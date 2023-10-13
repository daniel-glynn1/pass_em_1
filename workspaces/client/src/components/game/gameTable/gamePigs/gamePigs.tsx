import { useRecoilValue } from 'recoil';
import { CurrentLobbyState } from '../../../recoilTypes';
import './gamePigs.css';

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

  let rollName: string = determineRollName(gameState.currentPigIndex1, gameState.currentPigIndex2);
  let winnerName: string = gameState.isFinished && gameState.scores[gameState.winnerId] ? gameState.scores[gameState.winnerId].name : '';

  return (
    <div id="pigInfo">
      {(gameState.isStarted && !gameState.isFinished) && 
        <div id="pigs">
          <img src={pigImages[gameState.currentPigIndex1]}></img>
          <img src={pigImages[gameState.currentPigIndex2]}></img>
        </div>
      }
      
      {(gameState.isStarted && !gameState.isFinished) && 
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
      
      {gameState.isFinished && 
        <div className='tableMessage'>
          <h4>Game Over</h4>
          <h4>{winnerName === '' ? 'No Winner' : winnerName + ' wins!'}</h4>
        </div>
      }
    </div>
  );


}


