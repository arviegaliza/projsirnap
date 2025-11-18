import { io } from 'socket.io-client';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

const socket = io(API, {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('Connected to backend via Socket.IO');
});

export default socket;
