// import { client } from './database';

// async

// client.then((client) => {
//   const changeStream = client.db('apuw-lab-2').collection('messages').watch();

//   changeStream.on('change', function (change) {
//     if (change.operationType !== 'insert') return;

//     newMessage[String(change.fullDocument.sender)] = change.fullDocument;
//   });
// });
