const mongoose = require("mongoose");
const conversationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["private", "group"],
        default: "private"
    },
    img: {
        data: Buffer,
        contentType: String,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    lastMessage: { type: Date, default: Date.now },
    name: String,
});
const conversation = mongoose.model("conversation", conversationSchema);
module.exports = conversation;