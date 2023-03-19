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
    getLobby,
    getLobbies,
} = require("./lobby");

io.on("connection", (socket) => {
    // new user
    socket.on("newUser", ({ name }, callback) => {
        const { error, user } = addUser({ id: socket.id, name });

        if (error) {
            console.error(error);
            if (typeof callback === "function") {
                return callback(error);
            } else {
                return;
            }
        }

        console.log("New user", user);

        socket.broadcast.emit("userCount", {
            nbUsers: countUsers(),
        });

        socket.broadcast.emit("listRooms", {
            rooms: getLobbies(),
        });

        if (typeof callback === "function") {
            callback();
        }
    });

    // create room
    socket.on("createRoom", ({ roomName, user }, callback) => {
        const { error, lobby } = createLobby({
            name: roomName,
            admin: user,
        });

        if (error) {
            console.error(error);
            if (typeof callback === "function") {
                return callback(error);
            } else {
                return;
            }
        }

        console.log("New room", roomName);
        console.log("User joined a room", user, roomName);

        socket.broadcast.emit("listRooms", {
            rooms: getLobbies(),
        });

        if (typeof callback === "function") {
            callback();
        }
    });

    // enter room
    socket.on("enterRoom", ({ roomName, user }, callback) => {
        const { error, lobby } = enterRoom({
            lobbyName: roomName,
            userName: user,
        });

        if (error) {
            console.error(error);
            if (typeof callback === "function") {
                return callback(error);
            } else {
                return;
            }
        }

        console.log("User joined a room", user, roomName);

        socket.broadcast.emit("listRooms", {
            rooms: getLobbies(),
        });

        if (typeof callback === "function") {
            callback();
        }
    });

    // ready in lobby
    // quit lobby
    // start game
    // send move
    // send results

    // console.log("a user connected");
    // socket.on("disconnect", () => {
    //     console.log("user disconnected");
    // });

    socket.on("disconnect", function () {
        const user = removeUser(socket.id);
        if (user) {
            console.log("User disconnected", user.name);
            // @todo test if was in a lobby
            socket.broadcast.emit("userCount", {
                nbUsers: countUsers(),
            });
        }
    });
});
