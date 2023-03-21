const express = require("express");
const http = require("http");

const app = express();

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const socketIO = require("socket.io");
const io = socketIO(server, {
    reconnection: false,
    path: "/server",
    cookie: true,
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const {
    addUser,
    removeUser,
    getUser,
    getUserByName,
    countUsers,
    setUserRoom,
} = require("./user");
const {
    createLobby,
    deleteLobby,
    enterRoom,
    removeUserFromLobby,
    playerIsReady,
    getLobby,
    getLobbies,
    verifyLobbyWinners,
} = require("./lobby");

io.on("connection", (socket) => {
    // new user
    socket.on("newUser", ({ name }, callback) => {
        const { error, user } = addUser({ id: socket.id, name });
        if (error) {
            console.error(error);
            callback({ done: false, message: error });
            return;
        }

        console.log("New user", user);
        socket.user = user;

        callback({ done: true, message: "created" });

        // send to others
        socket.broadcast.emit("listRooms", {
            rooms: getLobbies(),
        });
        socket.broadcast.emit("userCount", {
            nbUsers: countUsers(),
        });
    });

    // get count
    socket.on("getCount", (callback) => {
        callback({ nbUsers: countUsers() });
    });

    // create room
    socket.on("createRoom", ({ roomName, userName }, callback) => {
        const user = getUserByName(userName);

        const { error } = createLobby({
            name: roomName,
            admin: user,
        });

        if (error) {
            console.error(error);
            callback({ done: false, message: error });
            return;
        }

        console.log("New room", roomName);

        setUserRoom({ id: user.id, room: roomName });
        socket.user = user;
        console.log("User joined a room", user);
        callback({ done: true, message: "User joined a room" });

        // send to others
        socket.broadcast.emit("listRooms", {
            rooms: getLobbies(),
        });
    });

    // enter room
    socket.on("enterRoom", ({ roomName, userName }, callback) => {
        const user = getUserByName(userName);

        const { error } = enterRoom({
            lobbyName: roomName,
            userName: userName,
        });

        if (error) {
            console.error(error);
            callback({ done: false, message: error });
            return;
        }

        setUserRoom({ id: user.id, room: roomName });
        socket.user = user;
        console.log("User joined a room", user);
        callback({ done: true, message: "User joined a room" });

        // send to others
        socket.broadcast.emit("listRooms", {
            rooms: getLobbies(),
        });
    });

    // ready in lobby
    socket.on("readyInLobby", ({ roomName, userName }, callback) => {
        const { error } = playerIsReady({
            lobbyName: roomName,
            userName: userName,
        });

        if (error) {
            console.error(error);
            callback({ done: false, message: error });
            return;
        }

        callback({ done: true, message: "User is ready" });

        // @todo update only players in this room, not all broadcast
        socket.broadcast.emit("listRooms", {
            rooms: getLobbies(),
        });
    });

    // quit lobby
    socket.on("quitLobby", ({ roomName, userName }, callback) => {
        const user = getUserByName(userName);
        if (user) {
            setUserRoom({ id: user.id });
        }
        console.log(`${userName} has quit the room "${roomName}"`, user);
        const { lobby, error } = removeUserFromLobby({
            userName: userName,
            lobbyName: roomName,
        });
        if (error) {
            callback({ done: false, message: error });
        }
        if (lobby) {
            if (Object.keys(lobby.users).length < 1) {
                deleteLobby(lobby.name);
            } else if (lobby.admin == userName) {
                lobby.admin = Object.keys(lobby.users)[0];
            }
        }
        callback({ done: true, message: "user quit lobby" });

        // update others
        socket.broadcast.emit("listRooms", {
            rooms: getLobbies(),
        });
    });

    // get Lobby info
    socket.on("getLobbies", (callback) => {
        callback({ rooms: getLobbies() });
    });
    socket.on("getLobby", ({ roomName }, callback) => {
        const lobby = getLobby(roomName);
        if (lobby) {
            callback({ lobby: lobby });
        } else {
            callback({ lobby: null });
        }
    });

    // start game
    socket.on("newRound", ({ roomName }) => {
        const lobby = getLobby(roomName);
        if (lobby) {
            lobby.state = "playing";
            lobby.rounds.push({});
            console.log(`⭐ a new round started in ${roomName} room`);

            // @todo should send only to concerned players...
            socket.broadcast.emit("startGame", {
                roomName: roomName,
            });

            // Countdown until next round
            setTimeout(() => {
                lobby.state = "results";
                for (let user in lobby.users) {
                    // only ready, if null, means they lost before
                    if (lobby.users[user] === "ready") {
                        lobby.users[user] = "not-ready";
                    }
                }

                // verify who won?
                verifyLobbyWinners(lobby);

                // is it the last round?
                if (lobby.winners.length == 1) {
                    const lastRound = {};
                    lastRound[lobby.winners[0]] = true;
                    lobby.rounds.push(lastRound);
                    lobby.state = "done";
                }

                socket.broadcast.emit("listRooms", {
                    rooms: getLobbies(),
                });
                console.log(
                    `✉️ results for the latest round in ${roomName} room are in!`
                );
            }, 5500);
        }
    });

    // move
    socket.on("makeMove", ({ roomName, userName, move }) => {
        const lobby = getLobby(roomName);
        if (lobby) {
            lobby.rounds[lobby.rounds.length - 1][userName] = move;
            console.log(`${userName} launched a ${move} [${roomName} room]`);
        }
    });

    // disconnect
    socket.on("disconnect", function () {
        if (socket.user) {
            console.log("User disconnected", socket.user);
            const user = removeUser(socket.user.id);
            if (user) {
                socket.broadcast.emit("userCount", {
                    nbUsers: countUsers(),
                });
                if (typeof user.room === "string" && user.room !== "") {
                    const { lobby } = removeUserFromLobby({
                        userName: user.name,
                        lobbyName: user.room,
                    });
                    if (lobby) {
                        if (Object.keys(lobby.users).length < 1) {
                            deleteLobby(lobby.name);
                        } else if (lobby.admin == user.name) {
                            lobby.admin = Object.keys(lobby.users)[0];
                        }
                    }
                }

                // update others
                socket.broadcast.emit("listRooms", {
                    rooms: getLobbies(),
                });
                socket.broadcast.emit("userCount", {
                    nbUsers: countUsers(),
                });
            }
        }
    });
});
