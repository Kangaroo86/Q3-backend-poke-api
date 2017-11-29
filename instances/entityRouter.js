const express = require('express');
const router = express.Router();
const entityController = require('./entityController');

router.get('/users', entityController.getAllUsers);
router.get('/users/:id(\\d+)', entityController.getUserById);
router.patch('/users/:id(\\d+)', entityController.updateUser);
router.post('/users', entityController.addUser);
router.post('/token', entityController.createToken);

module.exports = router;
