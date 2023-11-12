import { io, Socket } from 'socket.io-client';

export const socket: Socket = io(import.meta.env.VITE_REACT_APP_API_SOCKET_URL);

export const connectSocket = (token: string) => {
	socket.auth = { token };
	socket.connect();
};

export const disconnectSocket = () => {
	socket.disconnect();
};
