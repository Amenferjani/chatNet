    const express = require('express');
    const router = express.Router();
    const multer = require('multer');
    const controller = require('../controller/controller');
    const { verifyToken } = require('../utils/token');
    const { io } = require('../server');

    const upload = multer({ 
        storage:  multer.memoryStorage(),
    });
//? Endpoint for getting conversation by ID
router.get('/:conversationId',
    controller.getConversationById);

//? Endpoint for getting conversations by user ID
router.get('/conversations-by-user/:userId',
    verifyToken,
    controller.getConversationsByUserId);

// //? Endpoint for creating a new conversation
router.post('/',
    (req, res)=>controller.createConversation(req, res ,io));

// //? Endpoint for updating conversation name
router.put('/:conversationId/update-conversation-name',
    (req, res)=>controller.updateConversationName(req, res ,io));

// //? Endpoint for updating conversation members
router.put('/:conversationId/update-conversation-members',
    (req, res)=>controller.addMembers2Conversation(req, res, io));

// //? Endpoint for updating conversation image
router.put('/:conversationId/update-conversation-image',
    upload.single('conversationPicture'),
    (req, res)=>controller.updateConversationImage(req, res, io));

// //? Endpoint for deleting a conversation
router.delete('/:conversationId/remove-member-from-conversation/:memberId', 
    (req, res)=>controller.deleteConversation(req, res, io));

    module.exports = router;