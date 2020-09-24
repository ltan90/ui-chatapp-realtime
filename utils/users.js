const users = [];

const addUser = ({ id, username, userInfo, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // const existingUser = users.find((user) => user.room === room && user.username === username);
    // if(existingUser){
    //     return {error: 'Username is taken'}
    // }

    const user = { id, username, userInfo, room };
    users.push(user);
    return user;
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => users.find(user => user.id === id);

const countUser = () => users.length;

module.exports = { addUser, removeUser, getUser, countUser };
