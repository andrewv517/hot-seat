import {io, Socket} from 'socket.io-client';
import {v4 as uuidv4} from 'uuid';

class SocketioService {
    socket: Socket;
    uuid: string;
    constructor() {
        this.uuid = uuidv4();
        this.socket = io('http://192.168.1.3:3000/', {reconnection: true, reconnectionAttempts: Infinity});
        this.socket.emit('create', this.uuid);
    }

    disconnect() {
        this.socket.disconnect();
    }

}

export default new SocketioService();