const express = require('express');
const http = require('http');
const socketIO = require('socket.io');


const app = require("./app");
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('addMessage', (message) => {
        console.log('addMessage event received:', message);
        io.to(message.conversationId).emit('addMessage', message);
    });
    socket.on('createConversation', (conversation) => {
        console.log('addConversation event received:', conversation);
        io.to(conversation.conversationId).emit('addConversation', conversation);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
global.io = io;
module.exports = { app, server, io };