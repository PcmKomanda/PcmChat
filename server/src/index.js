require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./db/db');
const server = http.createServer(app);
const { Server } = require('socket.io');
const Message = require('./db/models/Message');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST'],
  },
  allowEIO3: true,
});

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', require('./api/api'));

let online = new Set();

io.on('connection', (socket) => {
  socket.on('newUser', async (payload) => {
    online.add(payload);
    socket.emit('setOnline', online.size);
    socket.emit('setMessages', await getMessages());
  });
  socket.on('newMessage', async (payload) => {
    console.log(payload);
    const message = await (await Message.create(payload)).populate('author');
    io.emit('newMessage', message);
    socket.broadcast.emit('newMessage', message);
  });
});

io.sockets.on('connection', function (socket) {
  socket.on('disconnect', function () {
    online = new Set([...online].filter((u) => u.socket_id !== socket.id));
    socket.broadcast.emit('setOnline', online.size);
  });
});

async function getMessages() {
  const messages = await Message.find().populate('author');
  return messages;
}

server.listen(3000, () => {
  console.log('listening on *:3000');
});
