import {Server, Socket} from "socket.io";
import {createServer} from "http";

const httpServer = createServer();

export interface GameState {
    players: { [id: string]: PlayerData },
    playerInHotSeat: number,
    responseIndex: number,
    readingCards: boolean,
    countdownGoing: boolean,
    countdownFinished: boolean,
}


interface PlayerData {
    name: string,
    number: number,
    response: string | null,
    vote: PlayerData | null,
}

const rooms: { [gameId: string]: GameState } = {};
const idToRoom: { [clientId: string]: string } = {};

const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:8080", "http://10.72.22.88:8080"],
    }
});

io.on('connect_error', err => {
    console.log(`connect error due to ${err}`);
})


// connection event
io.on('connection', (socket: Socket) => {

    // until this is created, ignore everything else
    socket.on('create', (uuid: string) => {
        console.log(`received connection from ${uuid}`)
        socket.data.uuid = uuid;
        if (idToRoom[socket.data.uuid]) {
            socket.join(idToRoom[socket.data.uuid]); // TODO: same player number
        }
    })

    socket.on('newGame', (nickname) => {

        if (!socket.data.uuid) return;

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
            responseIndex: 0,
            readingCards: true,
            countdownGoing: false,
            countdownFinished: false,
        };
        rooms[roomName].players[socket.data.uuid] = {
            name: nickname,
            number: 1,
            response: null,
            vote: null,
        };
        idToRoom[socket.data.uuid] = roomName;
        socket.join(roomName);
        socket.data.number = 1;
        socket.emit('roomName', roomName, nickname);
        socket.emit('update', rooms[roomName]);
        console.log('new game created!');
    });

    socket.on('joinGame', (code, nickname) => {
        if (!socket.data.uuid) return;

        const room = io.sockets.adapter.rooms.get(code);
        if (!room) {
            console.log(`UNKNOWN CODE: ${code}`);
            socket.emit('unknownGame');
            return;
        }
        rooms[code].players[socket.data.uuid] = {
            name: nickname,
            number: Object.keys(rooms[code].players).length + 1,
            response: null,
            vote: null,
        };
        socket.join(code);
        idToRoom[socket.data.uuid] = code;
        socket.emit('roomName', code, nickname);

        // woah
        io.sockets.in(code).emit('update', rooms[code]);
    })

    socket.conn.on('close', () => {
        if (!socket.data.uuid) return;
        console.log('connection closed');
        console.log(socket.data.uuid);
        // handleLeave(socket);
    })

    socket.on('start', () => {
        if (!socket.data.uuid) return;
        const roomId = idToRoom[socket.data.uuid];
        if (!roomId) return;
        io.sockets.in(roomId).emit('startGame');
    })

    socket.on('leave', () => {
        if (!socket.data.uuid) return;
        handleLeave(socket);
    })

    socket.on('changeName', name => {
        if (!socket.data.uuid) return;
        const roomsKey = idToRoom[socket.data.uuid];
        rooms[roomsKey].players[socket.data.uuid] = name;
        io.sockets.in(roomsKey).emit('update', rooms[roomsKey]);
    })

    socket.on('choseCard', () => {
        if (!socket.data.uuid) return;
        const room = idToRoom[socket.data.uuid];
        if (!room) return;
        io.sockets.in(room).emit('cardChosen'); // FIXME: send 'update' instead
    })

    socket.on('response', (response: string) => {
        if (!socket.data.uuid) return;
        const room = idToRoom[socket.data.uuid];
        if (!room) return;
        console.log(response);
        rooms[room].players[socket.data.uuid].response = response;

        io.sockets.in(room).emit('update', rooms[room]);
    })

    socket.on('changeResponseIndex', (newIndex: number) => {
        if (!socket.data.uuid) return;
        const room = idToRoom[socket.data.uuid];
        if (!room) return;

        const len = Object.values(rooms[room].players).length;
        if (newIndex >= len) {
            rooms[room].responseIndex = 0;
        } else if (newIndex < 0) {
            rooms[room].responseIndex = len - 1;
        } else {
            rooms[room].responseIndex = newIndex;
        }
        io.sockets.in(room).emit('update', rooms[room]);
    })

    socket.on('doneReading', () => {
        if (!socket.data.uuid) return;
        const room = idToRoom[socket.data.uuid];
        if (!room) return;

        rooms[room].readingCards = false;
        io.sockets.in(room).emit('update', rooms[room]);
    })

    socket.on('randomize', () => {
        if (!socket.data.uuid) return;
        const room = idToRoom[socket.data.uuid];
        if (!room) return;
        const randomizedEntries = Object.entries(rooms[room].players).sort(() => 0.5 - Math.random());
        io.sockets.in(room).emit('random', randomizedEntries);
    })

    socket.on('vote', (player: PlayerData) => {
        if (!socket.data.uuid) return;
        const room = idToRoom[socket.data.uuid];
        if (!room) return;
        rooms[room].players[socket.data.uuid].vote = player;
        io.sockets.in(room).emit('update', rooms[room]);
    })

    socket.on('countdown', () => {
        if (!socket.data.uuid) return;
        const room = idToRoom[socket.data.uuid];
        if (!room) return;
        if (rooms[room].countdownGoing) return;
        rooms[room].countdownGoing = true;
        io.sockets.in(room).emit('update', rooms[room]);
        io.sockets.in(room).emit('startCountdown');
    })

    socket.on('countdownOver', () => {
        if (!socket.data.uuid) return;
        const room = idToRoom[socket.data.uuid];
        if (!room) return;
        if (!rooms[room].countdownGoing) return;
        if (rooms[room].countdownFinished) return;
        rooms[room].countdownGoing = false;
        rooms[room].countdownFinished = true;
        io.sockets.in(room).emit('update', rooms[room]);
        io.sockets.in(room).emit('endCountdown');
    })

})


const handleLeave = (socket: Socket) => {
    if (idToRoom[socket.data.uuid]) {
        const roomsKey = idToRoom[socket.data.uuid];
        const room = io.sockets.adapter.rooms.get(roomsKey);
        if (!room) {
            return;
        }
        socket.leave(roomsKey);
        const playerNumber = rooms[roomsKey].players[socket.data.uuid].number;
        delete rooms[roomsKey].players[socket.data.uuid];
        delete idToRoom[socket.data.uuid];
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
