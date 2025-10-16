// Local do arquivo: /server/index.js

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const messageHistory = [];
// Usaremos um objeto para rastrear usuários online. A chave será o socket.id.
const onlineUsers = {};

const createSystemMessage = (text) => {
  return {
    id: `system-${Date.now()}`,
    type: "system", // Adicionamos um tipo para diferenciar no frontend
    text,
  };
};

io.on("connection", (socket) => {
  console.log(`✅ Usuário conectado: ${socket.id}`);

  // Envia o histórico de mensagens existente para o novo usuário
  socket.emit("load_history", messageHistory);
  // Envia a lista de usuários já conectados
  socket.emit("update_user_list", Object.values(onlineUsers));

  // Evento para quando um usuário define seu nome e "entra" no chat
  socket.on("user_joined", (username) => {
    // Armazena o usuário
    onlineUsers[socket.id] = { id: socket.id, username };
    console.log(`${username} entrou no chat.`);

    // Cria e armazena a mensagem de sistema
    const joinMessage = createSystemMessage(`${username} entrou na sala.`);
    messageHistory.push(joinMessage);

    // Notifica todos os clientes (incluindo quem entrou) sobre a entrada
    io.emit("chat_message", joinMessage);
    // Notifica todos os clientes sobre a nova lista de usuários
    io.emit("update_user_list", Object.values(onlineUsers));
  });

  // Evento para quando uma nova mensagem de chat é enviada
  socket.on("chat_message", (data) => {
    // Adicionamos o timestamp no servidor para garantir consistência
    const messageWithTimestamp = {
      ...data,
      timestamp: new Date(), // Adiciona a data e hora atual
    };
    messageHistory.push(messageWithTimestamp);
    io.emit("chat_message", messageWithTimestamp);
  });

  // Gerenciamento do "usuário digitando"
  socket.on("typing", (username) => {
    socket.broadcast.emit("user_typing", username);
  });

  socket.on("stop_typing", () => {
    socket.broadcast.emit("user_stop_typing");
  });

  // Evento para quando o cliente se desconecta
  socket.on("disconnect", () => {
    console.log(`❌ Usuário desconectado: ${socket.id}`);
    const disconnectedUser = onlineUsers[socket.id];

    if (disconnectedUser) {
      console.log(`${disconnectedUser.username} saiu do chat.`);
      delete onlineUsers[socket.id]; // Remove o usuário da lista

      const leaveMessage = createSystemMessage(
        `${disconnectedUser.username} saiu da sala.`
      );
      messageHistory.push(leaveMessage);

      // Notifica os clientes restantes sobre a saída e a nova lista de usuários
      io.emit("chat_message", leaveMessage);
      io.emit("update_user_list", Object.values(onlineUsers));
    }
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
