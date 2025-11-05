// lib/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

/**
 * Get or create the singleton socket client.
 * Make sure NEXT_PUBLIC_SOCKET_URL is set (e.g. http://localhost:5000)
 */
export const getSocket = () => {
    if (socket) return socket;

    const url = process.env.NEXT_PUBLIC_SOCKET_URL;

    socket = io(url, {
        transports: ['websocket'],
        autoConnect: true,
    });

    
    socket.on('connect_error', (err) => {
        console.warn('socket connect_error', err);
    });

    return socket;
};
