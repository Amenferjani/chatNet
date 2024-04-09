    const express = require('express');
    const router = express.Router();
    const controller = require('../controller/controller');

//?Endpoint for getting msg by ID
    router.get('/:id',
        controller.getMessageById);
        
//? Endpoint for getting messages by Conversation ID
    router.get('/conversation/:id/',
        controller.getMessagesByConversationId);

//? Endpoint for adding a new msg
    router.post('/user/:userId/conversation/:conversationId',
        controller.addMessage,
        controller.updateConversationMetadata
    );

//? Endpoint for deleting a msg
    router.delete('/:id',
        controller.deleteMessage);

    module.exports = router;