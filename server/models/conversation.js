const mongoose = require("mongoose");
const conversationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [private, group],
        default : private
    },
    img: {
        data: Buffer,
        contentType: String,
        default: null,
    },
    members: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'message' },
})
const conversation = mongoose.model("Conversation", conversationSchema);
module.exports = conversation;