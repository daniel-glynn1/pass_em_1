import React, { useEffect, useState } from 'react';
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import logo from './logo.svg';
import './App.css';
import { io } from 'socket.io-client';
import socketService from './services/socketService';
import { JoinRoom } from './components/joinRoom';
import { Game } from './components/game';
import gameService from './services/gameService';
import { CurrentLobbyState } from './components/gameState';

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
      <h2>Welcome to Pass Em</h2>
      <div>
        {gameState === null ? 
          <JoinRoom /> : 
          <Game />}
      </div>
    </div>
    
  );
}

export default App;
