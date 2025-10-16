// Local do arquivo: /client/src/App.tsx

import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './style.css';
import Login from './components/Login';
import Chat from './components/Chat';

const socket = io(import.meta.env.VITE_API_URL);

// Tipos de dados
interface User {
  id: string;
  username: string;
}

interface Message {
  id: string;
  user?: string;
  text: string;
  timestamp?: string;
  type?: 'user' | 'system';
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUser, setTypingUser] = useState('');

  useEffect(() => {
    // --- LÓGICA DE ESCUTA DE EVENTOS DO SOCKET ---
    const handleNewMessage = (newMessage: Message) => {
      setTypingUser('');
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const handleUserListUpdate = (users: User[]) => {
      setOnlineUsers(users);
    };

    const handleLoadHistory = (history: Message[]) => {
      setMessages(history);
    };

    const handleUserTyping = (user: string) => {
      setTypingUser(user);
    };

    const handleUserStopTyping = () => {
      setTypingUser('');
    };

    socket.on('chat_message', handleNewMessage);
    socket.on('update_user_list', handleUserListUpdate);
    socket.on('load_history', handleLoadHistory);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);

    return () => {
      socket.off('chat_message', handleNewMessage);
      socket.off('update_user_list', handleUserListUpdate);
      socket.off('load_history', handleLoadHistory);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stop_typing', handleUserStopTyping);
    };
  }, []);

  // --- FUNÇÕES DE CALLBACK PARA OS COMPONENTES ---
  const handleLogin = (name: string) => {
    setUsername(name);
    setIsLoggedIn(true);
    socket.emit('user_joined', name);
  };

  const handleSendMessage = (messageText: string) => {
    const newMessage: Omit<Message, 'timestamp'> = {
      id: `${socket.id}-${Date.now()}`,
      user: username,
      text: messageText,
      type: 'user',
    };
    socket.emit('chat_message', newMessage);
  };

  const handleTyping = () => {
    socket.emit('typing', username);
  };

  const handleStopTyping = () => {
    socket.emit('stop_typing');
  };

  return (
    <div className="app-wrapper">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat
          currentUser={username}
          messages={messages}
          onlineUsers={onlineUsers}
          typingUser={typingUser}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
        />
      )}
    </div>
  );
}

export default App;