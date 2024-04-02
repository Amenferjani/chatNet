
const socketIO = require('socket.io');
let io;

const setupSocket = (server) => {
    console.log("setupSocket called")
    io = socketIO(server);
    console.log("io created")

    io.on('connection', (socket) => {
        console.log('A user connected');

        //? Messages section
        socket.on('addMessage', (message) => {
            console.log('addMessage event received:', message);
            io.to(message.conversationId).emit('addMessage', message);
        });

        //? User section
        socket.on('updateUserImg', (updatedImg) => {
            console.log('update user image event received:', updatedImg);
            io.emit('updateUserImg', updatedImg);
        });

        socket.on('updateUserName', (updatedUser) => {
            console.log('update user name event received:', updatedUser);
            io.emit('updateUserName', updatedUser);
        });

        //? Conversation section
        socket.on('createConversation', (conversation) => {
            console.log('addConversation event received:', conversation);
            io.to(conversation.conversationId).emit('createConversation', conversation);
        });

        socket.on('addMembers2Conversation', (members) => {
            console.log('add member to Conversation event received:', members);
            io.to(members.conversationId).emit('addMembers2Conversation', members);
        });

        socket.on('updateConversationName', (updatedName) => {
            console.log('update Conversation name event received:', updatedName);
            io.to(updatedName.conversationId).emit('updateConversationName', updatedName);
        });

        socket.on('updateConversationImage', (updatedImg) => {
            console.log('update Conversation name event received:', updatedImg);
            io.to(updatedImg.conversationId).emit('updateConversationName', updatedImg.img);
        });

        socket.on('deleteConversation', (conversationId) => {
            console.log('delete Conversation event received:', conversationId);
            io.to(conversationId).emit('deleteConversation', conversationId);
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
