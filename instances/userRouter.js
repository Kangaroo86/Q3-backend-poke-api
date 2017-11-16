const express = require('express');
const Boom = require('boom');

const router = express.Router();
const userController = require('./userController');

router.get('/users', userController.getAllUser);
router.get('/users/:id(\\d+)', userController.getUserById);
router.patch('/users/:id(\\d+)', userController.updateUser);
router.post('/users', userController.addUser);

module.exports = router;
