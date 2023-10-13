import './gameChat.css';
import { useRecoilValue } from 'recoil';
import { ChatState, CurrentLobbyState } from '../../recoilTypes';
import { useState, useRef, useEffect } from 'react';
import socketService from "../../../services/socketService";
import gameService from "../../../services/gameService";
import send from '../../../assets/send.png';

export function GameChat() {
  const gameState = useRecoilValue(CurrentLobbyState)!;
  const chatState = useRecoilValue(ChatState);
  const [chatMessage, setChatMessage] = useState("");

  const ref = useRef<HTMLDivElement>(null);

  const handleChatMessageChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setChatMessage(value);
  }

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (chatMessage.trim() === '') {
      return;
    }

    if (socketService.socket) {
      gameService.sendChatMessage(
        socketService.socket, 
        chatMessage, 
        gameState.scores[socketService.socket.id].name,
        findIndexById()
        );
    }
    setChatMessage("");

  }

  const findIndexById = (): number => {
    const players = Object.entries(gameState.scores);
    
    for (let i = 0; i < players.length; i++) {
      const [key, value] = players[i];
      if (socketService.socket && key === socketService.socket.id) {
        return i;
      }
    }
    return 100; 
  }
  
  useEffect(() => {
    if (chatState.length) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chatState.length]);
  

  return (
    <div id='chatOuter'>
      <h4 id='chatTitle'>Chat</h4>
      <div id='chatList'>
        {chatState.map((item, index) => (
          <div className='chatMessage'>
            {item.senderCode !== 100 && 
              <p className='chatName'>{item.senderName}</p>
            }
            <p className='chatItem' id={`chatItem-${item.senderCode}`} key={index}>{item.message}</p>
          </div>
        ))}
        <div ref={ref} />
      </div>
      
      <form id='chat' onSubmit={sendChatMessage}>
        <input id='chatinput' type="text" maxLength={100} placeholder="chat" value={chatMessage} onChange={handleChatMessageChange}/>
        <button id='submitchat' type="submit">
          <img id='sendicon' alt='send' src={send} />
        </button>
      </form>

        
    </div>
  );
}