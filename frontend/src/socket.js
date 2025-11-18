// src/socket.js
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_BASE, {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('Connected to backend via Socket.IO');
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

export default socket;
