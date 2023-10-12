import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { ShowMenuState, ChatState, CurrentLobbyState } from '../recoilTypes';
import gameService from '../../../services/gameService';
import socketService from '../../../services/socketService';


import './gameTable.css';

const pigImages = [
  require('../../../assets/pigs/pig0.png'),
  require('../../../assets/pigs/pig1.png'),
  require('../../../assets/pigs/pig2.png'),
  require('../../../assets/pigs/pig3.png'),
  require('../../../assets/pigs/pig4.png'),
  require('../../../assets/pigs/pig5.png'),
];




export function GameTable() {
  const gameState = useRecoilValue(CurrentLobbyState)!;
  const setGameState = useSetRecoilState(CurrentLobbyState);
  const [chatState, setChatState] = useRecoilState(ChatState);
  const [isShowMenu, setShowMenu] = useRecoilState(ShowMenuState);

  let players = Object.entries(gameState.scores);

  const pigNameMap: Map<number, string> = new Map<number, string>([
    [0, ''],
    [1, ''],
    [2, 'Razorback'],
    [3, 'Trotter'],
    [4, 'Snouter'],
    [5, 'Leaning Jowler']
  ]);

  const isPlayerTurn = (index: number): boolean => {
    const [key, value] = players[index]
    return gameState.currentTurnPlayer === key;
  }

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

  const calculateWinner = () => {
    let maxScore: number = 0;
    let maxName: string = '';
    for (const key in gameState.scores) {
      if (gameState.scores.hasOwnProperty(key)) {
        const value = gameState.scores[key];
        if (value.score > maxScore) {
          maxScore = value.score;
          maxName = value.name;
        }
      }
    }

    if (maxScore >= 100) {
      return maxName;
    }

    return '';

  }


  const handleLeaveButton = async () => {
    if (socketService.socket) {
      const left = await gameService
      .leaveGameRoom(socketService.socket)
      .catch((err) => {
        alert(err);
      });
      
      setGameState(null);
      setChatState([]);

    }
  }

  let rollName: string = determineRollName(gameState.currentPigIndex1, gameState.currentPigIndex2);
  let winnerName: string = calculateWinner();

  return (
    <div id="tableOuter">
      {isShowMenu && 
      <div id='menu'>
        <div id='menuInner'>
          <button id='leave' onClick={() => handleLeaveButton()} >Leave</button>
        </div>
      </div>
      }
      <div id="tableWithPlayers">
        <div id="table">
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