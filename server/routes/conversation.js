    const express = require('express');
    const router = express.Router();
    const controller = require('../controller/controller');

//? Endpoint for getting conversation by ID
router.get('/:conversationId',
    controller.getConversationById);

//? Endpoint for getting conversations by user ID
router.get('/:userId',
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
// router.put('/:conversationId/update-conversation-image/:imageId',
//     controller.updateConversationImage);

// //? Endpoint for deleting a conversation
router.delete('conversation/:conversationId/removeMemberFromConversation/:memberId', 
    controller.deleteConversation);

    module.exports = router;