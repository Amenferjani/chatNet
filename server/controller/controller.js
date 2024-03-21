const express = require('express');
const User = require('../models/user');
const Message = require('../models/message');
const Conversation = require('../models/conversation');
const conn = require('../config/connection'); 
const bcrypt = require("bcrypt");
const generateToken = require('../utils/token');

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
        if (!user) {
            return res.status(404).json({ error: "User not found", code: "USER_NOT_FOUND" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password", code: "INVALID_PASSWORD" });
        }
        delete user.password;
        const token = generateToken(user);

        res.status(200).json({ user: user, token: token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    };
};

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
    const userId = req.userId; 
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.img.data = req.file.buffer;
        user.img.contentType = req.file.mimetype;
        await user.save();
        global.io.emit("updateUserImg",{
            img: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });
        res.status(200).json({ message: 'User image updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
/*************** message section ***************/

const getMessageById = async (req, res) => {
    const messageId = req.params.messageId
    try {
        const message = await Message.findById(messageId);
        if (!message) {
            res.status(404).json({message:"message not found"})
        }
        res.status(200).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}
const addMessage = async (req, res) => {
    const userId = req.params.userId;
    const conversationId = req.params.conversationId;
    const {
        content,
        timestamp,
    } = req.body;
    try {
        const message = await Message.create({
        sender: userId,
        conversation: conversationId,
        content: content,
        timestamp: timestamp,
        seen: false,
    });
        global.io.to(conversationId).emit( 'addMessage', message); 
        res.status(200).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: " Internal server error" });
    }
};

const deleteMessage = async (req, res) => {
    const msgId = req.params.msgId;
    try {
        const message = await Message.findByIdAndDelete(msgId);
        if (!message) {
            return res.status(400).json({ message: 'No message with that ID' });
        }
        global.io.emit(message.conversation, { action: 'deleteMsg', data: message._id })
        res.status(200).json({ message: 'Message deleted ' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getMessagesByConversationId = async (req, res) => {
    const { conversationId } = req.params;
    const { page = 1, pageSize = 10 } = req.body;
    try {
        const messages = await Message.find({ conversationId })
            .sort({ timestamp: -1 })
            .skip((page - 1) * pageSize)
            .limit(Number(pageSize));

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    };
};

const getConversationById = async (req, res) => {
    const conversationId = req.params.conversationId;
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            res.status(404).json({ message: 'No conversation found.' });
        }
        res.json(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    };
};

const getConversationsByUserId = async (req, res) => {
    const userId = req.params.userId;
    try {
        const conversations = await Conversation.find({ members: userId });
        res.status(200).json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    };
};

const createConversation = async (req, res) => {
    const { members, name } = req.body;
    
    try {
        const type = members.length > 2 ? 'group' : 'private';
        const conversation = await Conversation.create({
            type: type,
            members: members,
            name: name ? name : '',
        });
        members.forEach(memberId => {
            global.io.to(memberId).emit("createConversation",{conversation})
        });
        res.status(201).json(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    };
};
const deleteConversation = async (req, res) => {
    const { conversationId, memberId } = req.params;

    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'No conversation found.' });
        };
        if (conversation.members.length === 1) {
            conversation.members = [];
            await conversation.save();
            global.io.to(memberId).emit("deleteConversation",  conversationId );
            return res.status(200).json({ message: 'Conversation deleted successfully' });
        };
        conversation.members = conversation.members.filter(member =>
            member.toString() !== memberId
        );

        await conversation.save();
        global.io.to(memberId).emit("deleteConversation", conversationId);
        res.status(200).json(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    };
};
const addMembers2Conversation = async (req, res) => {
    const conversationId = req.params.conversationId;
    const members = req.body.members;
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            res.status(404).json({ message: 'No conversation found.' });
        }
        members.forEach(member => {
            conversation.members.push(member);
        });
        await conversation.save();
        global.io.to(conversationId).emit("addMembers2Conversation", members);
        res.status(201).json(conversation.members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    };
};
const updateConversationName = async (req, res) => {
    const conversationId = req.params.conversationId;
    const name = req.body.name;
    try {
        const conversation = await Conversation.findById({ conversationId });
        if(!conversation){
            return res.status(404).json({ error: "Conversation not found", code: "CONVERSATION_NOT_FOUND" });
        }
        if (conversation.name === name) {
            return res.status(200).json({ message: 'Name already in use'});
        }
        conversation.name = name;
        await conversation.save();
        global.io.to(conversationId).emit("updateConversationName",conversation.name);
        res.status(200).json({ message: "Conversation name updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    };
};
const updateConversationImage = async (req, res) => {
    const conversationId = req.params.conversationId; 
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        conversation.img.data = req.file.buffer;
        conversation.img.contentType = req.file.mimetype;
        await conversation.save();

        global.io.to(conversationId).emit("updateConversationImage", {
            img: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });

        res.status(200).json({ message: 'Conversation image updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
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
    // ? message section
    getMessageById,
    addMessage,
    deleteMessage,
    getMessagesByConversationId,
    //? conversation section
    getConversationById,
    getConversationsByUserId,
    createConversation,
    deleteConversation,
    addMembers2Conversation,
    updateConversationName,
    updateConversationImage,
};
