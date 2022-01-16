import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import http from 'http';
import { client } from './utils/database';
import WebSocket from 'ws';
import wss from './utils/wss';

const app = express();

const server = http.createServer(app);

wss.server = new WebSocket.Server({ noServer: true });

server.on('upgrade', function upgrade(request, socket, head) {
  if (!request.url) {
    socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
    socket.destroy();
    return;
  }

  const sender = new URL(request.url, `http://${request.headers.host}`).searchParams.get('sender');

  if (!sender) {
    socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
    socket.destroy();
    return;
  }

  wss.server?.handleUpgrade(request, socket, head, function done(ws) {
    // @ts-ignore
    ws.sender = parseInt(sender);

    wss.server?.emit('connection', ws, request, wss.server);
  });
});

app.use(cors());
app.use(express.json());

import { messagesRouter } from './routes/messages';
app.use('/messages', messagesRouter);

const port = process.env.PORT || 3030;
server.listen(port, async () => {
  await client.connect();

  console.log('Server is running on port', port);
});
