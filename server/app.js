const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { setupSocket } = require('./socket');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/messages');
const conversationRoutes = require('./routes/conversation');

app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/conversation', conversationRoutes);

const server = http.createServer(app);
setupSocket(server);
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, server };