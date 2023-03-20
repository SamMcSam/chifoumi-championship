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
        rounds: [],
        winners: [],
    };
    lobby.users[admin.name] = "not-ready";

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
        lobbies[lobbyIndex].users[userName] = "not-ready";
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
            return { lobby: lobbies[lobbyIndex] };
        }
    }

    return { error: "Can't remove user from room" };
};

const playerIsReady = ({ lobbyName, userName }) => {
    const lobbyIndex = lobbies.findIndex((lobby) => {
        return lobby.name === lobbyName;
    });

    if (lobbyIndex !== -1) {
        return (lobbies[lobbyIndex].users[userName] = "ready");
    }

    return { error: "Can't ready player" };
};

const getLobby = (name) => lobbies.find((lobby) => lobby.name === name);

const getLobbies = () => lobbies;

const verifyLobbyWinners = (lobby) => {
    lobby.winners = [];
    const lastRound = lobby.rounds[lobby.rounds.length - 1];
    let hasRock = false;
    let rockPlayers = [];
    let hasPaper = false;
    let paperPlayers = [];
    let hasScissor = false;
    let scissorPlayers = [];
    for (let user in lastRound) {
        switch (lastRound[user]) {
            case "✊":
                hasRock = true;
                rockPlayers.push(user);
                break;
            case "🤚":
                hasPaper = true;
                paperPlayers.push(user);
                break;
            default:
                hasScissor = true;
                scissorPlayers.push(user);
                break;
        }
    }
    if (
        (hasPaper && hasRock && hasScissor) ||
        (hasPaper && !hasRock && !hasScissor) ||
        (!hasPaper && hasRock && !hasScissor) ||
        (!hasPaper && !hasRock && hasScissor) ||
        (!hasPaper && !hasRock && !hasScissor) // what to do with this case?
    ) {
        console.log("No winner this round! [" + lobby.name + "]");
    } else {
        if (hasPaper && hasRock && !hasScissor) {
            lobby.winners = paperPlayers;
            console.log("🤚 wins! [" + lobby.name + "]");
        } else if (hasPaper && !hasRock && hasScissor) {
            lobby.winners = scissorPlayers;
            console.log("✌️ wins! [" + lobby.name + "]");
        } else if (!hasPaper && hasRock && hasScissor) {
            lobby.winners = rockPlayers;
            console.log("✊ wins! [" + lobby.name + "]");
        }
    }
};

module.exports = {
    createLobby,
    deleteLobby,
    enterRoom,
    removeUserFromLobby,
    playerIsReady,
    getLobby,
    getLobbies,
    verifyLobbyWinners,
};
