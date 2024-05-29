import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import './App.css';
import socketService from './services/socketService';
import { JoinRoom } from './components/joinRoom/joinRoom/joinRoom';
import { Game } from './components/game/game/game';
import gameService from './services/gameService';
import { ChatState, CurrentLobbyState, NewChatState, Rolling1State, Rolling2State } from './components/recoilTypes';
import { ServerEvents } from './shared/types/serverEvents';
import { ServerPayloads } from './shared/types/serverPayloads';

function App() {
  const [gameState, setGameState] = useRecoilState(CurrentLobbyState);
  const [chatState, setChatState] = useRecoilState(ChatState);
  const [isNewChat, setNewChat] = useRecoilState(NewChatState);
  const [isRolling1, setIsRolling1] = useRecoilState(Rolling1State);
  const [isRolling2, setIsRolling2] = useRecoilState(Rolling2State);


  const messageListener = (data: ServerPayloads[ServerEvents.GameMessage]) => {
    setChatState((oldChat: ServerPayloads[ServerEvents.GameMessage][]) => [...oldChat, data]);
    if (data.senderCode != 100) {
      setNewChat(true);
    }
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

  const startRollListener = () => {
    setIsRolling1(true);
    
    // roll animation for 2 seconds
    setTimeout(() => {
      setIsRolling1(false);

      setIsRolling2(true);
      setTimeout(() => {
        setIsRolling2(false);
      }, 750);

    }, 2000);
  }

  const handleStartRoll = () => {
    if (socketService.socket) {
      gameService.onStartRoll(socketService.socket, startRollListener);
    }
  }

  const removeStartRoll = () => {
    if (socketService.socket) {
      gameService.offStartRoll(socketService.socket, startRollListener);
    }
  }


  const connectSocket = async () => {
    const socket = await socketService
      .connect("https://pass-em-api.onrender.com")
      // .connect("http://localhost:4000")
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
    window.onbeforeunload = function(event)
    {
      return window.confirm("Confirm refresh");
    };
    
    if (!socketService.socket) {
      connectSocket();
    }
      
    handleGameUpdate();
    handleGameMessage();
    handleStartRoll();

    return () => {
      removeGameUpdate();
      removeGameMessage();
      removeStartRoll();
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
