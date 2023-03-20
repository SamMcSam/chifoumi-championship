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
} = require("./lobby");

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
        setTimeout(() => {
            socket.broadcast.emit("listRooms", {
                rooms: getLobbies(),
            });

            socket.broadcast.emit("userCount", {
                nbUsers: countUsers(),
            });
        }, 200);
    });

    // create room
    socket.on("createRoom", ({ roomName, userName }, callback) => {
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
        setTimeout(() => {
            socket.broadcast.emit("listRooms", {
                rooms: getLobbies(),
            });
        }, 200);
    });

    // enter room
    socket.on("enterRoom", ({ roomName, userName }, callback) => {
        const user = getUserByName(userName);

        const { error, lobby } = enterRoom({
            lobbyName: roomName,
            userName: userName,
        });

        if (error) {
            console.error(error);
            if (typeof callback === "function") {
                return callback(error);
            } else {
                return;
            }
        }

        user.room = roomName;
        socket.user = user;
        console.log("User joined a room", user);

        socket.emit("confirmAction", {});

        // wait a bit
        setTimeout(() => {
            socket.broadcast.emit("listRooms", {
                rooms: getLobbies(),
            });
        }, 200);
    });

    // ready in lobby
    socket.on("readyInLobby", ({ roomName, userName }, callback) => {
        const { error } = playerIsReady({
            lobbyName: roomName,
            userName: userName,
        });

        if (error) {
            console.error(error);
            if (typeof callback === "function") {
                return callback(error);
            } else {
                return;
            }
        }

        socket.broadcast.emit("listRooms", {
            rooms: getLobbies(),
        });
    });

    // quit lobby
    // start game
    // send move
    // send results

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
