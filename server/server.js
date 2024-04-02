// const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');


// const app = require("./app");
// const server = http.createServer(app);
// const io = socketIO(server);

// io.on('connection', (socket) => {
//     console.log('A user connected');
//     //?Messages section
//     socket.on('addMessage', (message) => {
//         console.log('addMessage event received:', message);
//         io.to(message.conversationId).emit('addMessage', message);
//     });
//     //?User section
//     socket.on('updateUserImg', (updatedImg) => {
//         console.log('update user image event received:', updatedImg);
//         io.emit('updateUserImg', updatedImg);
//     });
//     socket.on('updateUserName', (updatedUser) => {
//         console.log('update user name event received:', updatedUser);
//         io.emit('updateUserName', updatedUser);
//     });
//     //?Conversation section
//     socket.on('createConversation', (conversation) => {
//         console.log('addConversation event received:', conversation);
//         io.to(conversation.conversationId).emit('createConversation', conversation);
//     });
//     socket.on('addMembers2Conversation', (members) => {
//         console.log('add member to Conversation event received:', members);
//         io.to(conversationId).emit('addMembers2Conversation', members);
//     });

//     socket.on('updateConversationName', (updatedName) => {
//         console.log('update Conversation name event received:', updatedName);
//         io.to(conversationId).emit('updateConversationName', updatedName);
//     });
//     socket.on('updateConversationImage', (updatedImg) => {
//         console.log('update Conversation name event received:', updatedImg);
//         io.to(conversationId).emit('updateConversationName', updatedImg.img);
//     });
//     socket.on('deleteConversation', (conversationId) => {
//         console.log('delete Conversation event received:', conversationId);
//         io.to(memberId).emit('deleteConversation', conversationId);
//     });

//     socket.on('disconnect', () => {
//         console.log('A user disconnected');
//     });
// });

// module.exports = { app, server, io };