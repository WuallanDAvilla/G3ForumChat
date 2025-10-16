// Local do arquivo: /client/src/components/Chat.tsx

import UserList from './UserList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

// Tipos para as props
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

interface ChatProps {
    currentUser: string;
    messages: Message[];
    onlineUsers: User[];
    typingUser: string;
    onSendMessage: (messageText: string) => void;
    onTyping: () => void;
    onStopTyping: () => void;
}

function Chat({
    currentUser,
    messages,
    onlineUsers,
    typingUser,
    onSendMessage,
    onTyping,
    onStopTyping,
}: ChatProps) {
    return (
        <div className="app-container">
            <UserList users={onlineUsers} />
            <main className="main-chat">
                <header className="chat-header">
                    <h1>Chat Principal</h1>
                </header>
                <MessageList messages={messages} currentUser={currentUser} />
                <div className="typing-indicator">
                    {typingUser && `${typingUser} está digitando...`}
                </div>
                <MessageInput
                    onSendMessage={onSendMessage}
                    onTyping={onTyping}
                    onStopTyping={onStopTyping}
                />
            </main>
        </div>
    );
}

export default Chat;