// Local do arquivo: /client/src/components/MessageList.tsx

import { useEffect, useRef } from 'react';

// Definindo a "forma" de uma mensagem
interface Message {
    id: string;
    user?: string; // Opcional para mensagens de sistema
    text: string;
    timestamp?: string; // Opcional, pois mensagens de sistema podem não ter
    type?: 'user' | 'system'; // Para diferenciar a estilização
}

interface MessageListProps {
    messages: Message[];
    currentUser: string;
}

function MessageList({ messages, currentUser }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="messages-list">
            {messages.map((msg) => {
                if (msg.type === 'system') {
                    return (
                        <div key={msg.id} className="message-item system-message">
                            {msg.text}
                        </div>
                    );
                }

                const isMyMessage = msg.user === currentUser;
                return (
                    <div
                        key={msg.id}
                        className={`message-item ${isMyMessage ? 'my-message' : 'other-message'}`}
                    >
                        <div className="message-header">
                            <strong>{isMyMessage ? 'Você' : msg.user}</strong>
                            <span className="timestamp">{msg.timestamp && formatTimestamp(msg.timestamp)}</span>
                        </div>
                        <p>{msg.text}</p>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default MessageList;