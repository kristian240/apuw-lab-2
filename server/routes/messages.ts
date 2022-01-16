import { Router } from 'express';
import WebSocket from 'ws';
import { client } from '../utils/database';
import wss from '../utils/wss';

const router = Router();

const newestMessage = {
  0: null as IMessage | null,
  1: null as IMessage | null,
};

interface IMessage {
  _id?: string;
  message: string;
  time: string;
  sender: 0 | 1;
}

type listener = (message: IMessage) => void;
const listeners: { 0: Array<listener>; 1: Array<listener> } = {
  0: [],
  1: [],
};

router.get('/', async (_, res) => {
  const messages = await client.db('apuw-lab-2').collection('messages').find({}).toArray();

  return res.json({
    data: messages,
  });
});

router.post('/', async (req, res) => {
  const message = req.body;
  await client.db('apuw-lab-2').collection('messages').insertOne(message);

  // poll
  newestMessage[message.sender as 0 | 1] = message;

  // long-poll
  listeners[message.sender as 0 | 1].forEach((listener) => {
    listener(message);
  });
  listeners[message.sender as 0 | 1] = [];

  // socket
  wss.server?.clients.forEach(function each(ws) {
    //@ts-ignore
    if (ws.sender !== message.sender) {
      ws.send(JSON.stringify(message));
    }
  });

  return res.status(201).end();
});

router.get('/poll', async (req, res) => {
  const sender = req.query.sender as string;

  if (!sender) {
    return res.status(400).end();
  }

  const receiver = sender === '0' ? 1 : 0;

  res.json({ data: newestMessage[receiver] });

  newestMessage[receiver] = null;
});

router.get('/long-poll', async (req, res) => {
  const sender = req.query.sender as string;

  if (!sender) {
    return res.status(400).end();
  }

  const receiver = sender === '0' ? 1 : 0;

  listeners[receiver].push((message) => {
    res.json({ data: message });

    if (message === newestMessage[receiver]) {
      newestMessage[receiver] = null;
    }
  });
});

wss.server?.on('connection', (ws: WebSocket) => {
  ws.on('message', (messageString: string) => {
    const message: IMessage = JSON.parse(messageString);

    // poll
    newestMessage[message.sender as 0 | 1] = message;

    // long-poll
    listeners[message.sender as 0 | 1].forEach((listener) => {
      listener(message);
    });
    listeners[message.sender as 0 | 1] = [];

    // socket
    wss.server?.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });
  });
});

export const messagesRouter = router;
