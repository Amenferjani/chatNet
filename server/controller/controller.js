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
        const userNameExist = await User.findOne({ username });
        if (userNameExist) {
            return res.status(409).json({ message: "This username is already in use." });
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
            return res.status(404).json({ error: "User not found", code: "USER_NOT_FOUND" });
        }
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

const updateUserPassword = async (req, res) => {
    const {
        currentPassword,
        newPassword,
        userId
    } = req.body;
    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ error: "User not found", code: "USER_NOT_FOUND" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password", code: "INVALID_PASSWORD" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({message : "Internal server error"})
    }
}

const updateUsername = async (req, res) => {
    const {
        username,
        userId
    } = req.body;

    try {
        const user = await User.findById({ userId });
        if(!user){
            return res.status(404).json({ error: "User not found", code: "USER_NOT_FOUND" });
        }
        if (user.username === username) {
            return res.status(200).json({ message: 'Username already in use'});
        }
        user.username = username;
        await user.save();

        res.status(200).json({ message: "username updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({message : "Internal server error"});
    }
}

const updateUserImage = async (req, res) => {
    const { userId } = req.body;
    const buffer = req.file.buffer;
    const mimetype = req.file.mimetype;

    try {
        const user = await User.findById();
        user.img.data = buffer;
        user.img.contentType = mimetype;
        await user.save();

        res.status(200).json({ message: 'Profile picture updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    // ? user section
    getUserById,
    createUser,
    getUserByEmailAndPassword,
    updateUserPassword,
    updateUsername,
    updateUserImage,
};
