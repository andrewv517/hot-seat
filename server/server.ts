import {Server, Socket} from "socket.io";
import {createServer} from "http";

const httpServer = createServer();

interface GameData {
    players: { [clientId: string]: PlayerData },
    playerInHotSeat: number,
    // ...
}

const rooms: { [gameId: string]: GameData } = {};
const idToRoom: { [clientId: string]: string } = {};

const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:8080", "http://192.168.1.9:8080"],
    }
});

interface PlayerData {
    name: string,
    number: number,
    response: string | null,
}

io.on('connect_error', err => {
    console.log(`connect error due to ${err}`);
})

// connection event
io.on('connection', (socket: Socket) => {
    socket.emit('init', {data: 'Hello World!'})
    console.log('received connected');

    socket.on('newGame', (nickname) => {
        // generate room id
        let roomName = "";

        for (let i = 0; i < 5; i++) {

            if (Math.random() < 0.5) {
                // letter
                roomName += (String.fromCharCode(Math.trunc(Math.random() * (90 - 65 + 1)) + 65));
            } else {
                // number
                roomName += Math.trunc(Math.random() * 10);
            }

        }

        // id of player key, room id as value
        rooms[roomName] = {
            players: {},
            playerInHotSeat: 1, // TODO: increment on a socket thingy
        };
        rooms[roomName].players[socket.id] = {
            name: nickname,
            number: 1,
            response: null,
        };
        idToRoom[socket.id] = roomName;
        socket.join(roomName);
        socket.data.number = 1;
        socket.emit('roomName', roomName, nickname);
        socket.emit('update', rooms[roomName]);
        console.log('new game created!');
    });

    socket.on('joinGame', (code, nickname) => {
        const room = io.sockets.adapter.rooms.get(code);
        if (!room) {
            console.log(`UNKNOWN CODE: ${code}`);
            socket.emit('unknownGame');
            return;
        }
        rooms[code].players[socket.id] = {
            name: nickname,
            number: Object.keys(rooms[code].players).length + 1,
            response: null,
        };
        socket.join(code);
        idToRoom[socket.id] = code;
        socket.emit('roomName', code, nickname);

        // woah
        io.sockets.in(code).emit('update', rooms[code]);
    })

    socket.conn.on('close', reason => {
        handleLeave(socket);
    })

    socket.on('start', () => {
        const roomId = idToRoom[socket.id];
        if (!roomId) return;
        io.sockets.in(roomId).emit('startGame');
    })

    socket.on('leave', () => {
        handleLeave(socket);
    })

    socket.on('changeName', name => {
        const roomsKey = idToRoom[socket.id];
        rooms[roomsKey].players[socket.id] = name;
        io.sockets.in(roomsKey).emit('update', rooms[roomsKey]);
    })

    socket.on('choseCard', () => {
        const room = idToRoom[socket.id];
        if (!room) return;
        io.sockets.in(room).emit('cardChosen');
    })

    socket.on('response', (response: string) => {
        const room = idToRoom[socket.id];
        if (!room) return;
        console.log(response);
        rooms[room].players[socket.id].response = response;
        io.sockets.in(room).emit('update', rooms[room]);
    })

})

const handleLeave = (socket: Socket) => {
    if (idToRoom[socket.id]) {
        const roomsKey = idToRoom[socket.id];
        const room = io.sockets.adapter.rooms.get(roomsKey);
        if (!room) {
            return;
        }
        socket.leave(roomsKey);
        const playerNumber = rooms[roomsKey].players[socket.id].number;
        delete rooms[roomsKey].players[socket.id];
        delete idToRoom[socket.id];
        socket.emit('left');

        // shift every number down thats greater
        for (const playerKey in rooms[roomsKey].players) {
            if (rooms[roomsKey].players[playerKey].number > playerNumber) {
                rooms[roomsKey].players[playerKey].number--;
            }
        }
        io.sockets.in(roomsKey).emit('update', rooms[roomsKey]);
        return;
    }
    console.log('not in a game')
}


// listen on port 3000
httpServer.listen(3000);
