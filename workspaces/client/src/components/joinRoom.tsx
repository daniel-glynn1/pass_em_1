import React, { useContext, useState } from "react";
import socketService from "../services/socketService";
import gameService from "../services/gameService";

interface IJoinRoomProps {}

export function JoinRoom(props: IJoinRoomProps) {
  const [roomName, setRoomName] = useState("");
  const [isJoining, setJoining] = useState(false);
  const [isCreating, setCreating] = useState(false);
  const [isCreatingOrJoining, setCreatingOrJoining] = useState(true);

  const handleRoomNameChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setRoomName(value);
  }

  const createOrJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isCreatingOrJoining) {
      createRoom()
    } else {
      joinRoom()
    }

  }

  const createRoom = async () => {
    const socket = socketService.socket;
    if (!roomName || roomName.trim() === "" || !socket) return;

    setCreating(true);

    const joined = await gameService
      .createGameRoom(socket, roomName)
      .catch((err) => {
        alert(err);
      });

    setCreating(false);
  }

  const joinRoom = async () => {
    const socket = socketService.socket;
    if (!roomName || roomName.trim() === "" || !socket) return;

    setJoining(true);

    const joined = await gameService
      .joinGameRoom(socket, roomName)
      .catch((err) => {
        alert(err);
      });

    setJoining(false);
  }

  return (
    <div>
      <div>
        <button onClick={() => setCreatingOrJoining(true)}>Create Lobby</button>
        <button onClick={() => setCreatingOrJoining(false)}>Join Lobby</button>
      </div>
      <form onSubmit={createOrJoinRoom}>
        <div>
          <h4>Enter Room ID to join the game</h4>
          <input placeholder="Room ID" value={roomName} onChange={handleRoomNameChange}/>
          <button type="submit" disabled={isJoining || isCreating}>
            {isCreatingOrJoining ? 
              (isCreating ? "Creating..." : "Create") :
              (isJoining ? "Joining..." : "Join")}
          </button>
        </div>
      </form>
    </div>
    
  );

}