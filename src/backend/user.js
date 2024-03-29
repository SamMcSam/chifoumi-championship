const users = [];

const addUser = ({ id, name }) => {
    name = name.trim().toLowerCase();

    const existingUser = users.find((user) => {
        return user.name === name;
    });

    if (existingUser) {
        return { error: "Username is taken" };
    }
    const user = { id, name }; // @todo add stats etc?

    users.push(user);
    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id;
    });

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }

    return { error: "Can't remove user" };
};

const getUser = (id) => users.find((user) => user.id === id);
const getUserByName = (name) => users.find((user) => user.name === name);

const countUsers = () => users.length;

const setUserRoom = ({ id, room }) => {
    const index = users.findIndex((user) => {
        return user.id === id;
    });

    if (index !== -1) {
        if (room) {
            users[index].room = room;
        } else {
            delete users[index].room;
        }
    }
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserByName,
    countUsers,
    setUserRoom,
};
