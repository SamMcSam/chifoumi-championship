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

const sendReload = (socket, alsoCount = true) => {
    setTimeout(() => {
        socket.broadcast.emit("listRooms", {
            rooms: getLobbies(),
        });

        if (alsoCount) {
            socket.broadcast.emit("userCount", {
                nbUsers: countUsers(),
            });
        }
    }, 200);
};

io.on("connection", (socket) => {
    // new user
    socket.on("newUser", ({ name }) => {
        const { error, user } = addUser({ id: socket.id, name });
        if (error) {
            console.error(error);
            socket.emit("error", {
                message: error,
            });
            return;
        }

        console.log("New user", user);
        socket.user = user;

        socket.emit("confirmAction", {});

        // wait a bit
        sendReload(socket);
    });

    // create room
    socket.on("createRoom", ({ roomName, userName }) => {
        const user = getUserByName(userName);

        const { error, lobby } = createLobby({
            name: roomName,
            admin: user,
        });

        if (error) {
            console.error(error);
            socket.emit("error", {
                message: error,
            });
            return;
        }

        console.log("New room", roomName);

        user.room = roomName;
        socket.user = user;
        console.log("User joined a room", user);

        socket.emit("confirmAction", {});

        // wait a bit
        sendReload(socket, false);
    });

    // enter room
    socket.on("enterRoom", ({ roomName, userName }) => {
        const user = getUserByName(userName);

        const { error, lobby } = enterRoom({
            lobbyName: roomName,
            userName: userName,
        });

        if (error) {
            console.error(error);
            socket.emit("error", {
                message: error,
            });
            return;
        }

        user.room = roomName;
        socket.user = user;
        console.log("User joined a room", user);

        socket.emit("confirmAction", {});

        // wait a bit
        sendReload(socket, false);
    });

    // ready in lobby
    socket.on("readyInLobby", ({ roomName, userName }) => {
        const { error } = playerIsReady({
            lobbyName: roomName,
            userName: userName,
        });

        if (error) {
            console.error(error);
            socket.emit("error", {
                message: error,
            });
            return;
        }

        // @todo update only this room, not all broadcast
        socket.broadcast.emit("listRooms", {
            rooms: getLobbies(),
        });
    });

    // quit lobby
    socket.on("quitLobby", ({ roomName, userName }) => {
        const lobby = removeUserFromLobby({
            userName: userName,
            lobbyName: roomName,
        });
        if (lobby) {
            if (Object.keys(lobby.users).length < 1) {
                deleteLobby(lobby.name);
            } else if (lobby.admin == userName) {
                lobby.admin = Object.keys(lobby.users)[0];
            }

            sendReload(socket);
        }
    });

    // start game
    socket.on("newRound", ({ roomName }) => {
        const lobby = getLobby(roomName);
        if (lobby) {
            lobby.state = "playing";
            lobby.rounds.push({});
            console.log(`⭐ a new round started in ${roomName} room`);

            socket.broadcast.emit("listRooms", {
                rooms: getLobbies(),
            });

            // Countdown until next round
            setTimeout(() => {
                lobby.state = "results";

                // verify who won?
                verifyLobbyWinners(lobby);

                // is it the last round?
                if (lobby.winners.length == 1) {
                    const lastRound = {};
                    lastRound[lobby.winners[0]] = true;
                    lobby.rounds.push(lastRound);
                }

                socket.broadcast.emit("listRooms", {
                    rooms: getLobbies(),
                });
                console.log(
                    `✉️ results for the latest round in ${roomName} room are in!`
                );
            }, 5000);
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
        console.log("disconnect");
        if (socket.user) {
            console.log("User disconnected", socket.user);
            const user = removeUser(socket.user.id);
            if (user) {
                socket.broadcast.emit("userCount", {
                    nbUsers: countUsers(),
                });
                if (typeof user.room === "string" && user.room !== "") {
                    const lobby = removeUserFromLobby({
                        userName: user.name,
                        lobbyName: user.room,
                    });
                    if (lobby) {
                        console.log(lobby);
                        if (Object.keys(lobby.users).length < 1) {
                            deleteLobby(lobby.name);
                        } else if (lobby.admin == user.name) {
                            lobby.admin = Object.keys(lobby.users)[0];
                        }
                        socket.broadcast.emit("listRooms", {
                            rooms: getLobbies(),
                        });
                    }
                }
            }
        }
    });
});
