import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import './App.css';
import socketService from './services/socketService';
import { JoinRoom } from './components/joinRoom/joinRoom';
import { Game } from './components/game/game/game';
import gameService from './services/gameService';
import { CurrentLobbyState } from './components/game/gameStateType';

function App() {
  const [gameState, setGameState] = useRecoilState(CurrentLobbyState);


  const connectSocket = async () => {
    const socket = await socketService
      .connect("http://localhost:9000")
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  const handleGameUpdate = () => {
    if (socketService.socket) {
      gameService.onGameUpdate(socketService.socket, (data) => {
        setGameState(data);
      });
    }
  }

  const removeGameUpdate = () => {
    if (socketService.socket) {
      gameService.offGameUpdate(socketService.socket, () => {});
    }
  }
  

  useEffect(() => {
    // window.onbeforeunload = function(event)
    // {
    //     return window.confirm("Confirm refresh");
    // };

    if (!socketService.socket) {
      connectSocket();
    }
      
    handleGameUpdate();

    return () => {
      removeGameUpdate();
    }
  }, []);

  return (
    <div id="app">
      {gameState === null ? 
        <JoinRoom /> : 
        <Game />}
    </div>
    
  );
}

export default App;
