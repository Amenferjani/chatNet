const express = require('express');
const User = require('../models/user');
const io = require('../server'); 
const conn = require('../config/connection'); 
const bcrypt = require("bcrypt");

/*************** user section ***************/

const getUserById = async (req, res) => {
    const userId = req.params.userId;
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        global.io.emit('userDetails', { user });

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const createUser = async (req, res) => {

    const { username, password, email} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(409).json({ message: "This email is already in use." });
        }

        const user = await User.create({ email: email, password: hashedPassword, username: username }); 
        global.io.emit("newUser", { user });
        res.status(200).json({ user, message: "user created successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
const getUserByEmailAndPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({ error: "User not found", code: "USER_NOT_FOUND" });
        }
        console.log(user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password", code: "INVALID_PASSWORD" });
        }
        delete user.password; 
        res.status(200).json({ user : user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
    
}
module.exports = {
    getUserById,
    createUser,
    getUserByEmailAndPassword,
};
