// Local do arquivo: /client/src/components/Login.tsx

import { useState } from 'react';

// Definimos os tipos das props que o componente vai receber
interface LoginProps {
    onLogin: (username: string) => void;
}

function Login({ onLogin }: LoginProps) {
    const [username, setUsername] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username.trim());
        }
    };

    return (
        <div className="username-container">
            <h1>Bem-vindo ao Fórum em Tempo Real</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Digite seu nome de usuário"
                    autoFocus
                />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default Login;