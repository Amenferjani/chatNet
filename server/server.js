const express = require('express');
const http = require('http');
const socketIO = require('socket.io');


const app = require("./app");
const server = http.createServer(app);
const io = socketIO(server);



io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
global.io = io;
module.exports = { app, server, io };