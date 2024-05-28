import React, { useState } from "react";
import socketService from "../../../services/socketService";
import gameService from "../../../services/gameService";
import { useRecoilValue, useRecoilState } from 'recoil';

import './joinRoom.css';
import { FinalScoreSelector } from "../finalScoreSelector/finalScoreSelector";
import { NumPlayersSelector } from "../numPlayersSelector/numPlayersSelector";
import { FinalScoreState, IsRandomLobbyState, NumPlayersState, RebuttalState, UserNameState } from "../../recoilTypes";
import { RebuttalSelector } from "../rebuttalSelector/rebuttalSelector";
import passemlogo from '../../../assets/passemlogo.png';


interface IJoinRoomProps {}

export function JoinRoom(props: IJoinRoomProps) {
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [userName, setUserName] = useRecoilState(UserNameState);
  const [isRandomLobby, setRandomLobby] = useRecoilState(IsRandomLobbyState);


  const numPlayers = useRecoilValue(NumPlayersState)!;
  const finalScore = useRecoilValue(FinalScoreState)!;
  const isRebuttal = useRecoilValue(RebuttalState)!;

  const [isJoining, setJoining] = useState(false);
  const [isCreator, setCreator] = useState(true);
  const [isSelected, setSelected] = useState(false);

  const handleUserNameChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setUserName(value);
  }
  const handleUserNameKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  const handleRoomNameChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setRoomName(value);
  }
  const handleRoomNameKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  const handleRoomPasswordChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setRoomPassword(value);
  }
  const handleRoomPasswordKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  const createOrJoinSelected = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || userName.trim() === "") {
      alert("Enter a user name!");
      return;
    }
    
    setSelected(true);
  }

  const createOrJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    const socket = socketService.socket;
    if (!socket) return;
    if (!roomName || roomName.trim() === "") {
      alert("Enter a room name!");
      return;
    }
    if (!roomPassword || roomPassword.trim() === "") {
      alert("Enter a password!");
      return;
    }

    setJoining(true);

    if (isCreator) {
      const joined = await gameService
      .createGameRoom(socket, roomName, roomPassword, userName, numPlayers, finalScore, isRebuttal)
      .catch((err) => {
        alert(err);
      });

    } else {
      const joined = await gameService
      .joinGameRoom(socket, roomName, roomPassword, userName)
      .catch((err) => {
        alert(err);
      });
      
    }

    setJoining(false);

  }

  const joinRandomRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    const socket = socketService.socket;
    if (!socket) return;

    if (!userName || userName.trim() === "") {
      alert("Enter a user name!");
      return;
    }

    setJoining(true);


    const joined = await gameService
    .joinRandomGameRoom(socket, userName)
    .catch((err) => {
      alert(err);
    });

    setJoining(false);
    setRandomLobby(true);

  }



  return (
    <div id='joinBox'>
      <div id='joinHeader'>
        <div id='titleLogo'>
          <img id='logo' alt='logo' src={passemlogo} />
          <h2>Pass 'Em</h2>
          
        </div>
        
        
        <h4>{userName}</h4>
      </div>
      
      <div id='outer'>
      {!isSelected ? (
        <div className="inner">
          <form id='select' onSubmit={createOrJoinSelected} >
            <div id='welcome'>
              <h2>Welcome to Pass 'Em</h2>
              <h3>A Free Online Alternative to Pass the Pigs</h3>
            </div>
            <div id='nameInput'>
              <p>Enter your name</p>
              <input type="text" maxLength={15} placeholder="name" value={userName}  required onChange={handleUserNameChange} onKeyDown={handleUserNameKeyDown}/>
            </div>
            <div id='createOrJoin'>
              <p>Do you want to create or join a lobby?</p>
              <div id='buttonsOuter'>
                <div id='buttons'>
                  <button id='create' className='select' type="submit" onClick={() => setCreator(true)}>Create Lobby</button>
                  <button id='join' className='select' type="submit" onClick={() => setCreator(false)}>Join Lobby</button>
                </div>
                <button id='joinRandom' className='select' type="button" onClick={joinRandomRoom} disabled={isJoining}>Join Random Lobby</button>

              </div>
            </div>
            
          </form>
        </div>
      ) : (
        <div className="inner">
          <form id='start' onSubmit={createOrJoinRoom}>
            <button id='goback' onClick={() => setSelected(false)} disabled={isJoining}> 
              Go back
            </button>
            <div className='roomInput'>
              <p className='roomNameText'>Room Name:</p>
              <input type="text" required maxLength={15} placeholder="Room Name" value={roomName} onChange={handleRoomNameChange} onKeyDown={handleRoomNameKeyDown}/>
            </div>
            <div className='roomInput'>
              <p className='roomNameText'>Room Password:</p>
              <input type="password" required maxLength={15} placeholder="Password" value={roomPassword} onChange={handleRoomPasswordChange} onKeyDown={handleRoomPasswordKeyDown}/>
            </div>
            {isCreator &&
              <div id='creationOptions'>
                <NumPlayersSelector />
                <FinalScoreSelector />
                <RebuttalSelector />
              </div>
              
            }
            <button id='start' className={isCreator ? "createStart" : "createJoin"} type="submit" disabled={isJoining}>
              {isCreator ? 
                (isJoining ? "Creating..." : "Create") :
                (isJoining ? "Joining..." : "Join")}
            </button>
          </form>
        </div>
      )}
      </div>
    </div>
    
  );

}