const lobbies = [];

const createLobby = ({ name, admin }) => {
    const existingLobby = lobbies.find((lobby) => {
        return lobby.name === name;
    });

    if (existingLobby) {
        return { error: "Room already exists" };
    }
    const lobby = {
        name: name,
        admin: admin.name,
        users: {},
        state: "waiting",
        results: [],
    };
    lobby.users[admin.name] = false;

    lobbies.push(lobby);
    return { lobby };
};

const deleteLobby = (lobbyName) => {
    const index = lobbies.findIndex((lobby) => {
        return lobby.name === lobbyName;
    });

    if (index !== -1) {
        return lobbies.splice(index, 1)[0];
    }

    return { error: "Can't delete lobby" };
};

const enterRoom = ({ lobbyName, userName }) => {
    const lobbyIndex = lobbies.findIndex((lobby) => {
        return lobby.name === lobbyName;
    });

    if (lobbyIndex !== -1) {
        lobbies[lobbyIndex].users[userName] = false;
        return lobbies[lobbyIndex];
    }

    return { error: "Can't enter room" };
};

const removeUserFromLobby = ({ userName, lobbyName }) => {
    const lobbyIndex = lobbies.findIndex((lobby) => {
        return lobby.name === lobbyName;
    });

    if (lobbyIndex !== -1) {
        if (lobbies[lobbyIndex].users.hasOwnProperty(userName)) {
            delete lobbies[lobbyIndex].users[userName];
            return lobbies[lobbyIndex];
        }
    }

    return { error: "Can't remove user from room" };
};

const playerIsReady = ({ lobbyName, userName }) => {
    const lobbyIndex = lobbies.findIndex((lobby) => {
        return lobby.name === lobbyName;
    });

    if (lobbyIndex !== -1) {
        return (lobbies[lobbyIndex].users[userName] = true);
    }

    return { error: "Can't ready player" };
};

const getLobby = (name) => lobbies.find((lobby) => lobby.name === name);

const getLobbies = () => lobbies;

module.exports = {
    createLobby,
    deleteLobby,
    enterRoom,
    removeUserFromLobby,
    playerIsReady,
    getLobby,
    getLobbies,
};
