const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    img: {
        data: Buffer,
        contentType: String,
    },
});

const user = mongoose.model("user", userSchema);
module.exports = user;