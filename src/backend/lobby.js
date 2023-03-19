const lobbies = [];

const createLobby = ({ name, admin }) => {
    //name = name.trim().toLowerCase();

    const existingLobby = lobbies.find((lobby) => {
        return lobby.name === name;
    });

    if (existingLobby) {
        return { error: "Lobby already exists" };
    }
    const lobby = {
        name: name,
        admin: admin,
        users: [admin],
        state: "waiting",
    };

    lobbies.push(lobby);
    return { lobby };
};

const deleteLobby = ({ lobbyName }) => {
    const index = lobbies.findIndex((lobby) => {
        return lobby.name === lobbyName;
    });

    if (index !== -1) {
        return lobbies.splice(index, 1)[0];
    }

    return { error: "Can't delete lobby" };
};

const enterRoom = ({ lobbyName, userName }) => {
    console.log(lobbyName);
    console.log(lobbies);
    const lobbyIndex = lobbies.findIndex((lobby) => {
        return lobby.name === lobbyName;
    });

    console.log(lobbyIndex);

    if (lobbyIndex !== -1) {
        console.log(lobbies[lobbyIndex]);
        lobbies[lobbyIndex].users.push(userName); // @todo test if user is there already
        console.log(lobbies[lobbyIndex].users);
        return lobbies[lobbyIndex];
    }

    return { error: "Can't enter room" };
};

const removeUserFromLobby = ({ userId, lobbyName }) => {
    const lobbyIndex = lobbyName.findIndex((lobby) => {
        return lobby.name === lobbyName;
    });

    if (lobbyIndex !== -1) {
        const userIndex = lobbies[lobbyIndex].users.findIndex((user) => {
            return user.id === userId;
        });

        if (userIndex !== -1) {
            return lobbies[lobbyIndex].users.splice(userIndex, 1)[0];
        }
    }

    return { error: "Can't remove user from room" };
};

const getLobby = ({ name }) => lobbies.find((lobby) => lobby.name === name);

const getLobbies = () => lobbies;

module.exports = {
    createLobby,
    deleteLobby,
    enterRoom,
    removeUserFromLobby,
    getLobby,
    getLobbies,
};
