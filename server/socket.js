
const socketIO = require('socket.io');
var io;

const setupSocket = (server) => {
    console.log("setupSocket called")
    io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
    console.log("io created")

    io.on('connection', (socket) => {
        console.log('A user connected');

        //? Join room
        socket.on('joinRoom', (room) => {
            socket.join(room);
            console.log(`User joined room ${room}`);
        });

        //? Messages section
        socket.on('addMessage', (message) => {
            console.log('addMessage event received:', message);
            io.to(message.conversation).emit('addMessage', message);
        });

        //? User section
        socket.on('updateUserImg', (updatedImg) => {
            console.log('update user image event received:', updatedImg);
            io.to(updatedImg.room).emit('updateUserImg', updatedImg);
        });

        socket.on('updateUserName', (updatedUser) => {
            console.log('update user name event received:', updatedUser);
            io.to(updatedUser.room).emit('updateUserName', updatedUser);
        });

        //? Conversation section
        socket.on('createConversation', (conversation) => {
            console.log('addConversation event received:', conversation);
            io.to(conversation.room).emit('createConversation', conversation);
        });

        socket.on('addMembers2Conversation', (members) => {
            console.log('add member to Conversation event received:', members);
            io.to(members.room).emit('addMembers2Conversation', members);
        });

        socket.on('updateConversationName', (updatedName) => {
            console.log('update Conversation name event received:', updatedName);
            io.to(updatedName.room).emit('updateConversationName', updatedName.conversationName);
        });

        socket.on('updateConversationImage', (updatedImg) => {
            console.log('update Conversation name event received:', updatedImg);
            io.to(updatedImg.room).emit('updateConversationName', updatedImg.img);
        });

        socket.on('deleteConversation', (conversation) => {
            console.log('delete Conversation event received:', conversation);
            io.to(conversation.room).emit('deleteConversation',conversation.member );
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io has not been initialized');
    }
    return io;
};

module.exports = { setupSocket, getIO };
