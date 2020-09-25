const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { addUser, removeUser, getUser, countUser }  = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatBot';
//Loading find sales rep
var t,t1;
function startTimer(){
    t = setTimeout(function(){
        io.emit('message', formatMessage(botName, `<span class="waiting-customer">Please wait!<br/> We are finding a Customer Service agent to assist you</span>`));
    }, 60000);
    t1 = setTimeout(function(){
        io.emit('message', formatMessage(botName, `<span class="please-oops">Oops...It seems to be taking more than usual.<br/>Please hold</span>`));
    }, 120000);
}
function stopTimer(){
    clearTimeout(t);
    clearTimeout(t1);
}
//Run when client connects
io.on('connection', socket => {
    //Join Room
    socket.on('joinRoom', ({ username, userInfo, room }) => {

        const user = addUser({id: socket.id, username, userInfo, room});
      
        socket.join(user.room);

        //Welcome current user
        
        if(user.userInfo.roles !== 'sales'){
            socket.broadcast.emit('userInfo', {text: `A new Chat has just been started by ${user.userInfo.email}`, room: user.room});

            socket.emit('message', formatMessage(botName, `Thank you for messaging us. How can we help you?`));

            startTimer();
            
        }else if(user.userInfo.roles === 'sales'){
            stopTimer();

            //Broadcast when a use connects
            socket.broadcast.to(user.room).emit('message', formatMessage(botName, `<span class="chat-now">You are now chatting with ${user.userInfo.fullname} - ${user.userInfo.position}</span>`, user.userInfo));
        }
        
    });

    //Listen chat message in client
    socket.on('chatMessage', msg => {
        const user = getUser(socket.id); 

        if(countUser() == 1){
            socket.broadcast.emit('receivedMessageClient', formatMessage(user.username, msg));
        }

        //io.to(user.room).emit('message', formatMessage(user.username, msg));
        io.emit('message', formatMessage(user.username, msg));
    });

    //When a client disconnect
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        
        if(user){
            io.to(user.room).emit('message', formatMessage(user.username, `${user.username} has left.`));        
        }
    });

});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));