const mongoose = require('mongoose');


mongoose.connect("mongodb+srv://amen:amen1234@cluster.f4rts7w.mongodb.net/chatnet?retryWrites=true&w=majority")

const conn = mongoose.connection;
conn.once('open', () => {
    console.log("connected");
})
conn.on('error', () => {
    console.log("error ");
})

module.exports = conn;