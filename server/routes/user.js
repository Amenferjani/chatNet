    const express = require('express');
    const router = express.Router();
    const controller = require('../controller/controller');

//!! Endpoint for getting user by ID
    router.get('/getUserById/:userId',
        controller.getUserById);

    // //!Endpoint for getting user by email and password
    router.post('/get-user-login-info',
        controller.getUserByEmailAndPassword);
    // //!! Endpoint for creating a new user
    router.post('/',
        controller.createUser);

    // //!! Endpoint for updating user password
    // router.put('/:id/update-password',
    //     controller.updateUserPassword);

    // //!! Endpoint for updating user image
    // router.put('/:userId/update-image/:imageId',
    //     controller.updateUserImage);

    module.exports = router;
