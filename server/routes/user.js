    const express = require('express');
    const router = express.Router();
    const multer = require('multer');
    const controller = require('../controller/controller');

    const upload = multer({ 
        storage:  multer.memoryStorage(),
    });

    //? Endpoint for getting user by ID
    router.get('/getUserById/:userId',
        controller.getUserById);

    //? Endpoint for getting user by email and password
    router.post('/get-user-login-info',
        controller.getUserByEmailAndPassword);

    //?  Endpoint for creating a new user
    router.post('/',
        controller.createUser);

    //? Endpoint for updating user password
    router.put('/:id/update-password',
        controller.updateUserPassword);

    //? Endpoint for updating user image
    router.put('/update-user-image',
        upload.single('profilePicture'),
        controller.updateUserImage);

    module.exports = router;
