import { NextApiHandler } from 'next';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

const connection = client.connect();

let newMessage = {
  '0': null,
  '1': null,
};

connection.then((client) => {
  const changeStream = client.db('apuw-lab-2').collection('messages').watch();

  changeStream.on('change', function (change) {
    if (change.operationType !== 'insert') return;

    newMessage[String(change.fullDocument.sender)] = change.fullDocument;
  });
});

const handler: NextApiHandler = async (req, res) => {
  await connection;

  if (req.method === 'GET') {
    const sender = req.query.sender as string;

    if (!sender) {
      res.status(400).json({ data: null });
      return;
    }

    const receiver = sender === '0' ? '1' : '0';

    const start = performance.now();
    while (!newMessage[receiver] && performance.now() - start < 20_000) {}

    res.json({ data: newMessage[receiver] });
    newMessage[receiver] = null;
  } else {
    res.status(501).end();
  }
};

export default handler;
