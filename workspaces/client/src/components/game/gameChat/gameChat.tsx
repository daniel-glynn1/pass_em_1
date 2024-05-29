import './gameChat.css';
import { useRecoilValue, useRecoilState } from 'recoil';
import { ChatState, CurrentLobbyState, ShowChatState, NewChatState } from '../../recoilTypes';
import { useState, useRef, useEffect } from 'react';
import socketService from "../../../services/socketService";
import gameService from "../../../services/gameService";
import send from '../../../assets/send.png';
import x from '../../../assets/x.png';


export function GameChat() {
  const gameState = useRecoilValue(CurrentLobbyState)!;
  const chatState = useRecoilValue(ChatState);
  const [isShowChat, setShowChat] = useRecoilState(ShowChatState);
  const [chatMessage, setChatMessage] = useState("");
  const [isNewChat, setNewChat] = useRecoilState(NewChatState);


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

  const handleCloseButtonClick = () => {
    setShowChat(false);
    setNewChat(false);
  };

  
  useEffect(() => {
    if (chatState.length) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chatState.length]);
  

  return (
    <div id={isShowChat ? 'chatOuterSidebar' : 'chatOuter'}>
      <div id={isShowChat ? 'chatHeaderSidebar' : 'chatHeader'}>
        <h4 id='chatTitle'>Chat</h4>
        { isShowChat && 
          <button id='closebutton' onClick={handleCloseButtonClick}>
            <img id='closeicon' alt='close' src={x} />
          </button>
        }
        
      </div>
      
      <div id='chatList'>
        {chatState.map((item, index) => (
          <div key={index} className='chatMessage'>
            {item.senderCode !== 100 && 
              <p className='chatName'>{item.senderName}</p>
            }
            <p className='chatItem' id={`chatItem-${item.senderCode}`} key={index}>{item.message}</p>
          </div>
        ))}
        <div ref={ref} />
      </div>
      
      <form id='chat' onSubmit={sendChatMessage}>
        <input id='chatinput' type="text" maxLength={100} placeholder="say something" value={chatMessage} onChange={handleChatMessageChange}/>
        <button id='submitchat' type="submit">
          <img id='sendicon' alt='send' src={send} />
        </button>
      </form>

        
    </div>
  );
}