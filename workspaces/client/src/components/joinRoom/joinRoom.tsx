import React, { useState } from "react";
import socketService from "../../services/socketService";
import gameService from "../../services/gameService";
import './joinRoom.css';

interface IJoinRoomProps {}

export function JoinRoom(props: IJoinRoomProps) {
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
  const [numPlayers, setNumPlayers] = useState(2);
  const [isJoining, setJoining] = useState(false);
  const [isCreator, setCreator] = useState(true);
  const [isSelected, setSelected] = useState(false);

  const handleRoomNameChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setRoomName(value);
  }

  const handleUserNameChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setUserName(value);
  }

  const handleNumPlayersChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setNumPlayers(value);
  }

  const handleUserNameKeyDown = (e: React.KeyboardEvent<any>) => {
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

    setJoining(true);

    if (isCreator) {
      const joined = await gameService
      .createGameRoom(socket, roomName, userName, numPlayers)
      .catch((err) => {
        alert(err);
      });

      if (!joined) {
        return;
      }
    } else {
      const joined = await gameService
      .joinGameRoom(socket, roomName, userName)
      .catch((err) => {
        alert(err);
      });

      if (!joined) {
       return;
      }
    }

    setJoining(false);

  }



  return (
    <div>
      <div id='header'>
        <h2>Pass 'Em</h2>
        <h3>{userName}</h3>
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
              <input type="text" placeholder="name" value={userName} onChange={handleUserNameChange} onKeyDown={handleUserNameKeyDown}/>
            </div>
            <div id='createOrJoin'>
              <p>Do you want to create or join a lobby?</p>
              <div id='buttons'>
                <button id='create' className='select' type="submit" onClick={() => setCreator(true)}>Create Lobby</button>
                <button id='join' className='select' type="submit" onClick={() => setCreator(false)}>Join Lobby</button>
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
            <div id='roomInput'>
              <p>Room Name:</p>
              <input type="text" placeholder="Room Name" value={roomName} onChange={handleRoomNameChange}/>
            </div>
            {isCreator && 
              <div id='numPlayersInput'>
                <p>Number of players (2-8):</p>
                <input type="number" value={numPlayers} min='2' max='8' step='1' onChange={handleNumPlayersChange}/>
            
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