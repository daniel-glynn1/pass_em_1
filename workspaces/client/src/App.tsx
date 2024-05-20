import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import './App.css';
import socketService from './services/socketService';
import { JoinRoom } from './components/joinRoom/joinRoom/joinRoom';
import { Game } from './components/game/game/game';
import gameService from './services/gameService';
import { ChatState, CurrentLobbyState } from './components/recoilTypes';
import { ServerEvents } from './shared/types/serverEvents';
import { ServerPayloads } from './shared/types/serverPayloads';

function App() {
  const [gameState, setGameState] = useRecoilState(CurrentLobbyState);
  const [chatState, setChatState] = useRecoilState(ChatState);

  const messageListener = (data: ServerPayloads[ServerEvents.GameMessage]) => {
    setChatState((oldChat: ServerPayloads[ServerEvents.GameMessage][]) => [...oldChat, data]);
  }

  const handleGameMessage = () => {
    if (socketService.socket) {
      gameService.onGameMessage(socketService.socket, messageListener);
    }
  }

  const removeGameMessage = () => {
    if (socketService.socket) {
      gameService.offGameMessage(socketService.socket, messageListener);
    }
  }


  const connectSocket = async () => {
    const socket = await socketService
      .connect("https://pass-em-api.onrender.com")
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
      gameService.offGameUpdate(socketService.socket, (data) => {
        setGameState(data);
      });
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
    handleGameMessage();

    return () => {
      removeGameUpdate();
      removeGameMessage();
      socketService.socket?.off(ServerEvents.GameMessage);
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
