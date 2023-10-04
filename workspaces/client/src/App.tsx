import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import './App.css';
import socketService from './services/socketService';
import { JoinRoom } from './components/joinRoom/joinRoom';
import { Game } from './components/game/game';
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

  useEffect(() => {
    if (!socketService.socket) {
      connectSocket();
    }
      
    handleGameUpdate();
  }, []);

  return (
    
    <div>
      <div>
        {gameState === null ? 
          <JoinRoom /> : 
          <Game />}
      </div>
    </div>
    
  );
}

export default App;
