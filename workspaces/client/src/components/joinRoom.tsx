import React, { useContext, useState } from "react";
import socketService from "../services/socketService";
import gameService from "../services/gameService";

interface IJoinRoomProps {}

export function JoinRoom(props: IJoinRoomProps) {
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
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
      .createGameRoom(socket, roomName, userName)
      .catch((err) => {
        alert(err);
      });
    } else {
      const joined = await gameService
      .joinGameRoom(socket, roomName, userName)
      .catch((err) => {
        alert(err);
      });
    }

    setJoining(false);

  }



  return (
    <div>
      {!isSelected ? (
        <div>
          <form onSubmit={createOrJoinSelected}>
            <input placeholder="User Name" value={userName} onChange={handleUserNameChange}/>
            <button type="submit" onClick={() => setCreator(true)}>Create Lobby</button>
            <button type="submit" onClick={() => setCreator(false)}>Join Lobby</button>
          </form>
        </div>
      ) : (
        <div>
          <form onSubmit={createOrJoinRoom}>
            <h4>Room Name:</h4>
            <input placeholder="Room Name" value={roomName} onChange={handleRoomNameChange}/>
            <button type="submit" disabled={isJoining}>
              {isCreator ? 
                (isJoining ? "Creating..." : "Create") :
                (isJoining ? "Joining..." : "Join")}
            </button>
          </form>
        </div>
      )}
      
      
    </div>
    
  );

}