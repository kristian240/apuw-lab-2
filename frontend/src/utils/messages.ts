import { IMessage } from '../interfaces/IMessage';

export const sendMessage = (message: IMessage) =>
  fetch('http://localhost:3030/messages', {
    method: 'POST',
    body: JSON.stringify(message),
    headers: {
      'content-type': 'application/json',
    },
  });

export const fetchAllMessages = () =>
  fetch('http://localhost:3030/messages').then((res) => res.json());

export const poolNewMessage = (sender: number) =>
  fetch(`http://localhost:3030/messages/poll?sender=${sender}`).then((res) => res.json());

export const longPoolNewMessage = (sender: number, { signal }) =>
  fetch(`http://localhost:3030/messages/long-poll?sender=${sender}`, { signal }).then((res) =>
    res.json()
  );
