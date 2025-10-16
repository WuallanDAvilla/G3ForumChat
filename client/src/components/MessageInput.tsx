// Local do arquivo: /client/src/components/MessageInput.tsx

import { useState, useRef } from 'react';

interface MessageInputProps {
    onSendMessage: (messageText: string) => void;
    onTyping: () => void;
    onStopTyping: () => void;
}

function MessageInput({ onSendMessage, onTyping, onStopTyping }: MessageInputProps) {
    const [message, setMessage] = useState('');
    const typingTimeoutRef = useRef<number | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        onTyping();

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            onStopTyping();
        }, 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            onStopTyping();
        }
    };

    return (
        <form className="message-form" onSubmit={handleSubmit}>
            <input
                type="text"
                value={message}
                onChange={handleInputChange}
                placeholder="Digite sua mensagem..."
                autoFocus
            />
            <button type="submit">Enviar</button>
        </form>
    );
}

export default MessageInput;