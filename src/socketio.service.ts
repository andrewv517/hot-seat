import {io, Socket} from 'socket.io-client';

class SocketioService {
    socket: Socket;
    constructor() {
        this.socket = io('http://localhost:3000/');
    }
    // setupSocketConnection() {
    //     this.socket = io('http://localhost:3000/');
    // }

    disconnect() {
        this.socket.disconnect();
    }

    emit(event: string) {
        this.socket.emit(event);
    }

}

export default new SocketioService();