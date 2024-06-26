    const express = require('express');
    const router = express.Router();
    const multer = require('multer');
    const controller = require('../controller/controller');
    const { verifyToken } = require('../utils/token');


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
    controller.createConversation);

// //? Endpoint for updating conversation name
router.put('/:conversationId/update-conversation-name',
    controller.updateConversationName);

// //? Endpoint for updating conversation members
router.put('/:conversationId/update-conversation-members',
    controller.addMembers2Conversation);

// //? Endpoint for updating conversation image
router.put('/:conversationId/update-conversation-image',
    upload.single('conversationPicture'),
    controller.updateConversationImage);

// //? Endpoint for deleting a conversation
router.put('/:conversationId/remove-member-from-conversation/:memberId', 
    controller.deleteConversation);

    module.exports = router;