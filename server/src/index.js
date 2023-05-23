require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
require('./db/db');
const server = http.createServer(app);
const { Server } = require('socket.io');
const Message = require('./db/models/Message');

const chalk = require('chalk');

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST'],
  },
  allowEIO3: true,
});

app.use(cors({ credentials: true, origin: true }));

const morganMiddleware = morgan(function (tokens, req, res) {
  return [
    '\n',
    chalk.hex('#34ace0').bold(tokens.method(req, res)),
    chalk.hex('#ffb142').bold(tokens.status(req, res)),
    chalk.hex('#ff5252').bold(tokens.url(req, res)),
    chalk.hex('#2ed573').bold(tokens['response-time'](req, res) + ' ms'),
    chalk.hex('#f78fb3').bold('@ ' + tokens.date(req, res)),
    chalk.yellow(tokens['remote-addr'](req, res)),
    chalk.hex('#fffa65').bold('from ' + tokens.referrer(req, res)),
    chalk.hex('#1e90ff')(tokens['user-agent'](req, res)),
  ].join(' ');
});

app.use(morganMiddleware);

app.use(express.json());

// const corsOptions = {
//   origin:
//     ip.address() == '192.168.0.166'
//       ? 'http://localhost:8888'
//       : process.env.PUBLIC,
//   credentials: true,
// };
// app.options('*', cors(corsOptions));

app.use('/api', require('./api/api'));

io.on('connection', async (socket) => {
  socket.on('newMessage', async (payload) => {
    const message = await Message.findOne({
      _id: payload.message._id,
    }).populate('author');
    if (payload.channel._id == message.channel) {
      io.emit(`newMessage`, message);
    }
  });

  socket.on('editMessage', async (payload) => {
    const message = await Message.findOne({
      _id: payload,
    }).populate('author');

    io.emit(`editMessage`, message);
  });

  socket.on('deleteMessage', async (payload) => {
    io.emit(`messageDeleted`, payload);
  });

  socket.on('updateGuild', async (payload) => {
    io.emit('updateGuild', payload);
  });

  socket.on('updateGuildIcon', async () => {
    io.emit('updateGuildIcon');
  });

  socket.on('userStatusChanged', () => {
    io.emit('userStatusChanged');
  });
});

server.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`);
});
