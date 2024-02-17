const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    conversation : {type: mongoose.Schema.Types.ObjectId, ref: 'conversation'},
    content: String,
    timestamp: { type: Date, default: Date.now },
    seen: Boolean,
})

const message = mongoose.model('Message', messageSchema);

module.exports = message;